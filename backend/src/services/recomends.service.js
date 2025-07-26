const { PrismaClient } = require('@prisma/client');
const { OpenAI } = require('openai');

const prisma = new PrismaClient();
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 프롬프트를 동적으로 생성하는 헬퍼 함수
 * @param {string} recommendationType - 'food' 또는 'supplement'
 * @param {string} purchaseList - 구매 목록 문자열
 * @returns {string} 생성된 프롬프트
 */
function createPrompt(recommendationType, purchaseList) {
    const baseInstruction = `당신은 전문 영양사 및 건강 컨설턴트입니다. 다음은 한 사용자의 최근 구매 목록입니다. 이 목록을 바탕으로 구체적이고 실용적인 건강 조언을 한국어로 해주세요. 어조는 친근하고 따뜻하게 해주세요.`;

    let specificInstruction = '';
    if (recommendationType === 'food') {
        specificInstruction = `
            [음식 기반 조언 가이드라인]
            1.  전체적인 식습관의 긍정적인 점과 개선점을 요약해주세요.
            2.  건강 점수가 낮은 음식들의 건강한 대안을 2~3가지 제안해주세요. (예: 과자 -> 견과류, 과일)
            3.  이 구매 목록을 바탕으로 간단한 주간 식단을 추천해주세요.
            4.  사용자가 꾸준히 구매하는 건강한 음식이 있다면 칭찬하고 격려해주세요.
            
        `;
    } else { // recommendationType === 'supplement'
        specificInstruction = `
            [영양제 기반 조언 가이드라인]
            1.  구매한 영양제 목록을 기반으로 사용자의 건강 관심사를 추측해주세요.
            2.  현재 식단(음식 구매 내역)을 고려할 때, 추가로 섭취하면 좋을 영양 성분이나 영양제를 추천해주세요.
            3.  구매한 영양제들의 효능과 올바른 복용법(시간, 식전/식후 등)을 간단히 안내해주세요.
            4.  과다 복용 시 주의해야 할 점이나 함께 복용하면 좋지 않은 조합이 있다면 알려주세요.
        `;
    }

    return `
        ${baseInstruction}
        ${specificInstruction}

        [사용자 구매 목록]
        ${purchaseList}

        [분석 및 조언]
    `;
}

/**
 * 사용자 ID와 추천 타입을 기반으로 AI 건강 상담 내용을 생성합니다.
 * @param {string} userId - 사용자 ID
 * @param {string} recommendationType - 'food' 또는 'supplement'
 * @returns {Promise<string>} AI가 생성한 상담 내용
 */
async function getAiRecommendation(userId, recommendationType) {
    // 1. 타입에 따라 DB에서 조회할 카테고리 타입을 결정합니다.
    // 여기서는 DB에 'FOOD', 'SUPPLEMENT'로 저장되어 있다고 가정합니다.
    const categoryType = recommendationType.toUpperCase();

    // 2. 해당 카테고리의 거래 아이템만 조회합니다.
    const transactionItems = await prisma.transactionItem.findMany({
        where: {
            transaction: {
                userId: userId,
            }
        },
        select: {
            itemName: true,
            quantity: true,
            healthyScore: true,
        },
        orderBy: {
            transaction: {
                createdAt: 'desc',
            },
        },
        take: 50,
    });

    if (transactionItems.length === 0) {
        return `아직 분석할 ${recommendationType} 관련 거래 내역이 없습니다.`;
    }

    // 3. 조회된 데이터를 OpenAI에 전달할 형태로 가공
    const purchaseList = transactionItems.map(item =>
        `- ${item.itemName} (수량: ${item.quantity}, 건강점수: ${item.healthyScore}/10)`
    ).join('\n');

    // 4. 타입에 맞는 프롬프트 생성
    const prompt = createPrompt(recommendationType, purchaseList);

    // 5. OpenAI API 호출
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: prompt
                },
                {
                    role: 'user',
                    content: `나의 소비 데이터를 바탕으로 ${recommendationType}을 추천해줘.`
                },
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        return completion.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        throw new Error('AI 상담 내용을 생성하는 데 실패했습니다.');
    }
}

module.exports = {
    getAiRecommendation,
};