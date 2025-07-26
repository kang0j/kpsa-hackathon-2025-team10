import { useState } from "react";
import BottomTab from "./BottomTab";
import CareScreenPremium from "./CareScreenPremium";

export default function CareScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [showPremium, setShowPremium] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  // 프리미엄 구독 처리
  const handlePremiumUpgrade = () => {
    setIsPremiumUser(true);
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
        <h1 className="pt-8 mb-8 text-2xl font-bold text-center">
          7월 소비 패턴 분석
        </h1>

        {/* 도넛 차트 영역 */}
        <div className="flex justify-center mb-12 overflow-y-auto no-scrollbar">
          <div className="relative w-64 h-64">
            {/* 도넛 차트 SVG */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              {/* 건강하지 않은 음식 (주황색) - 큰 섹션 */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#FF8A50"
                strokeWidth="25"
                strokeDasharray="188 314"
                strokeDashoffset="0"
              />
              {/* 건강한 음식 (초록색) */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#4ECDC4"
                strokeWidth="25"
                strokeDasharray="94 408"
                strokeDashoffset="-188"
              />
              {/* 보라색 섹션 */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#6366F1"
                strokeWidth="25"
                strokeDasharray="125 377"
                strokeDashoffset="-282"
              />
            </svg>

            {/* 중앙 텍스트 */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-700">245</div>
              <div className="text-sm tracking-wide text-gray-500 uppercase">
                만 원
              </div>
            </div>

            {/* 범례 라벨들 */}
            <div className="absolute px-2 py-1 text-xs text-gray-600 bg-white rounded shadow top-8 right-4">
              건강하지 않은 음식
            </div>
            <div className="absolute px-2 py-1 text-xs text-gray-600 bg-white rounded shadow left-4 top-1/3">
              건강한 음식
            </div>
          </div>
        </div>

        {/* 분석 결과 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold leading-tight text-black">
            소비를 분석해보니,
            <br />
            비타민D 섭취가 부족해요
          </h2>
        </div>

        {/* 광고 영역들 */}
        <div className="mb-8 space-y-4">
          <div className="p-6 text-center bg-black rounded-xl">
            <div className="text-lg font-medium text-white">
              &lt;영양제 추천 AD&gt;
            </div>
          </div>
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
