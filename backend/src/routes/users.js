// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 사용자 고유 ID
 *           example: "clxqe81o50000u1zkh9n8c7vj"
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: 사용자 이름
 *           example: "홍길동"
 *         rewardPoints:
 *           type: integer
 *           description: 사용자 리워드 포인트
 *           example: 100
 *         level:
 *           type: integer
 *           description: 사용자 레벨
 *           example: 2
 *         exp:
 *           type: integer
 *           description: 사용자 경험치
 *           example: 50
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 생성 일시
 *           example: "2025-07-26T08:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 수정 일시
 *           example: "2025-07-26T08:00:00.000Z"
 *     UserInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: 사용자 이메일
 *         password:
 *           type: string
 *           format: password
 *           description: 사용자 비밀번호 (최소 8자)
 *         name:
 *           type: string
 *           description: 사용자 이름
 *       example:
 *         email: "newuser@example.com"
 *         password: "password123"
 *         name: "김철수"
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: 사용자 관리 API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: 모든 사용자 목록을 조회합니다.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 목록을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: 특정 사용자의 정보를 조회합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 정보를 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 새로운 사용자를 생성합니다 (회원가입).
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: 성공적으로 사용자를 생성했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: 잘못된 요청 (이메일 또는 비밀번호 누락).
 *       409:
 *         description: 이미 사용 중인 이메일입니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: 특정 사용자의 정보를 수정합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 수정할 사용자의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *             example:
 *               name: "이순신"
 *     responses:
 *       200:
 *         description: 성공적으로 사용자 정보를 수정했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 수정할 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: 특정 사용자를 삭제합니다.
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 삭제할 사용자의 ID
 *     responses:
 *       204:
 *         description: 성공적으로 사용자를 삭제했습니다.
 *       404:
 *         description: 삭제할 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */



router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, rewardPoints: true, level: true, exp: true, createdAt: true, updatedAt: true }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('모든 사용자 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});


router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, rewardPoints: true, level: true, exp: true, createdAt: true, updatedAt: true }
    });
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    res.status(200).json(user);
  } catch (error) {
    console.error('특정 사용자 조회 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});



router.post('/', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: '이메일과 비밀번호는 필수입니다.' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2002') return res.status(409).json({ error: '이미 사용 중인 이메일입니다.' });
    console.error('사용자 생성 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    if (error.code === 'P2025') return res.status(404).json({ error: '수정할 사용자를 찾을 수 없습니다.' });
    console.error('사용자 정보 수정 중 오류 발생:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        if (error.code === 'P2025') return res.status(404).json({ error: '삭제할 사용자를 찾을 수 없습니다.' });
        console.error('사용자 삭제 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
