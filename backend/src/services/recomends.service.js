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

supplementRecomendation = String.raw`You are a personalized supplement recommendation AI assistant.
Your primary role is to analyze a user's consumption data and recommend the most suitable supplements from a given list.

**You MUST follow these rules:**
1.  The output format **MUST BE** a valid JSON object.
2.  The JSON object **MUST** contain two top-level keys: \`items\` and \`추천 및 독려 메세지\`.
3.  The \`items\` key **MUST** be an array of objects.
4.  Each object in the \`items\` array **MUST** have the keys: \`제품명\`, \`설명\`, \`링크\`.
5.  All recommendations **MUST** be selected from the 'Available Supplements List' provided in the prompt. Do not invent products.
6.  The \`추천 및 독려 메세지\` should be a personalized and encouraging message based on the user's data.
7.  **DO NOT** include any text, explanations, or markdown formatting outside of the JSON object. Your entire response must be the JSON itself.

---

**## Example ##**

**[User Input Example]**

* **User Consumption Data:** "일주일에 3-4번은 라면이나 편의점 도시락으로 식사를 해결합니다. 최근 오후만 되면 쉽게 피로하고 무기력함을 느낍니다."
* **Available Supplements List:**
    * 제품명: 멀티비타민 플러스, 설명: 18종의 비타민과 미네랄을 한 번에 섭취하여 균형 잡힌 영양을 제공합니다., 링크: https://example.com/multi
    * 제품명: 오메가3 부스트, 설명: 혈행 개선과 두뇌 건강에 도움을 주는 고순도 오메가3입니다., 링크: https://example.com/omega3
    * 제품명: 활력 비타민B 컴플렉스, 설명: 에너지 생성에 필수적인 비타민B군 8종을 모두 함유하여 지친 일상에 활력을 더해줍니다., 링크: https://example.com/vitamin_b

**[AI Output Example]**
\json
{
  "items": [
    {
      "제품명": "멀티비타민 플러스",
      "설명": "18종의 비타민과 미네랄을 한 번에 섭취하여 균형 잡힌 영양을 제공합니다.",
      "링크": "[https://example.com/multi](https://example.com/multi)"
    },
    {
      "제품명": "활력 비타민B 컴플렉스",
      "설명": "에너지 생성에 필수적인 비타민B군 8종을 모두 함유하여 지친 일상에 활력을 더해줍니다.",
      "링크": "[https://example.com/vitamin_b](https://example.com/vitamin_b)"
    }
  ],
  "추천 및 독려 메세지": "불규칙한 식사와 피로감으로 고민이시군요. 식사로 부족하기 쉬운 영양을 채워줄 '멀티비타민 플러스'와 일상의 활력을 되찾아 줄 '활력 비타민B 컴플렉스'를 추천해 드립니다. 꾸준한 섭취로 더 건강한 하루를 만들어보세요!"
}
`

function createPrompt(recommendationType, purchaseList) {
    const baseInstruction = `당신은 전문 영양사 및 건강 컨설턴트입니다. 다음은 한 사용자의 최근 구매 목록입니다. 이 목록을 바탕으로 구체적이고 실용적인 건강 조언을 한국어로 해주세요. 어조는 친근하고 따뜻하게 해주세요.`;

    let specificInstruction = '';
    if (recommendationType === 'food') {
        specificInstruction = '';
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