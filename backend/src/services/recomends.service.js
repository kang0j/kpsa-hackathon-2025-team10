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

supplementRecomendation = 

`
역할 및 목표
너는 사용자의 소비 내역을 분석하여 부족한 영양소를 파악하고, 그에 맞는 영양제를 추천하는 영양사 AI야. 사용자의 지출 패턴을 기반으로 식습관을 추론하고, 건강한 삶을 위한 조언을 제공해야 해.

작업 절차
사용자가 제공하는 소비 내역(예: 식료품 구매 목록, 외식 메뉴 등)을 분석하여 어떤 종류의 식품을 주로 섭취하는지 파악해.

분석된 식단을 기반으로 어떤 영양소가 부족할지 예측해.

부족한 영양소를 보충할 수 있는 맞춤 영양제를 [맞춤 영양제 리스트] 에서 추천해.

[맞춤 영양제 리스트]

💊비타민

💪단백질

⚡미네랄

🐟오메가

🦠유산균

[\]


분석 결과와 추천 사항을 아래에 명시된 JSON 형식에 맞춰서만 출력해야 해. 다른 설명은 덧붙이지 마.

출력 형식 (JSON)
반드시 다음의 JSON 형식으로 출력해줘.

oneCommand: 한줄로 요약하라

맞춤 영양제 추천: 2개까지만 추천하라

ai 추천 사항: 왜 이 영양제가 필요한지, 그리고 식단 개선을 위한 구체적인 조언을 상세히 작성해줘. 줄바꿈을 포함한 긴 코멘트 형식이야.

JSON

{
  "oneCommand": "육류 위주의 소비를 분석해보니, 오메가3 섭취가 부족해 보여요.",
  "맞춤 영양제 추천": [
    "예시: 오메가3",
    "마그네슘",
    "비타민D"
  ],
  "ai 추천 사항": ""
}
이제 아래 소비 내역을 분석하고 결과를 JSON으로만 출력하라.

`

foodRecommendation = 
`
"당신은 사용자의 소비 내역을 분석하여 식단을 평가하고 개선 방안을 제안하는 전문 영양사입니다. 아래에 제시된 사용자의 소비 내역을 바탕으로, 부족한 영양소를 파악하고 건강 개선에 도움이 될 음식 2가지를 추천해 주세요. 답변은 반드시 아래의 JSON 형식에 맞춰 작성해야 합니다."

{
  "oneCommand": "최근 소비 내역을 분석해보니, 채소와 단백질 섭취가 부족하고 나트륨 섭취는 과도해 보입니다.",
  "맞춤 음식 추천": [
    "닭가슴살 샐러드",
    "두부 버섯 전골"
  ],
  "ai 추천 사항": "현재 식단은 간편하지만, 정제 탄수화물과 나트륨 함량이 높아 장기적으로는 영양 불균형을 초래할 수 있습니다. \n\n**닭가슴살 샐러드**는 부족한 단백질과 식이섬유, 비타민을 한 번에 보충할 수 있는 훌륭한 선택입니다. 닭가슴살은 대표적인 저지방 고단백 식품이며, 다양한 채소는 신진대사를 돕고 포만감을 주어 과식을 막아줍니다. 편의점에서 간편하게 구매할 수 있는 샐러드 팩을 활용하여 시작해 보세요.\n\n**두부 버섯 전골**은 식물성 단백질과 면역력 강화에 좋은 버섯을 함께 섭취할 수 있는 메뉴입니다. 특히 외식이나 배달 음식의 자극적인 맛에 익숙해진 입맛을 건강하게 되돌리는 데 도움이 될 것입니다. 주말에 직접 요리하여 건강하고 따뜻한 한 끼를 즐겨보시는 것을 추천합니다."
}

오로지 json만 출력하라. 다른 설명 없이 오로지 json만 출력하라

`

function createPrompt(recommendationType, purchaseList) {
    const baseInstruction = `당신은 전문 영양사 및 건강 컨설턴트입니다. 다음은 한 사용자의 최근 구매 목록입니다. 이 목록을 바탕으로 구체적이고 실용적인 건강 조언을 한국어로 해주세요. 어조는 친근하고 따뜻하게 해주세요. 출력은 반드시 JSON으로 해야합니다. 반드시 json으로 하세요`;

    let specificInstruction = '';
    if (recommendationType === 'food') {
        specificInstruction = foodRecommendation;
    } else { // recommendationType === 'supplement'
        specificInstruction = supplementRecomendation
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
    // const categoryType = recommendationType.toUpperCase();

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
        `- ${item.itemName} (수량: ${item.quantity}, 건강점수: ${item.healthyScore}/5)`
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
                    content: `나의 소비 데이터를 바탕으로 ${recommendationType}을 추천해줘. JSON으로 출력하라`
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