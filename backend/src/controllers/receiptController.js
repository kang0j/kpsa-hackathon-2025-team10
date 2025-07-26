/*
 * src/controllers/receiptController.js
 * HTTP 요청/응답을 처리하고, 서비스 계층을 호출하여 비즈니스 로직을 위임합니다.
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { analyzeReceipt } from '../services/receiptAnalysisService.js'; // 서비스 모듈 import

const prisma = new PrismaClient();

// 이미지를 Base64로 인코딩하는 헬퍼 함수
function imageToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString('base64');
}

export const processReceipt = async (req, res) => {
  // 라우트 파라미터에서 사용자 ID를 가져옵니다.
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ error: 'URL에 사용자 ID가 필요합니다.' });
  }
  
  if (!req.file) {
    return res.status(400).json({ error: '영수증 이미지를 업로드해주세요.' });
  }

  const filePath = req.file.path;

  try {
    const base64Image = imageToBase64(filePath);
    const mimeType = req.file.mimetype;

    const parsedData = await analyzeReceipt(base64Image, mimeType);

    const newTransaction = await prisma.transaction.create({
      data: {
        userId: userId,
        storeName: parsedData.storeName,
        totalAmount: parsedData.totalAmount,
        transactionDate: new Date(parsedData.transactionDate),
        items: {
          create: parsedData.items.map(item => ({
            itemName: item.itemName,
            price: item.price,
            quantity: item.quantity,
            categoryId: item.categoryId,
            healthyScore: item.healthyScore,
            commentByAI: item.commentByAI,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log('데이터베이스에 거래 내역 저장 완료.');
    
    // 3. 성공 응답 전송
    res.status(201).json({
      message: '영수증 처리 및 저장 성공!',
      transaction: newTransaction,
    });

  } catch (error) {
    console.error('영수증 처리 중 오류 발생:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error('임시 파일 삭제 오류:', err);
    });
  }
};
