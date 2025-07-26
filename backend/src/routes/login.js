// backend/src/routes/login.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/**
 * @swagger
 * /login:
 *   post:
 *     summary: 사용자 로그인
 *     description: 이메일과 비밀번호를 입력받아 로그인합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *                 description: 사용자 이메일
 *               password:
 *                 type: string
 *                 example: "securepassword"
 *                 description: 사용자 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 로그인에 성공했습니다.
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: 이메일 또는 비밀번호 누락
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일과 비밀번호를 모두 입력해주세요.
 *       401:
 *         description: 인증 실패 (잘못된 이메일 또는 비밀번호)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 이메일 또는 비밀번호가 유효하지 않습니다.
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 서버 내부 오류가 발생했습니다.
 */




router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 모두 입력해주세요.' });
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 유효하지 않습니다.' });
    }
    
    // 3. 비밀번호 비교
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(401).json({ message: '이메일 또는 비밀번호가 유효하지 않습니다.' });
    }

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: '로그인에 성공했습니다.',
      user: userWithoutPassword,
    });

  } catch (error) {
    // 5. 예외 처리
    console.error('로그인 처리 중 서버 오류 발생:', error);
    return res.status(500).json({ message: '서버 내부 오류가 발생했습니다.' });
  }
});

module.exports = router;

