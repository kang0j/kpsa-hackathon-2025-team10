import { Router } from 'express';
import multer from 'multer';
import { processReceipt } from '../controllers/receiptController.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

/**
 * @swagger
 * tags:
 *   - name: Receipts
 *     description: 영수증 관련 API
 */

/**
 * @swagger
 * /api/receipts/upload/{id}:
 *   post:
 *     tags:
 *       - Receipts
 *     summary: 특정 사용자의 영수증 이미지 업로드 및 처리
 *     description: URL 경로로 받은 사용자 ID에 대해 영수증 이미지를 분석하고 거래 내역을 생성합니다.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: 거래 내역을 생성할 사용자의 고유 ID.
 *         schema:
 *           type: string
 *           example: "clx000user123"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *                 description: 분석할 영수증 이미지 파일.
 *     responses:
 *       '201':
 *         description: 영수증 처리 및 저장 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 영수증 처리 및 저장 성공!
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "clx123abc456"
 *                     userId:
 *                       type: string
 *                       example: "clx000user123"
 *                     storeName:
 *                       type: string
 *                       example: "행복마트"
 *                     totalAmount:
 *                       type: integer
 *                       example: 15800
 *                     transactionDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-07-26T14:30:00Z"
 *                     status:
 *                       type: string
 *                       example: "PENDING"
 *                     verifiedById:
 *                       type: string
 *                       nullable: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "cly789def012"
 *                           transactionId:
 *                             type: string
 *                             example: "clx123abc456"
 *                           itemName:
 *                             type: string
 *                             example: "신선한 우유 1L"
 *                           price:
 *                             type: integer
 *                             example: 2500
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                           categoryId:
 *                             type: string
 *                             nullable: true
 *                           healthyScore:
 *                             type: integer
 *                             example: 85
 *                           commentByAI:
 *                             type: string
 *                             example: "칼슘이 풍부한 건강한 유제품입니다."
 *       '400':
 *         description: 잘못된 요청 (예: 파일 또는 사용자 ID가 누락됨)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "영수증 이미지를 업로드해주세요."
 *       '500':
 *         description: 서버 내부 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 서버 내부 오류가 발생했습니다.
 */


// URL 경로에 사용자 ID를 받는 파라미터 ':id'를 추가합니다.
router.post('/upload/:id', upload.single('receiptImage'), processReceipt);

export default router;

