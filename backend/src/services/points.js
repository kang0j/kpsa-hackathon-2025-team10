// /services/points.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * 사용자에게 포인트를 추가하는 내부 서비스 함수
 * @param {string} userId - 포인트를 추가할 사용자의 ID
 * @param {number} pointsToAdd - 추가할 포인트의 양
 * @returns {Promise<object>} 성공 시 업데이트된 사용자 객체를 반환
 * @throws {Error} 유효성 검사 실패 또는 DB 작업 실패 시 에러 발생
 */
async function addPoints(userId, pointsToAdd) {
  // 1. 유효성 검사
  if (!userId || !pointsToAdd) {
    throw new Error('userId와 pointsToAdd는 필수 인자입니다.');
  }
  if (typeof pointsToAdd !== 'number' || pointsToAdd <= 0) {
    throw new Error('pointsToAdd는 0보다 큰 숫자여야 합니다.');
  }

  console.log(`[${userId}] 사용자에게 ${pointsToAdd} 포인트를 추가합니다...`);

  try {
    // 2. Prisma를 사용해 해당 유저의 rewardPoints를 업데이트
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        rewardPoints: {
          increment: pointsToAdd,
        },
      },
    });

    console.log(`[${userId}] 포인트 추가 완료. 현재 포인트: ${updatedUser.rewardPoints}`);
    // 3. 성공 시 업데이트된 사용자 정보 반환
    return updatedUser;

  } catch (error) {
    console.error(`[${userId}] 포인트 추가 중 DB 오류 발생:`, error);

    // 4. 에러를 그대로 호출한 측에 전달하여 처리하도록 함
    throw new Error('사용자 포인트를 업데이트하는 중 오류가 발생했습니다.');
  }
}



const id = 'cmdkegz8m0001he9oo6ggnapj'

addPoints(id, 500)

module.exports = { addPoints };