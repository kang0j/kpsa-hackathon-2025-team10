import { useState, useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import BottomTab from "./BottomTab";
import CareScreenPremium from "./CareScreenPremium";
import { supplementService, transactionService } from "../../api/services";
import type { SupplementRecommendation, Transaction } from "../../api/services";

export default function CareScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [showPremium, setShowPremium] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [supplementData, setSupplementData] = useState<SupplementRecommendation | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [healthAnalysis, setHealthAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 건강 점수 분석 함수들
  const analyzeHealthScores = (transactions: Transaction[]) => {
    let totalGoodScore = 0;
    let totalBadScore = 0;
    let totalAmount = 0;
    let goodAmount = 0;
    let badAmount = 0;
    
    transactions.forEach(transaction => {
      transaction.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalAmount += itemTotal;
        
        if (item.healthyScore > 0) {
          totalGoodScore += item.healthyScore * item.quantity;
          goodAmount += itemTotal;
        } else if (item.healthyScore < 0) {
          totalBadScore += Math.abs(item.healthyScore) * item.quantity;
          badAmount += itemTotal;
        }
        // 0점은 무시
      });
    });
    
    return {
      totalGoodScore,
      totalBadScore,
      totalAmount,
      goodAmount,
      badAmount,
      neutralAmount: totalAmount - goodAmount - badAmount
    };
  };
  
  // 퍼센트 계산
  const calculatePercentages = (analysis: any) => {
    const total = analysis.totalGoodScore + analysis.totalBadScore;
    if (total === 0) return { goodPercent: 50, badPercent: 50 };
    
    return {
      goodPercent: Math.round((analysis.totalGoodScore / total) * 100),
      badPercent: Math.round((analysis.totalBadScore / total) * 100)
    };
  };

  // 컴포넌트 마운트 시 localStorage에서 프리미엄 상태 확인
  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremiumUser');
    if (premiumStatus === 'true') {
      setIsPremiumUser(true);
    }
    
    // 영양제 추천 데이터와 거래 데이터 가져오기
    fetchData();
  }, []);

  // 모든 데이터 가져오기
  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 병렬로 데이터 가져오기
      const [supplementResult, transactionResult] = await Promise.all([
        supplementService.getSupplementRecommendation(userId),
        transactionService.getUserTransactions(userId)
      ]);
      
      setSupplementData(supplementResult);
      setTransactions(transactionResult);
      
      // 건강 점수 분석
      const analysis = analyzeHealthScores(transactionResult);
      setHealthAnalysis(analysis);
      
    } catch (err: any) {
      console.error('데이터 조회 실패:', err);
      setError('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프리미엄 구독 처리
  const handlePremiumUpgrade = () => {
    setIsPremiumUser(true);
    localStorage.setItem('isPremiumUser', 'true');
    localStorage.setItem('premiumStartDate', new Date().toISOString());
  };

  // 프리미엄 사용자라면 프리미엄 화면을 보여줌
  if (isPremiumUser) {
    return <CareScreenPremium onTabChange={onTabChange} />;
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* 메인 컨텐츠 */}
      <div className="flex-1 px-6">
        {/* 제목 */}
        <div className="flex items-center justify-between pt-8 mb-8">
          <h1 className="text-2xl font-bold text-center flex-1">
            7월 소비 패턴 분석
          </h1>
          <button 
            onClick={fetchData}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 동적 도넛 차트 영역 */}
        <div className="flex justify-center mb-12 overflow-y-auto no-scrollbar">
          <div className="relative w-64 h-64">
            {healthAnalysis ? (
              // 실제 데이터 기반 차트
              <>
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 200 200"
                >
                  {(() => {
                    const { goodPercent, badPercent } = calculatePercentages(healthAnalysis);
                    const radius = 80;
                    const circumference = 2 * Math.PI * radius;
                    
                    // 좋은 음식 (초록색)
                    const goodLength = (goodPercent / 100) * circumference;
                    const goodOffset = 0;
                    
                    // 나쁜 음식 (빨간색)
                    const badLength = (badPercent / 100) * circumference;
                    const badOffset = -goodLength;
                    
                    return (
                      <>
                        {/* 좋은 음식 섹션 */}
                        <circle
                          cx="100"
                          cy="100"
                          r={radius}
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="25"
                          strokeDasharray={`${goodLength} ${circumference}`}
                          strokeDashoffset={goodOffset}
                        />
                        {/* 나쁜 음식 섹션 */}
                        <circle
                          cx="100"
                          cy="100"
                          r={radius}
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="25"
                          strokeDasharray={`${badLength} ${circumference}`}
                          strokeDashoffset={badOffset}
                        />
                      </>
                    );
                  })()}
                </svg>

                {/* 중앙 텍스트 - 실제 총 금액 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-gray-700">
                    {Math.round(healthAnalysis.totalAmount / 10000)}
                  </div>
                  <div className="text-sm tracking-wide text-gray-500 uppercase">
                    만 원
                  </div>
                </div>

                {/* 범례 라벨들 - 실제 데이터 */}
                <div className="absolute px-2 py-1 text-xs text-gray-600 bg-white rounded shadow top-8 right-4">
                  건강한 음식 ({calculatePercentages(healthAnalysis).goodPercent}%)
                </div>
                <div className="absolute px-2 py-1 text-xs text-gray-600 bg-white rounded shadow left-4 top-1/3">
                  건강하지 않은 음식 ({calculatePercentages(healthAnalysis).badPercent}%)
                </div>
                
                {/* 상세 정보 */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-white rounded-lg shadow px-3 py-1">
                    <div className="text-xs text-gray-600">
                      <span className="text-green-600 font-semibold">좋은 음식: {Math.round(healthAnalysis.goodAmount / 1000)}k원</span>
                      <br />
                      <span className="text-red-600 font-semibold">나쁜 음식: {Math.round(healthAnalysis.badAmount / 1000)}k원</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // 로딩 중이거나 데이터가 없을 때
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">분석 중...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI 분석 결과 - 실제 데이터 기반 */}
        <div className="mb-8">
          {healthAnalysis && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-red-50 rounded-xl border mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">📊 소비 패턴 분석</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center p-3 bg-green-100 rounded-lg">
                  <div className="text-green-700 font-bold text-lg">
                    {healthAnalysis.totalGoodScore.toLocaleString()}점
                  </div>
                  <div className="text-green-600">건강한 선택</div>
                  <div className="text-xs text-green-500 mt-1">
                    {Math.round(healthAnalysis.goodAmount / 1000)}k원
                  </div>
                </div>
                <div className="text-center p-3 bg-red-100 rounded-lg">
                  <div className="text-red-700 font-bold text-lg">
                    {healthAnalysis.totalBadScore.toLocaleString()}점
                  </div>
                  <div className="text-red-600">건강하지 않은 선택</div>
                  <div className="text-xs text-red-500 mt-1">
                    {Math.round(healthAnalysis.badAmount / 1000)}k원
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  {healthAnalysis.totalGoodScore > healthAnalysis.totalBadScore 
                    ? "👍 건강한 소비 패턴을 보이고 있어요!" 
                    : "💪 더 건강한 선택을 늘려보세요!"}
                </p>
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-bold leading-tight text-black">
            {supplementData?.oneCommand || "분석 중입니다..."}
          </h2>
        </div>

        {/* 실제 영양제 추천 영역 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-800">🏥 AI 맞춤 영양제 추천</h3>
          
          {loading && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600">AI가 영양제를 추천하는 중...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {supplementData && !loading && !error && (
            <div className="space-y-4">
              {/* 영양제 추천 목록 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {supplementData["맞춤 영양제 추천"].map((supplement, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">
                        {supplement === "오메가3" ? "🐟" : 
                         supplement === "비타민D" ? "☀️" : 
                         supplement === "마그네슘" ? "🧪" : "💊"}
                      </span>
                    </div>
                    <h4 className="font-semibold text-lg text-gray-800 mb-2">
                      {supplement}
                    </h4>
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                        AI 추천
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        맞춤형
                      </span>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                      상품 보기
                    </button>
                  </div>
                ))}
              </div>

              {/* AI 상세 추천 사항 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                    🤖
                  </span>
                  AI 전문가 조언
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {supplementData["ai 추천 사항"]}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 기존 광고 영역 (보조 광고) */}
        <div className="mb-8 space-y-4">
          <div className="p-6 text-center bg-black rounded-xl">
            <div className="text-lg font-medium text-white">&lt;AD&gt;</div>
          </div>
        </div>

        {/* 약사 상담 섹션 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold leading-tight text-black">
            집 근처 약사님과
            <br />
            바로 상담할 수 있어요
          </h2>
        </div>

        {/* 약사 상담 카드 */}
        <div className="flex items-center justify-between p-4 mb-6 bg-emerald-50 rounded-2xl">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-black">
              약사 건강 컨설팅
            </h3>
            <p className="mb-1 text-base text-black">&lt;약사 소개 한 줄&gt;</p>
            <p className="text-base text-black">근처 500m</p>
          </div>
          <img
            className="rounded-full w-14 h-14"
            src="https://placehold.co/60x60"
            alt="약사 프로필"
          />
        </div>

        {/* 더보기 버튼 */}
        {!showPremium && (
          <div className="mb-6 text-center">
            <button
              onClick={() => setShowPremium(true)}
              className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-full hover:bg-blue-700"
            >
              프리미엄 기능 더보기 🔓
            </button>
          </div>
        )}

        {/* 프리미엄 화면 */}
        {showPremium && (
          <div className="p-6 mb-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl">
            {/* 프리미엄 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <span className="mr-2 text-2xl">👑</span>
                <h3 className="text-xl font-bold text-purple-700">
                  프리미엄 플랜
                </h3>
              </div>
              <button
                onClick={() => setShowPremium(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 건강한 음식 추천 섹션 */}
            <div className="mb-6">
              <h4 className="mb-3 text-lg font-bold text-black">
                🥗 맞춤 건강 음식 추천
              </h4>
              <div className="p-4 mb-3 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-black">
                      연어 아보카도 샐러드
                    </h5>
                    <p className="text-sm text-gray-600">
                      비타민D, 오메가3 풍부
                    </p>
                    <p className="text-xs text-green-600">근처 샐러드바 3곳</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      영양점수 95
                    </div>
                    <div className="text-xs text-gray-500">₩12,000</div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-black">버섯 현미밥</h5>
                    <p className="text-sm text-gray-600">비타민D, 식이섬유</p>
                    <p className="text-xs text-green-600">근처 건강식당 2곳</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-blue-600">
                      영양점수 88
                    </div>
                    <div className="text-xs text-gray-500">₩8,500</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 약사 전화 상담 섹션 */}
            <div className="mb-6">
              <h4 className="mb-3 text-lg font-bold text-black">
                📞 약사 전화 상담
              </h4>
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img
                      className="w-12 h-12 mr-3 rounded-full"
                      src="https://placehold.co/50x50"
                      alt="약사"
                    />
                    <div>
                      <h5 className="font-semibold text-black">
                        김약사 (10년 경력)
                      </h5>
                      <p className="text-sm text-gray-600">⭐ 4.9 (127 리뷰)</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg">
                    상담 예약
                  </button>
                </div>
                <div className="text-sm text-gray-600">
                  💬 "비타민D 부족 상담 가능한 시간: 오늘 오후 2-6시"
                </div>
              </div>
            </div>

            {/* 할인 쿠폰 섹션 */}
            <div className="mb-6">
              <h4 className="mb-3 text-lg font-bold text-black">
                🎫 전용 할인 혜택
              </h4>
              <div className="space-y-2">
                <div className="p-3 border-l-4 border-red-400 rounded-lg bg-gradient-to-r from-red-100 to-pink-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-red-700">
                        건강기능식품 20% 할인
                      </span>
                      <p className="text-xs text-red-600">비타민D 제품 전용</p>
                    </div>
                    <button className="px-3 py-1 text-xs text-white bg-red-500 rounded">
                      사용
                    </button>
                  </div>
                </div>
                <div className="p-3 border-l-4 border-blue-400 rounded-lg bg-gradient-to-r from-blue-100 to-cyan-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-semibold text-blue-700">
                        건강식 배달 15% 할인
                      </span>
                      <p className="text-xs text-blue-600">추천 음식점 전용</p>
                    </div>
                    <button className="px-3 py-1 text-xs text-white bg-blue-500 rounded">
                      사용
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 프리미엄 구독 CTA */}
            <div className="text-center">
              <button
                onClick={handlePremiumUpgrade}
                className="px-8 py-3 text-lg font-bold text-white transition-shadow rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-xl"
              >
                월 9,900원으로 시작하기
              </button>
              <p className="mt-2 text-xs text-gray-500">첫 7일 무료 체험</p>
            </div>
          </div>
        )}
      </div>

      {/* 하단 탭 */}
      <BottomTab selected="care" onTabChange={onTabChange} />
    </div>
  );
}