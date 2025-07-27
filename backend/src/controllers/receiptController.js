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

    // 1. AI 서비스 호출하여 영수증 분석
    const parsedData = await analyzeReceipt(base64Image, mimeType);

    // 2. 분석된 데이터로 트랜잭션 생성
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
        items: true, // 생성된 아이템 정보 포함
      },
    });

    console.log('데이터베이스에 거래 내역 저장 완료.');

    // --- 포인트 적립 로직 시작 ---

    // 3. healthyScore가 양수인 항목만 합산하여 포인트 계산
    const totalPoints = newTransaction.items.reduce((sum, item) => {
      if (item.healthyScore > 0) {
        return sum + item.healthyScore;
      }
      return sum;
    }, 0);

    let awardedPoints = 0;
    // 4. 획득한 포인트가 0보다 클 경우, 포인트 내역을 기록하고 사용자 포인트를 업데이트
    if (totalPoints > 0) {
      // 데이터 일관성을 위해 트랜잭션 사용
      await prisma.$transaction([
        // 4-1. 사용자 rewardPoints 업데이트
        prisma.user.update({
          where: { id: userId },
          data: {
            rewardPoints: {
              increment: totalPoints, // 기존 포인트에 합산
            },
          },
        }),
        // 4-2. RewardPointHistory 생성
        prisma.rewardPointHistory.create({
          data: {
            userId: userId,
            points: totalPoints,
            reason: '영수증 분석을 통한 포인트 적립',
            transactionId: newTransaction.id,
          },
        }),
      ]);
      awardedPoints = totalPoints;
      console.log(`사용자 [${userId}]에게 ${awardedPoints} 포인트가 적립되었습니다.`);
    }

    // --- 포인트 적립 로직 종료 ---

    // 5. 최종 성공 응답 전송
    res.status(201).json({
      message: '영수증 처리 및 저장 성공!',
      awardedPoints: awardedPoints, // 적립된 포인트 정보 추가
      transaction: newTransaction,
    });

  } catch (error) {
    console.error('영수증 처리 중 오류 발생:', error);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  } finally {
    // 임시 파일 삭제
    fs.unlink(filePath, (err) => {
      if (err) console.error('임시 파일 삭제 오류:', err);
    });
  }
};
