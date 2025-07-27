import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import BottomTab from "./BottomTab";
import { transactionService } from "../../api/services";
import type { Transaction } from "../../api/services";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: "free" | "premium";
  joinDate: string;
  totalPoints: number;
  totalExpenses: number;
  healthyExpenses: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export default function MyPageScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "achievements" | "settings"
  >("profile");
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumStartDate, setPremiumStartDate] = useState<string | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);
  
  // 포인트 및 건강 분석 상태
  const [userPoints, setUserPoints] = useState<number>(0);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [healthAnalysis, setHealthAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 프리미엄 상태 확인
  useEffect(() => {
    const premiumStatus = localStorage.getItem("isPremiumUser");
    const startDate = localStorage.getItem("premiumStartDate");

    if (premiumStatus === "true") {
      setIsPremiumUser(true);
      setPremiumStartDate(startDate);
    }

    // 데이터 로드
    fetchUserData();
  }, []);

  // 건강 점수 분석 함수들 (CareScreen과 동일)
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

  // 포인트 API 호출 함수
  const fetchUserPoints = async () => {
    const userId = localStorage.getItem('userId') || 'cmdkegz8m0001he9oo6ggnapj';
    
    try {
      const response = await fetch(`https://df779d93eb1b.ngrok-free.app/points/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserPoints(data.totalPoints);
    } catch (error) {
      console.error('포인트 조회 실패:', error);
      setUserPoints(0);
    }
  };

  // 거래 데이터 및 분석 가져오기
  const fetchTransactionData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const transactionResult = await transactionService.getUserTransactions(userId);
      // setTransactions(transactionResult);
      
      // 건강 점수 분석
      const analysis = analyzeHealthScores(transactionResult);
      setHealthAnalysis(analysis);
    } catch (error) {
      console.error('거래 데이터 조회 실패:', error);
    }
  };

  // 모든 사용자 데이터 가져오기
  const fetchUserData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserPoints(),
        fetchTransactionData()
      ]);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 프리미엄 플랜 해지 처리
  const handleCancelPremium = () => {
    setIsPremiumUser(false);
    setPremiumStartDate(null);
    localStorage.removeItem("isPremiumUser");
    localStorage.removeItem("premiumStartDate");
    setShowPlanModal(false);
  };

  // 다음 결제일 계산 (시작일로부터 1달 후)
  const getNextPaymentDate = () => {
    if (!premiumStartDate) return "";
    const startDate = new Date(premiumStartDate);
    const nextPayment = new Date(startDate);
    nextPayment.setMonth(nextPayment.getMonth() + 1);
    return nextPayment.toLocaleDateString("ko-KR");
  };

  // 건강 소비율 계산
  const getHealthySpendingRatio = () => {
    if (!healthAnalysis || healthAnalysis.totalAmount === 0) return 0;
    return Math.round((healthAnalysis.goodAmount / healthAnalysis.totalAmount) * 100);
  };

  // 사용자 프로필 데이터
  const userProfile: UserProfile = {
    name: localStorage.getItem("userName") || "사용자",
    email: localStorage.getItem("userEmail") || "example@email.com",
    avatar: "",
    plan: isPremiumUser ? "premium" : "free",
    joinDate: "",
    totalPoints: userPoints,
    totalExpenses: healthAnalysis?.totalAmount || 0,
    healthyExpenses: healthAnalysis?.goodAmount || 0,
  };

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "건강 지킴이",
      description: "7일 연속 건강한 식단 유지",
      icon: "🥗",
      unlocked: true,
      unlockedDate: "2025-07-20",
    },
    {
      id: "2",
      title: "영양 박사",
      description: "모든 필수 영양소 섭취 달성",
      icon: "🎓",
      unlocked: true,
      unlockedDate: "2025-07-18",
    },
    {
      id: "3",
      title: "절약 왕",
      description: "건강한 소비로 월 예산 10% 절약",
      icon: "💰",
      unlocked: false,
    },
    {
      id: "4",
      title: "상담 마스터",
      description: "약사 상담 10회 완료",
      icon: "👩‍⚕️",
      unlocked: true,
      unlockedDate: "2025-07-15",
    },
    {
      id: "5",
      title: "운동 러버",
      description: "운동 관련 소비 월 5회 이상",
      icon: "💪",
      unlocked: false,
    },
    {
      id: "6",
      title: "비타민 마니아",
      description: "건강기능식품 꾸준히 구매",
      icon: "💊",
      unlocked: true,
      unlockedDate: "2025-07-10",
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const lockedAchievements = achievements.filter((a) => !a.unlocked);

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gray-50">
      {/* 프로필 헤더 */}
      <div className="px-6 py-6 pt-8 bg-white">
        <div className="flex justify-center mb-4 text-center">
          <div>
            <div className="flex items-center justify-end mb-1">
              <h1 className="mr-2 text-xl font-bold text-black">
                {userProfile.name}
              </h1>
              {userProfile.plan === "premium" && (
                <span className="px-3 py-1 text-xs font-bold text-white rounded-full bg-gradient-to-r from-purple-600 to-blue-600">
                  👑 프리미엄
                </span>
              )}
              {userProfile.plan === "free" && (
                <span className="px-3 py-1 text-xs font-bold text-gray-600 bg-gray-200 rounded-full">
                  무료 플랜
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{userProfile.email}</p>
          </div>
        </div>

        {/* 총 포인트 */}
        <div className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800">총 포인트</h3>
            <button 
              onClick={fetchUserData}
              className="p-1 text-blue-500 hover:bg-blue-100 rounded"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <div className="text-center">
            <span className="text-3xl font-bold text-blue-600">
              {userProfile.totalPoints.toLocaleString()}
            </span>
            <span className="ml-1 text-lg font-semibold text-blue-500">P</span>
          </div>
          <p className="mt-2 text-sm text-center text-gray-600">
            건강한 소비로 포인트를 적립하세요! 🎉
          </p>
        </div>

        {/* 소비 통계 */}
        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 text-center rounded-lg bg-green-50">
            <div className="text-lg font-bold text-green-600">
              {getHealthySpendingRatio()}%
            </div>
            <div className="text-xs text-gray-600">건강 소비율</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="px-6 bg-white border-b border-gray-200">
        <div className="flex space-x-8">
          {[
            { key: "profile", label: "프로필", icon: "👤" },
            { key: "achievements", label: "업적", icon: "🏆" },
            { key: "settings", label: "설정", icon: "⚙️" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as "profile" | "achievements" | "settings")
              }
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-6">
        {/* 프로필 탭 */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* 최근 활동 */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-bold">최근 활동</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🥗</span>
                    <div>
                      <div className="text-sm font-semibold">
                        연어 샐러드 주문
                      </div>
                      <div className="text-xs text-gray-500">
                        오늘 오후 1:30
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    +5점
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">👩‍⚕️</span>
                    <div>
                      <div className="text-sm font-semibold">
                        약사 상담 완료
                      </div>
                      <div className="text-xs text-gray-500">
                        어제 오후 3:00
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">
                    상담완료
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">💊</span>
                    <div>
                      <div className="text-sm font-semibold">비타민D 구매</div>
                      <div className="text-xs text-gray-500">2일 전</div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">
                    쿠폰사용
                  </span>
                </div>
              </div>
            </div>

            {/* 건강 목표 */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="mb-4 text-lg font-bold">이달의 건강 목표</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      비타민D 섭취 개선
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      75%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-green-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      건강한 외식 늘리기
                    </span>
                    <span className="text-sm font-semibold text-blue-600">
                      60%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-blue-500 rounded-full"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      월 상담 2회 달성
                    </span>
                    <span className="text-sm font-semibold text-purple-600">
                      100%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-purple-500 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 소비 분석 요약 */}
            {healthAnalysis && (
              <div className="p-6 bg-white shadow-sm rounded-xl">
                <h3 className="mb-4 text-lg font-bold">이달의 소비 분석</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-100 rounded-lg">
                    <div className="text-green-700 font-bold text-lg">
                      {Math.round(healthAnalysis.goodAmount / 10000)}만원
                    </div>
                    <div className="text-green-600 text-sm">건강한 소비</div>
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-lg">
                    <div className="text-gray-700 font-bold text-lg">
                      {Math.round(healthAnalysis.totalAmount / 10000)}만원
                    </div>
                    <div className="text-gray-600 text-sm">총 소비</div>
                  </div>
                </div>
                <p className="text-sm text-center text-gray-600">
                  {getHealthySpendingRatio() >= 50 
                    ? "👍 건강한 소비 습관을 잘 유지하고 있어요!" 
                    : "💪 건강한 소비를 늘려보세요!"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 업적 탭 */}
        {activeTab === "achievements" && (
          <div className="space-y-6">
            {/* 달성한 업적 */}
            <div>
              <h3 className="mb-4 text-lg font-bold">
                달성한 업적 ({unlockedAchievements.length}개)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {unlockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 bg-white border-l-4 border-green-500 shadow-sm rounded-xl"
                  >
                    <div className="flex items-center">
                      <span className="mr-4 text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">
                          {achievement.title}
                        </h4>
                        <p className="mb-1 text-sm text-gray-600">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-green-600">
                          {achievement.unlockedDate &&
                            `달성일: ${new Date(
                              achievement.unlockedDate
                            ).toLocaleDateString("ko-KR")}`}
                        </p>
                      </div>
                      <div className="p-2 bg-green-100 rounded-full">
                        <span className="text-sm text-green-600">✓</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 미달성 업적 */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-gray-600">
                도전 중인 업적 ({lockedAchievements.length}개)
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="p-4 border-l-4 border-gray-300 shadow-sm bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center">
                      <span className="mr-4 text-3xl opacity-50">
                        {achievement.icon}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-500">
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {achievement.description}
                        </p>
                      </div>
                      <div className="p-2 bg-gray-200 rounded-full">
                        <span className="text-sm text-gray-400">🔒</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* 구독 관리 */}
            <div className="bg-white shadow-sm rounded-xl">
              <h3 className="p-6 pb-0 text-lg font-bold">구독 관리</h3>
              <div className="p-6 pt-4">
                {isPremiumUser ? (
                  <div className="p-4 mb-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-purple-700">
                        프리미엄 플랜
                      </span>
                      <span className="px-3 py-1 text-xs text-white bg-purple-600 rounded-full">
                        활성
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      다음 결제일: {getNextPaymentDate()}
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowPlanModal(true)}
                        className="flex-1 py-2 text-sm font-semibold text-purple-600 bg-white border border-purple-200 rounded-lg"
                      >
                        플랜 해지
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 mb-4 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-700">무료 플랜</span>
                      <span className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
                        현재 플랜
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      프리미엄 플랜으로 업그레이드하여 더 많은 기능을
                      이용해보세요!
                    </p>
                    <button
                      onClick={() => onTabChange("care")}
                      className="w-full py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      프리미엄 플랜 시작하기
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 앱 설정 */}
            <div className="bg-white shadow-sm rounded-xl">
              <div className="p-6 pt-4 space-y-2">
                <button
                  onClick={() => {
                    // localStorage 항목 삭제
                    localStorage.removeItem("isLoggedIn");
                    localStorage.removeItem("isPremiumUser");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userName");

                    // 로그아웃 후 초기 화면 또는 로그인 화면으로 이동하고 싶다면 아래 코드 추가
                    window.location.href = "/";
                  }}
                  className="flex items-center justify-between w-full py-3 text-red-600"
                >
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">🚪</span>
                    <span>로그아웃</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 플랜 관리 모달 */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-sm p-6 mx-4 bg-white rounded-xl">
            <h3 className="mb-4 text-lg font-bold text-center">플랜 관리</h3>
            <div className="mb-6 text-center">
              <p className="mb-2 text-sm text-gray-600">
                현재 프리미엄 플랜을 이용 중입니다.
              </p>
              <p className="text-xs text-gray-500">
                해지 시 다음 결제일까지 이용 가능합니다.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 py-3 text-sm font-semibold text-gray-600 bg-gray-100 rounded-lg"
              >
                취소
              </button>
              <button
                onClick={handleCancelPremium}
                className="flex-1 py-3 text-sm font-semibold text-white bg-red-500 rounded-lg"
              >
                플랜 해지
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭 */}
      <BottomTab selected="my" onTabChange={onTabChange} />
    </div>
  );
}