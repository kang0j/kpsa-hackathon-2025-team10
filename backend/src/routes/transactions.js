// backend/src/routes/transactions.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     TransactionItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 거래 항목 고유 ID
 *         itemName:
 *           type: string
 *           description: 상품명
 *         price:
 *           type: integer
 *           description: 가격
 *         quantity:
 *           type: integer
 *           description: 수량
 *         healthyScore:
 *           type: integer
 *           description: -5~5까지의 값이 AI가 평가
 *         commentByAI:
 *           type: string
 *           description: ai가 내린 코멘트
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 거래 내역 고유 ID
 *         userId:
 *           type: string
 *           description: 사용자 ID
 *         storeName:
 *           type: string
 *           description: 상점 이름
 *         totalAmount:
 *           type: integer
 *           description: 총 거래 금액
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           description: 거래 일시
 *         status:
 *           type: string
 *           enum: [PENDING, UNMATCHED, MATCHED, ERROR]
 *           description: 거래 상태
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TransactionItem'
 *     TransactionInput:
 *       type: object
 *       required:
 *         - userId
 *         - storeName
 *         - totalAmount
 *         - transactionDate
 *         - items
 *       properties:
 *         userId:
 *           type: string
 *           description: 거래를 생성한 사용자 ID
 *         storeName:
 *           type: string
 *           description: 상점 이름
 *         totalAmount:
 *           type: integer
 *           description: 영수증의 총 금액
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           description: 거래가 발생한 날짜 및 시간
 *         items:
 *           type: array
 *           description: 거래에 포함된 상품 목록
 *           items:
 *             type: object
 *             required:
 *               - itemName
 *               - price
 *               - quantity
 *             properties:
 *               itemName:
 *                 type: string
 *               price:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *       example:
 *         userId: "clxqe81o50000u1zkh9n8c7vj"
 *         storeName: "행복 약국"
 *         totalAmount: 15000
 *         transactionDate: "2025-07-26T10:00:00.000Z"
 *         items:
 *           - itemName: "비타민C"
 *             price: 10000
 *             quantity: 1
 *           - itemName: "밴드"
 *             price: 5000
 *             quantity: 1
 */

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: 소비 및 거래 내역 관리 API
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: 특정 사용자의 모든 거래 내역을 조회합니다.
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 거래 내역 목록을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: userId가 누락되었습니다.
 *       500:
 *         description: 서버 오류
 */



router.get('/', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId 쿼리 파라미터가 필요합니다.' });
    }

    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: userId },
            include: {
                items: true, // 각 거래에 포함된 상품 목록도 함께 조회
            },
        });
        res.status(200).json(transactions);
    } catch (error) {
        console.error('거래 내역 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: 특정 거래 내역의 상세 정보를 조회합니다.
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 거래 내역의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 거래 내역을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: 거래 내역을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: id },
            include: {
                items: true,
            },
        });

        if (!transaction) {
            return res.status(404).json({ error: '거래 내역을 찾을 수 없습니다.' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        console.error('특정 거래 내역 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: 새로운 거래 내역을 생성합니다 (영수증 업로드 후 처리).
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransactionInput'
 *     responses:
 *       201:
 *         description: 성공적으로 거래 내역을 생성했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: 잘못된 요청 (필수 데이터 누락).
 *       500:
 *         description: 서버 오류
 */

router.post('/', async (req, res) => {
    const { userId, storeName, totalAmount, transactionDate, items } = req.body;

    if (!userId || !storeName || !totalAmount || !transactionDate || !items) {
        return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }

    try {
        // 데이터베이스 작업을 트랜잭션으로 묶어서 처리합니다.
        // 거래 내역 생성과 거래 항목 생성이 모두 성공하거나 모두 실패하도록 보장합니다.
        const newTransaction = await prisma.$transaction(async (prisma) => {
            const createdTransaction = await prisma.transaction.create({
                data: {
                    userId,
                    storeName,
                    totalAmount,
                    transactionDate: new Date(transactionDate),
                },
            });

            // items 배열에 있는 각 상품을 TransactionItem으로 생성합니다.
            const transactionItemsData = items.map(item => ({
                ...item,
                transactionId: createdTransaction.id,
            }));

            await prisma.transactionItem.createMany({
                data: transactionItemsData,
            });

            // 생성된 거래 내역과 항목들을 함께 반환합니다.
            return prisma.transaction.findUnique({
                where: { id: createdTransaction.id },
                include: { items: true },
            });
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('거래 내역 생성 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
