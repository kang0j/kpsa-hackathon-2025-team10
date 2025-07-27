
const express = require('express');
const router = express.Router();
const recomendsController = require('../controllers/recomends.controller');

/**
 * @route   GET /recomends/:id
 * @desc    사용자 ID를 기반으로 AI 건강 상담 내용 조회
 * @access  Public (또는 인증 미들웨어 추가 가능)
 */
router.get('/:type/:id', recomendsController.getRecommendation);

module.exports = router;