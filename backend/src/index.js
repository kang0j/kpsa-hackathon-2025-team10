// 필요한 모듈들을 가져옵니다.
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const swaggerUi = require('swagger-ui-express');
const specs = require('./config/swagger'); // swagger.js 설정 파일 경로



// Express 애플리케이션을 생성합니다.
const app = express();
// Prisma 클라이언트 인스턴스를 생성합니다.
const prisma = new PrismaClient();

// 환경 변수에서 포트를 가져오거나, 없을 경우 3000번을 기본으로 사용합니다.
const PORT = process.env.PORT || 3000;

// 미들웨어를 설정합니다.
// express.json()은 들어오는 요청의 JSON 본문을 파싱하기 위해 필요합니다.
app.use(express.json());
// URL-encoded 데이터 파싱을 위한 미들웨어입니다.
app.use(express.urlencoded({ extended: true }));


// API 라우터를 가져와서 '/api' 경로에 등록합니다.
// './routes'는 './routes/index.js'를 가리킵니다.
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// 서버가 정상적으로 실행되고 있는지 확인하기 위한 기본 경로입니다.
app.get('/', (req, res) => {
  res.status(200).send('API 서버가 성공적으로 실행되었습니다.');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));



// 서버를 시작하고 지정된 포트에서 요청을 수신 대기합니다.
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

// 애플리케이션 종료 시 Prisma 연결을 안전하게 끊습니다.
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Prisma 연결이 해제되었습니다.');
});
