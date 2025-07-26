const recomendsService = require('../services/recomends.service');

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getRecommendation(req, res) {
    try {
        // 라우트 파라미터에서 type과 id(userId)를 가져옵니다.
        const { type, id: userId } = req.params;

        // type 파라미터가 유효한지 확인합니다.
        const validTypes = ['food', 'supplement'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "요청 타입은 'food' 또는 'supplement'여야 합니다.",
            });
        }

        if (!userId) {
            return res.status(400).json({ message: '사용자 ID가 필요합니다.' });
        }

        // 서비스 레이어로 userId와 type을 함께 전달합니다.
        const recommendation = await recomendsService.getAiRecommendation(userId, type);

        res.status(200).json({
            success: true,
            message: `AI ${type} 상담 내용을 성공적으로 조회했습니다.`,
            data: {
                recommendation: recommendation,
            },
        });
    } catch (error) {
        console.error('Recommendation Controller Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || '서버 내부 오류가 발생했습니다.',
        });
    }
}

module.exports = {
    getRecommendation,
};