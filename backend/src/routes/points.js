const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        rewardPoints: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }

    res.status(200).json({
      userId: userId,
      totalPoints: user.rewardPoints,
    });
  } catch (error) {
    console.error('포인트 조회 오류:', error);
    res.status(500).json({ error: '포인트 조회 중 오류가 발생했습니다.' });
  }
});

module.exports = router;
