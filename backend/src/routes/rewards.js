// backend/src/routes/rewards.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


/**
 * @swagger
 * components:
 *   schemas:
 *     Goods:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 굿즈 고유 ID
 *         title:
 *           type: string
 *           description: 굿즈 이름
 *         description:
 *           type: string
 *           description: 굿즈 설명
 *         pointsRequired:
 *           type: integer
 *           description: 필요한 포인트
 *         type:
 *           type: string
 *           enum: [COUPON, PRODUCT, SERVICE]
 *           description: 굿즈 타입
 *         isActive:
 *           type: boolean
 *           description: 활성화 여부
 * 
 *     RewardPointHistory:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         points:
 *           type: integer
 *           description: 변경된 포인트 (사용 시 음수)
 *         reason:
 *           type: string
 *           description: 포인트 변경 사유
 *         transactionId:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   - name: Rewards
 *     description: 리워드(굿즈, 포인트) 관리 API
 */

/**
 * @swagger
 * /rewards/goods:
 *   get:
 *     summary: 교환 가능한 모든 굿즈 목록을 조회합니다.
 *     tags: [Rewards]
 *     responses:
 *       200:
 *         description: 성공적으로 굿즈 목록을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Goods'
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /rewards/goods/exchange:
 *   post:
 *     summary: 사용자의 포인트로 굿즈를 교환합니다.
 *     tags: [Rewards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - goodId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: 굿즈를 교환할 사용자의 ID
 *               goodId:
 *                 type: string
 *                 description: 교환할 굿즈의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 굿즈를 교환했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "굿즈 교환이 완료되었습니다."
 *                 userGood:
 *                   $ref: '#/components/schemas/UserGood'
 *       400:
 *         description: 잘못된 요청 (사용자/굿즈를 찾을 수 없거나 포인트 부족)
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /rewards/history/{userId}:
 *   get:
 *     summary: 특정 사용자의 모든 포인트 적립/사용 내역을 조회합니다.
 *     tags: [Rewards]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 사용자의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 포인트 내역을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RewardPointHistory'
 *       404:
 *         description: 사용자를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */


router.get('/goods', async (req, res) => {
    try {
        const goods = await prisma.goods.findMany({
            where: {
                isActive: true, // 활성화된 굿즈만 조회
            },
        });
        res.status(200).json(goods);
    } catch (error) {
        console.error('굿즈 목록 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});


router.post('/goods/exchange', async (req, res) => {
    const { userId, goodId } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. 사용자 정보와 굿즈 정보를 동시에 조회합니다.
            const user = await tx.user.findUnique({ where: { id: userId } });
            const good = await tx.goods.findUnique({ where: { id: goodId } });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }
            if (!good) {
                throw new Error('굿즈를 찾을 수 없습니다.');
            }
            if (!good.isActive) {
                throw new Error('현재 교환할 수 없는 굿즈입니다.');
            }

            // 2. 사용자의 포인트가 충분한지 확인합니다.
            if (user.rewardPoints < good.pointsRequired) {
                throw new Error('포인트가 부족합니다.');
            }

            // 3. 사용자의 포인트를 차감합니다.
            const updatedUser = await tx.user.update({
                where: { id: userId },
                data: {
                    rewardPoints: {
                        decrement: good.pointsRequired,
                    },
                },
            });

            // 4. 사용자가 획득한 굿즈 내역(UserGood)을 생성합니다.
            const userGood = await tx.userGood.create({
                data: {
                    userId: userId,
                    goodId: goodId,
                    // 쿠폰인 경우, 간단한 유니크 코드 생성 (실제 서비스에서는 더 복잡한 로직 필요)
                    couponCode: good.type === 'COUPON' ? `C-${Date.now()}-${userId.slice(0, 4)}` : null,
                },
            });

            // 5. 포인트 사용 내역(RewardPointHistory)을 기록합니다.
            await tx.rewardPointHistory.create({
                data: {
                    userId: userId,
                    points: -good.pointsRequired, // 사용했으므로 음수
                    reason: `'${good.title}' 굿즈 교환`,
                },
            });

            return { userGood };
        });

        res.status(200).json({
            message: '굿즈 교환이 완료되었습니다.',
            userGood: result.userGood,
        });

    } catch (error) {
        // 트랜잭션 내에서 발생한 에러를 클라이언트에 전달
        if (error.message.includes('찾을 수 없습니다') || error.message.includes('포인트가 부족합니다')) {
            return res.status(400).json({ error: error.message });
        }
        console.error('굿즈 교환 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const userExists = await prisma.user.findUnique({ where: { id: userId } });
        if (!userExists) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        const history = await prisma.rewardPointHistory.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc', // 최신 내역부터 정렬
            },
        });
        res.status(200).json(history);
    } catch (error) {
        console.error('포인트 내역 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
