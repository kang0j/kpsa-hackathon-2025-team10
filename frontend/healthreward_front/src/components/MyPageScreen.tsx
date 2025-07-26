import { useState } from "react";
import BottomTab from "./BottomTab";

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'premium';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'settings'>('profile');

  // 더미 사용자 데이터
  const userProfile: UserProfile = {
    name: "김건강",
    email: "healthy@email.com",
    avatar: "https://placehold.co/100x100",
    plan: "premium",
    joinDate: "2025-06-15",
    healthScore: 87,
    totalExpenses: 2450000,
    healthyExpenses: 1560000
  };

  const achievements: Achievement[] = [
    {
      id: '1',
      title: '건강 지킴이',
      description: '7일 연속 건강한 식단 유지',
      icon: '🥗',
      unlocked: true,
      unlockedDate: '2025-07-20'
    },
    {
      id: '2',
      title: '영양 박사',
      description: '모든 필수 영양소 섭취 달성',
      icon: '🎓',
      unlocked: true,
      unlockedDate: '2025-07-18'
    },
    {
      id: '3',
      title: '절약 왕',
      description: '건강한 소비로 월 예산 10% 절약',
      icon: '💰',
      unlocked: false
    },
    {
      id: '4',
      title: '상담 마스터',
      description: '약사 상담 10회 완료',
      icon: '👩‍⚕️',
      unlocked: true,
      unlockedDate: '2025-07-15'
    },
    {
      id: '5',
      title: '운동 러버',
      description: '운동 관련 소비 월 5회 이상',
      icon: '💪',
      unlocked: false
    },
    {
      id: '6',
      title: '비타민 마니아',
      description: '건강기능식품 꾸준히 구매',
      icon: '💊',
      unlocked: true,
      unlockedDate: '2025-07-10'
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* 상단 상태바 */}
      <div className="bg-white flex justify-between items-center px-6 py-4">
        <div className="text-black text-lg font-semibold">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-400 rounded-sm"></div>
          </div>
          <svg className="w-5 h-4" viewBox="0 0 20 16" fill="none">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H16C17.1046 4 18 4.89543 18 6V10C18 11.1046 17.1046 12 16 12H4C2.89543 12 2 11.1046 2 10V6Z" fill="black"/>
            <path d="M18 8H20V8.5C20 9.32843 19.3284 10 18.5 10H18V8Z" fill="black"/>
          </svg>
        </div>
      </div>

      {/* 프로필 헤더 */}
      <div className="bg-white px-6 py-6">
        <div className="flex items-center mb-4">
          <img 
            src={userProfile.avatar} 
            alt="프로필" 
            className="w-20 h-20 rounded-full mr-4"
          />
          <div className="flex-1">
            <div className="flex items-center mb-1">
              <h1 className="text-xl font-bold text-black mr-2">{userProfile.name}</h1>
              {userProfile.plan === 'premium' && (
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  👑 프리미엄
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">{userProfile.email}</p>
            <p className="text-gray-500 text-xs">
              가입일: {new Date(userProfile.joinDate).toLocaleDateString('ko-KR')}
            </p>
          </div>
        </div>

        {/* 건강 점수 */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-800">이달의 건강 점수</h3>
            <span className="text-2xl font-bold text-green-600">{userProfile.healthScore}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${userProfile.healthScore}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">평균보다 15점 높아요! 🎉</p>
        </div>

        {/* 소비 통계 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-blue-600">
              ₩{(userProfile.totalExpenses / 10000).toFixed(0)}만원
            </div>
            <div className="text-xs text-gray-600">총 소비</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-green-600">
              {Math.round((userProfile.healthyExpenses / userProfile.totalExpenses) * 100)}%
            </div>
            <div className="text-xs text-gray-600">건강 소비율</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="flex space-x-8">
          {[
            { key: 'profile', label: '프로필', icon: '👤' },
            { key: 'achievements', label: '업적', icon: '🏆' },
            { key: 'settings', label: '설정', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'profile' | 'achievements' | 'settings')}
              className={`py-3 px-1 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500'
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
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* 최근 활동 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">최근 활동</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🥗</span>
                    <div>
                      <div className="font-semibold text-sm">연어 샐러드 주문</div>
                      <div className="text-xs text-gray-500">오늘 오후 1:30</div>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-semibold">+5점</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👩‍⚕️</span>
                    <div>
                      <div className="font-semibold text-sm">약사 상담 완료</div>
                      <div className="text-xs text-gray-500">어제 오후 3:00</div>
                    </div>
                  </div>
                  <span className="text-blue-600 text-sm font-semibold">상담완료</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">💊</span>
                    <div>
                      <div className="font-semibold text-sm">비타민D 구매</div>
                      <div className="text-xs text-gray-500">2일 전</div>
                    </div>
                  </div>
                  <span className="text-purple-600 text-sm font-semibold">쿠폰사용</span>
                </div>
              </div>
            </div>

            {/* 건강 목표 */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-4">이달의 건강 목표</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">비타민D 섭취 개선</span>
                    <span className="text-sm text-green-600 font-semibold">75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">건강한 외식 늘리기</span>
                    <span className="text-sm text-blue-600 font-semibold">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">월 상담 2회 달성</span>
                    <span className="text-sm text-purple-600 font-semibold">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 업적 탭 */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {/* 달성한 업적 */}
            <div>
              <h3 className="text-lg font-bold mb-4">달성한 업적 ({unlockedAchievements.length}개)</h3>
              <div className="grid grid-cols-1 gap-4">
                {unlockedAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                        <p className="text-xs text-green-600">
                          {achievement.unlockedDate && 
                            `달성일: ${new Date(achievement.unlockedDate).toLocaleDateString('ko-KR')}`
                          }
                        </p>
                      </div>
                      <div className="bg-green-100 rounded-full p-2">
                        <span className="text-green-600 text-sm">✓</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 미달성 업적 */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-600">도전 중인 업적 ({lockedAchievements.length}개)</h3>
              <div className="grid grid-cols-1 gap-4">
                {lockedAchievements.map(achievement => (
                  <div key={achievement.id} className="bg-gray-50 rounded-xl p-4 shadow-sm border-l-4 border-gray-300">
                    <div className="flex items-center">
                      <span className="text-3xl mr-4 opacity-50">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-500">{achievement.title}</h4>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                      </div>
                      <div className="bg-gray-200 rounded-full p-2">
                        <span className="text-gray-400 text-sm">🔒</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 설정 탭 */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* 계정 설정 */}
            <div className="bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-bold p-6 pb-0">계정 설정</h3>
              <div className="p-6 pt-4 space-y-4">
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">👤</span>
                    <span>프로필 편집</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔔</span>
                    <span>알림 설정</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🔒</span>
                    <span>개인정보 보호</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

            {/* 구독 관리 */}
            <div className="bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-bold p-6 pb-0">구독 관리</h3>
              <div className="p-6 pt-4">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-purple-700">프리미엄 플랜</span>
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">활성</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">다음 결제일: 2025년 8월 15일</p>
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-white text-purple-600 py-2 rounded-lg text-sm font-semibold border border-purple-200">
                      플랜 변경
                    </button>
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold">
                      결제 관리
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 앱 설정 */}
            <div className="bg-white rounded-xl shadow-sm">
              <h3 className="text-lg font-bold p-6 pb-0">앱 설정</h3>
              <div className="p-6 pt-4 space-y-4">
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">❓</span>
                    <span>도움말</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">📧</span>
                    <span>문의하기</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">⭐</span>
                    <span>앱 평가하기</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between py-3 text-red-600">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">🚪</span>
                    <span>로그아웃</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단 탭 */}
      <BottomTab selected="my" onTabChange={onTabChange} />
    </div>
  );
}