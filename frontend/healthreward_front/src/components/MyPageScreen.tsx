import { useState, useEffect } from "react";
import BottomTab from "./BottomTab";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: "free" | "premium";
  joinDate: string;
  healthScore: number;
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

  // 컴포넌트 마운트 시 localStorage에서 프리미엄 상태 확인
  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremiumUser');
    const startDate = localStorage.getItem('premiumStartDate');
    
    if (premiumStatus === 'true') {
      setIsPremiumUser(true);
      setPremiumStartDate(startDate);
    }
  }, []);

  // 프리미엄 플랜 해지 처리
  const handleCancelPremium = () => {
    setIsPremiumUser(false);
    setPremiumStartDate(null);
    localStorage.removeItem('isPremiumUser');
    localStorage.removeItem('premiumStartDate');
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

  // 더미 사용자 데이터 (프리미엄 상태에 따라 plan 값 변경)
  const userProfile: UserProfile = {
    name: "김건강",
    email: "healthy@email.com",
    avatar: "https://placehold.co/100x100",
    plan: isPremiumUser ? "premium" : "free",
    joinDate: "2025-06-15",
    healthScore: 87,
    totalExpenses: 2450000,
    healthyExpenses: 1560000,
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
        <div className="flex items-center mb-4">
          <img
            src={userProfile.avatar}
            alt="프로필"
            className="w-20 h-20 mr-4 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center mb-1">
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
            <p className="mb-2 text-sm text-gray-600">{userProfile.email}</p>
            <p className="text-xs text-gray-500">
              가입일:{" "}
              {new Date(userProfile.joinDate).toLocaleDateString("ko-KR")}
            </p>
          </div>
        </div>

        {/* 건강 점수 */}
        <div className="p-4 mb-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800">이달의 건강 점수</h3>
            <span className="text-2xl font-bold text-green-600">
              {userProfile.healthScore}
            </span>
          </div>
          <div className="w-full h-3 mb-2 bg-gray-200 rounded-full">
            <div
              className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
              style={{ width: `${userProfile.healthScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">평균보다 15점 높아요! 🎉</p>
        </div>

        {/* 소비 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 text-center rounded-lg bg-blue-50">
            <div className="text-lg font-bold text-blue-600">
              ₩{(userProfile.totalExpenses / 10000).toFixed(0)}만원
            </div>
            <div className="text-xs text-gray-600">총 소비</div>
          </div>
          <div className="p-3 text-center rounded-lg bg-green-50">
            <div className="text-lg font-bold text-green-600">
              {Math.round(
                (userProfile.healthyExpenses / userProfile.totalExpenses) * 100
              )}
              %
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
            {/* 계정 설정 */}
            <div className="bg-white shadow-sm rounded-xl">
              <h3 className="p-6 pb-0 text-lg font-bold">계정 설정</h3>
              <div className="p-6 pt-4 space-y-4">
                <button className="flex items-center justify-between w-full py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">👤</span>
                    <span>프로필 편집</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

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
                  <div className="p-4 mb-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-700">무료 플랜</span>
                      <span className="px-3 py-1 text-xs text-gray-600 bg-gray-200 rounded-full">
                        현재 플랜
                      </span>
                    </div>
                    <p className="mb-3 text-sm text-gray-600">
                      프리미엄 플랜으로 업그레이드하여 더 많은 기능을 이용해보세요!
                    </p>
                    <button 
                      onClick={() => onTabChange('care')}
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
                <button className="flex items-center justify-between w-full py-3 text-red-600">
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