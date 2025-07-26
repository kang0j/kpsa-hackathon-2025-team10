/*
 * src/services/receiptAnalysisService.js
 * (신규 파일)
 * OpenAI API를 호출하여 영수증을 분석하는 핵심 AI 로직을 담당하는 모듈입니다.
 */
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = 

`  

You are an excellent health expert.

The following is the JSON format for storing the user's receipt information in the database. Analyze the receipt data and create a JSON object according to the structure below. Return only the JSON object without any other explanation.

**storeName**: This is the name of the store.

**totalAmount**: This is the total payment amount stated on the receipt. It must be an Integer.

**transactionDate**: This is the date and time the transaction occurred. It must be an ISO 8601 string in the format YYYY-MM-DDTHH:MM:SSZ.

The **items** array contains information for each item on the receipt.

**itemName**: This is the name of the product.

**price**: This is the price per item. It must be an Integer.

**quantity**: This is the quantity of the purchased product. It must be an Integer.

**categoryId**: This is the ID of the category to which the product belongs. It can be left empty for future mapping. (null or an empty string)

**healthyScore**: This is the health score for the product. It is evaluated as an integer between -5 ~ 5, with a default value of 0.

**commentByAI**: (IN KROEAN) This is a brief comment from the AI about the product. (e.g., "This is a processed food that requires caution against excessive consumption.")(IN KROEAN)

**JSON**

{
  "storeName": "Store Name",
  "totalAmount": 0,
  "transactionDate": "YYYY-MM-DDTHH:MM:SSZ",
  "items": [
    {
      "itemName": "Product Name",
      "price": 0,
      "quantity": 1,
      "categoryId": null,
      "healthyScore": 0,
      "commentByAI": "AI comment about product"
    },
    {
      "itemName": "Product Name",
      "price": 0,
      "quantity": 1,
      "categoryId": null,
      "healthyScore": 0,
      "commentByAI": "AI comment about product"
    }
  ]
}

`
async function analyzeReceipt(base64Image, mimeType) {
  console.log('OpenAI API 호출 시작 (서비스)');
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: "json_object" },
    messages: [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: '이 영수증 이미지를 분석해서 제공된 스키마에 따라 JSON 형식으로 데이터를 추출해줘.'
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 2000,
  });
  console.log('OpenAI API 응답 받음 (서비스)');
  
  const rawJson = response.choices[0].message.content;
  return JSON.parse(rawJson);
}

module.exports = {
  analyzeReceipt,
};