// backend/src/config/swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  // Swagger 명세의 기본 정보를 정의합니다.
  definition: {
    openapi: '3.0.0', // OpenAPI 버전
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: '프로젝트 API에 대한 명세서입니다.',
      contact: {
        name: 'Your Name',
        url: 'http://your-website.com',
        email: 'your-email@example.com',
      },
    },
    // API 서버의 기본 URL을 설정합니다.
    servers: [
      {
        url: 'http://localhost:3000',
        description: '개발 서버',
      },
    ],
    // 인증 방식을 정의할 수 있습니다 (예: JWT)
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     }
    //   }
    // },
    // security: [
    //   {
    //     bearerAuth: []
    //   }
    // ],
  },
  // API 명세가 작성된 파일들의 경로를 지정합니다.
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
