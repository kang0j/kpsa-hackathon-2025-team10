import React, { useState } from 'react';
import { Receipt, History, Heart, Crown, Star, Zap, Play, CheckCircle, TrendingUp, Bookmark, DollarSign } from "lucide-react";
import BottomTab from "./BottomTab";

export default function HomeScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [showPremiumAd, setShowPremiumAd] = useState(true);
  const [completedTip, setCompletedTip] = useState(false);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>([]);

  // 더미 데이터
  const todayFoods = [
    {
      id: '1',
      name: '연어 아보카도 볼',
      score: 95,
      calories: 320,
      nutrients: ['비타민D', '오메가3'],
      image: 'https://placehold.co/120x80',
      nearbyStores: 3
    },
    {
      id: '2',
      name: '시금치 달걀 샐러드',
      score: 88,
      calories: 180,
      nutrients: ['철분', '엽산'],
      image: 'https://placehold.co/120x80',
      nearbyStores: 5
    },
    {
      id: '3',
      name: '브로콜리 퀴노아',
      score: 92,
      calories: 250,
      nutrients: ['비타민C', '단백질'],
      image: 'https://placehold.co/120x80',
      nearbyStores: 2
    }
  ];

  const stretchingVideos = [
    {
      id: '1',
      title: '5분 목어깨 스트레칭',
      duration: '5:24',
      views: '12만',
      difficulty: '초급',
      thumbnail: 'https://placehold.co/160x90'
    },
    {
      id: '2',
      title: '허리 통증 완화 운동',
      duration: '8:15',
      views: '25만',
      difficulty: '중급',
      thumbnail: 'https://placehold.co/160x90'
    },
    {
      id: '3',
      title: '전신 스트레칭 루틴',
      duration: '12:30',
      views: '45만',
      difficulty: '초급',
      thumbnail: 'https://placehold.co/160x90'
    },
    {
      id: '4',
      title: '하체 근력 강화',
      duration: '10:45',
      views: '18만',
      difficulty: '중급',
      thumbnail: 'https://placehold.co/160x90'
    }
  ];

  const weeklyChallenge = {
    title: '이번 주 목표: 건강식 5회 먹기',
    current: 3,
    total: 5,
    reward: 100,
    daysLeft: 4
  };

  const healthTip = {
    title: '물 하루 8잔 마시기',
    description: '충분한 수분 섭취로 신진대사를 활발하게 하고 독소를 배출하세요.',
    icon: '💧'
  };

  const healthNews = [
    {
      id: '1',
      title: '겨울철 면역력 높이는 5가지 방법',
      summary: '비타민D와 아연 섭취의 중요성',
      source: '헬스조선',
      time: '2시간 전'
    },
    {
      id: '2',
      title: '요즘 인기 슈퍼푸드 TOP 3',
      summary: '아보카도, 퀴노아, 케일의 놀라운 효과',
      source: '라이프',
      time: '5시간 전'
    }
  ];

  const toggleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  // 현재 날짜 가져오기
  const getCurrentDateString = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayName = dayNames[now.getDay()];
        
    return `${month}월 ${date}일 ${dayName}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 text-center pt-8">
        <p className="text-sm">홍길동님, 안녕하세요</p>
        <p className="text-xs text-gray-500">{getCurrentDateString()}</p>
      </div>

      <div className="p-4 mx-4 mb-4 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl">
        <p className="text-sm">적립 포인트</p>
        <div className="flex items-center">
          <p className="text-3xl font-extrabold">530</p>
          <DollarSign className="w-6 h-6 ml-1 text-green-600" />
        </div>
        <p className="text-3xl font-extrabold">530(p.)</p>
      </div>

      <div className="flex justify-between px-6 mb-4 text-xs">
        {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <span>{d}</span>
            <span className="px-2 mt-1 text-xs bg-gray-200 rounded-full">
              {21 + i}
            </span>
          </div>
        ))}
      </div>

      {/* 프리미엄 플랜 광고 */}
      {showPremiumAd && (
        <div className="mx-4 mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-4 text-white relative overflow-hidden">
          {/* 배경 아이콘들 */}
          <div className="absolute top-2 right-2 opacity-20">
            <Crown className="w-12 h-12" />
          </div>
          <div className="absolute bottom-2 left-2 opacity-10">
            <Star className="w-8 h-8" />
          </div>
          <div className="absolute top-1/2 right-8 opacity-10">
            <Zap className="w-6 h-6" />
          </div>
          
          {/* 닫기 버튼 */}
          <button 
            onClick={() => setShowPremiumAd(false)}
            className="absolute top-3 right-3 text-white/70 hover:text-white text-lg"
          >
            ✕
          </button>

          {/* 메인 컨텐츠 */}
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <Crown className="w-5 h-5 mr-2" />
              <span className="text-sm font-bold">프리미엄 플랜</span>
              <span className="bg-yellow-400 text-purple-800 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                HOT
              </span>
            </div>
            
            <h3 className="text-lg font-bold mb-2">
              맞춤 건강 관리의 시작! 🎯
            </h3>
            
            <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
              <div className="flex items-center">
                <span className="mr-1">🥗</span>
                <span>맞춤 음식 추천</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">👩‍⚕️</span>
                <span>약사 화상 상담</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🎫</span>
                <span>전용 할인 혜택</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">📊</span>
                <span>AI 심화 분석</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-90 line-through">월 14,900원</div>
                <div className="text-lg font-bold">
                  월 9,900원
                  <span className="text-xs ml-1 bg-red-500 px-2 py-0.5 rounded">33% 할인</span>
                </div>
              </div>
              <button 
                onClick={() => onTabChange("care")}
                className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
              >
                7일 무료 체험
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-4 mx-4 mb-4 bg-sky-50 rounded-xl">
        <div>
          <p className="text-sm font-bold">💊 약사 건강 컨설팅</p>
          <p className="text-xs text-gray-600">&lt;약사 소개 한 줄&gt;</p>
        </div>
        <div className="text-xs text-gray-500">근처 500m</div>
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-2 gap-2 px-4 mb-6">
        {/* 영수증 인증하기 - Large Left Button */}
        <div className="col-span-1 row-span-2 relative">
          <div className="w-full h-52 bg-gradient-to-l from-blue-400 to-blue-600 rounded-xl cursor-pointer overflow-hidden relative">
            {/* Background Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Receipt className="w-20 h-20 text-white/60" />
            </div>
            {/* Text */}
            <div className="absolute bottom-8 left-4 text-white text-xl font-bold">
              영수증<br/>인증하기
            </div>
          </div>
        </div>

        {/* 소비내역 - Top Right Button */}
        <div 
          className="bg-green-400 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[100px] cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange("history")}
        >
          {/* Background Icon */}
          <div className="absolute top-2 right-2 opacity-30">
            <History className="w-10 h-10 text-white/60" />
          </div>
          {/* Text */}
          <span className="absolute bottom-4 left-4 text-white text-lg font-bold">소비내역</span>
        </div>

        {/* 케어 - Bottom Right Button */}
        <div 
          className="bg-sky-300 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[100px] cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange("care")}
        >
          {/* Background Icon */}
          <div className="absolute top-2 right-2 opacity-30">
            <Heart className="w-10 h-10 text-white/60" />
          </div>
          {/* Text */}
          <span className="absolute bottom-4 left-4 text-white text-lg font-bold">케어</span>
        </div>
      </div>

      {/* 주간 챌린지 */}
      <div className="mb-6 mx-4">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-black">🏆 주간 챌린지</h2>
            <span className="text-sm text-blue-600 font-semibold">{weeklyChallenge.daysLeft}일 남음</span>
          </div>
          <h3 className="font-semibold mb-2">{weeklyChallenge.title}</h3>
          <div className="flex items-center mb-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(weeklyChallenge.current / weeklyChallenge.total) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{weeklyChallenge.current}/{weeklyChallenge.total}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">완료 시 <span className="font-bold text-green-600">{weeklyChallenge.reward}P</span> 적립</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold">
              도전하기
            </button>
          </div>
        </div>
      </div>

      {/* 오늘의 건강 팁 */}
      <div className="mb-6 mx-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-black">💡 오늘의 건강 팁</h2>
          <p className="text-sm text-gray-600">최신 건강 정보를 확인하세요</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold mb-2">{healthTip.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{healthTip.description}</p>
          <button 
            onClick={() => setCompletedTip(!completedTip)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              completedTip 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-500 text-white'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {completedTip ? '실천 완료!' : '실천하기'}
            </span>
          </button>
        </div>
      </div>

      {/* 건강 뉴스 & 트렌드 */}
      <div className="mb-6 mx-4">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-black">📰 건강 뉴스 & 트렌드</h2>
          <p className="text-sm text-gray-600">최신 건강 정보를 확인하세요</p>
        </div>
        <div className="space-y-3">
          {healthNews.map(news => (
            <div key={news.id} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">{news.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{news.source} • {news.time}</span>
                    <button className="text-blue-500">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <TrendingUp className="w-6 h-6 text-green-500 ml-3 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomTab selected="home" onTabChange={onTabChange} />
    </div>
  );
}