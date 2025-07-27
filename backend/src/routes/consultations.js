/**
 * @swagger
 * components:
 *   schemas:
 *     ConsultationMessage:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         consultationId:
 *           type: string
 *         content:
 *           type: string
 *         senderType:
 *           type: string
 *           enum: [USER, PHARMACIST]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Consultation:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         pharmacistId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [REQUESTED, ACCEPTED, COMPLETED, CANCELLED]
 *         topic:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         messages:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ConsultationMessage'
 *     ConsultationInput:
 *       type: object
 *       required:
 *         - userId
 *         - pharmacistId
 *         - topic
 *       properties:
 *         userId:
 *           type: string
 *           description: 상담을 요청하는 사용자 ID
 *         pharmacistId:
 *           type: string
 *           description: 상담을 요청받는 약사 ID
 *         topic:
 *           type: string
 *           description: 상담 주제
 *     MessageInput:
 *       type: object
 *       required:
 *         - content
 *         - senderType
 *       properties:
 *         content:
 *           type: string
 *           description: 메시지 내용
 *         senderType:
 *           type: string
 *           enum: [USER, PHARMACIST]
 *           description: 메시지 발신자 타입
 */

/**
 * @swagger
 * tags:
 *   - name: Consultations
 *     description: 약사 상담 관리 API
 */

/**
 * @swagger
 * /consultations:
 *   post:
 *     summary: 새로운 약사 상담을 신청합니다.
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConsultationInput'
 *     responses:
 *       201:
 *         description: 성공적으로 상담이 신청되었습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       400:
 *         description: 잘못된 요청 (필수 데이터 누락)
 *       404:
 *         description: 사용자 또는 약사를 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /consultations/{id}:
 *   get:
 *     summary: 특정 상담 내역과 메시지를 함께 조회합니다.
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 조회할 상담의 ID
 *     responses:
 *       200:
 *         description: 성공적으로 상담 내역을 조회했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       404:
 *         description: 상담 내역을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

/**
 * @swagger
 * /consultations/{id}/messages:
 *   post:
 *     summary: 특정 상담에 새로운 메시지를 전송합니다.
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: 메시지를 추가할 상담의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MessageInput'
 *     responses:
 *       201:
 *         description: 성공적으로 메시지를 전송했습니다.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultationMessage'
 *       400:
 *         description: 잘못된 요청 (필수 데이터 누락)
 *       404:
 *         description: 상담 내역을 찾을 수 없습니다.
 *       500:
 *         description: 서버 오류
 */

// backend/src/routes/consultations.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/', async (req, res) => {
    const { userId, pharmacistId, topic } = req.body;

    if (!userId || !pharmacistId || !topic) {
        return res.status(400).json({ error: 'userId, pharmacistId, topic은 필수입니다.' });
    }

    try {
        // 사용자 및 약사 존재 여부 확인
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const pharmacist = await prisma.pharmacist.findUnique({ where: { id: pharmacistId } });

        if (!user || !pharmacist) {
            return res.status(404).json({ error: '사용자 또는 약사를 찾을 수 없습니다.' });
        }

        const newConsultation = await prisma.consultation.create({
            data: {
                userId,
                pharmacistId,
                topic,
            },
        });
        res.status(201).json(newConsultation);
    } catch (error) {
        console.error('상담 신청 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const consultation = await prisma.consultation.findUnique({
            where: { id: id },
            include: {
                messages: {
                    orderBy: {
                        createdAt: 'asc', // 메시지를 시간순으로 정렬
                    },
                },
            },
        });

        if (!consultation) {
            return res.status(404).json({ error: '상담 내역을 찾을 수 없습니다.' });
        }
        res.status(200).json(consultation);
    } catch (error) {
        console.error('상담 내역 조회 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});


router.post('/:id/messages', async (req, res) => {
    const { id } = req.params;
    const { content, senderType } = req.body;

    if (!content || !senderType) {
        return res.status(400).json({ error: 'content와 senderType은 필수입니다.' });
    }

    try {
        // 메시지를 추가하기 전, 해당 상담이 존재하는지 확인
        const consultationExists = await prisma.consultation.findUnique({ where: { id: id } });
        if (!consultationExists) {
            return res.status(404).json({ error: '메시지를 추가할 상담을 찾을 수 없습니다.' });
        }

        const newMessage = await prisma.consultationMessage.create({
            data: {
                consultationId: id,
                content,
                senderType,
            },
        });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('상담 메시지 전송 중 오류 발생:', error);
        res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router;
