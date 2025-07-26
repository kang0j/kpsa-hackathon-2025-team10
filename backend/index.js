const express = require('express');
const app = express();
const port = 3000;

// routes 폴더에 있는 users.js 파일을 불러옴
const usersRouter = require('./routes/users');

// '/api/users' 경로로 들어오는 모든 요청은 usersRouter에서 처리하도록 미들웨어 설정
app.use('/api/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
