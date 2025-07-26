import { useState } from "react";
import BottomTab from "./BottomTab";

interface FoodRecommendation {
  id: string;
  name: string;
  nutritionScore: number;
  nutrients: string[];
  image: string;
  price: number;
  nearbyStores: number;
  deliveryTime: string;
}

interface Pharmacist {
  id: string;
  name: string;
  experience: string;
  rating: number;
  reviewCount: number;
  image: string;
  availableSlots: string[];
  specialties: string[];
}

interface Coupon {
  id: string;
  title: string;
  discount: number;
  type: 'percentage' | 'fixed';
  category: string;
  validUntil: string;
  description: string;
  color: string;
}

export default function CareScreenPremium({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'food' | 'consultation' | 'coupons'>('analysis');
  const [selectedPharmacist, setSelectedPharmacist] = useState<Pharmacist | null>(null);
  const [inCall, setInCall] = useState(false);

  // 더미 데이터
  const foodRecommendations: FoodRecommendation[] = [
    {
      id: '1',
      name: '연어 아보카도 샐러드',
      nutritionScore: 95,
      nutrients: ['비타민D', '오메가3', '단백질'],
      image: 'https://placehold.co/300x200',
      price: 12000,
      nearbyStores: 3,
      deliveryTime: '25분'
    },
    {
      id: '2',
      name: '버섯 현미밥',
      nutritionScore: 88,
      nutrients: ['비타민D', '식이섬유', '비타민B'],
      image: 'https://placehold.co/300x200',
      price: 8500,
      nearbyStores: 2,
      deliveryTime: '30분'
    },
    {
      id: '3',
      name: '계란 시금치 볶음',
      nutritionScore: 92,
      nutrients: ['비타민D', '철분', '엽산'],
      image: 'https://placehold.co/300x200',
      price: 7000,
      nearbyStores: 4,
      deliveryTime: '20분'
    }
  ];

  const pharmacists: Pharmacist[] = [
    {
      id: '1',
      name: '김민정 약사',
      experience: '10년 경력',
      rating: 4.9,
      reviewCount: 127,
      image: 'https://placehold.co/80x80',
      availableSlots: ['14:00', '15:30', '16:00', '17:30'],
      specialties: ['영양상담', '건강기능식품', '만성질환']
    },
    {
      id: '2',
      name: '박성호 약사',
      experience: '8년 경력',
      rating: 4.8,
      reviewCount: 89,
      image: 'https://placehold.co/80x80',
      availableSlots: ['13:30', '15:00', '16:30'],
      specialties: ['비타민상담', '면역력', '스포츠영양']
    }
  ];

  const coupons: Coupon[] = [
    {
      id: '1',
      title: '비타민D 제품 20% 할인',
      discount: 20,
      type: 'percentage',
      category: '건강기능식품',
      validUntil: '2025-08-31',
      description: '비타민D 부족 개선을 위한 특별 할인',
      color: 'from-orange-100 to-red-100 border-orange-400'
    },
    {
      id: '2',
      title: '건강식 배달 15% 할인',
      discount: 15,
      type: 'percentage',
      category: '음식배달',
      validUntil: '2025-08-15',
      description: '추천 건강식 전용 배달 할인',
      color: 'from-green-100 to-emerald-100 border-green-400'
    },
    {
      id: '3',
      title: '약사 상담료 5,000원 할인',
      discount: 5000,
      type: 'fixed',
      category: '상담',
      validUntil: '2025-09-30',
      description: '첫 상담 이용객 특별 혜택',
      color: 'from-blue-100 to-cyan-100 border-blue-400'
    }
  ];

  const startVideoCall = (pharmacist: Pharmacist) => {
    setSelectedPharmacist(pharmacist);
    setInCall(true);
  };

  const endCall = () => {
    setInCall(false);
    setSelectedPharmacist(null);
  };

  if (inCall && selectedPharmacist) {
    return (
      <div className="flex flex-col h-screen bg-black">
        {/* 화상통화 화면 */}
        <div className="flex-1 relative">
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <img 
              src={selectedPharmacist.image} 
              alt={selectedPharmacist.name}
              className="w-64 h-64 rounded-full border-4 border-white"
            />
          </div>
          
          {/* 내 화면 (작은 창) */}
          <div className="absolute top-4 right-4 w-32 h-24 bg-gray-700 rounded-lg border-2 border-white flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">나</span>
            </div>
          </div>

          {/* 상담 정보 */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-lg">
            <p className="font-semibold">{selectedPharmacist.name}</p>
            <p className="text-sm opacity-75">상담 진행중...</p>
          </div>
        </div>

        {/* 통화 컨트롤 */}
        <div className="bg-gray-900 p-6 flex justify-center space-x-6">
          <button className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🎤</span>
          </button>
          <button className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">📹</span>
          </button>
          <button 
            onClick={endCall}
            className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-white text-xl">📞</span>
          </button>
          <button className="w-14 h-14 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">💬</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      {/* 프리미엄 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <div className="flex justify-between items-center text-white">
          <div className="text-lg font-semibold">9:41</div>
          <div className="flex items-center space-x-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <div className="w-6 h-3 border border-white rounded-sm bg-white"></div>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <span className="text-2xl mr-3">👑</span>
          <div>
            <h1 className="text-xl font-bold text-white">프리미엄 케어</h1>
            <p className="text-purple-100 text-sm">맞춤형 건강 관리 서비스</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { key: 'analysis', label: '분석', icon: '📊' },
            { key: 'food', label: '음식추천', icon: '🥗' },
            { key: 'consultation', label: '상담', icon: '👩‍⚕️' },
            { key: 'coupons', label: '혜택', icon: '🎫' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'analysis' | 'food' | 'consultation' | 'coupons')}
              className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-purple-600 text-purple-600'
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
      <div className="flex-1 p-4">
        {/* 분석 탭 */}
        {activeTab === 'analysis' && (
          <div>
            {/* 고급 소비 분석 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <h2 className="text-xl font-bold mb-4">7월 심화 분석 리포트</h2>
              
              {/* 개선된 차트 */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#E5E7EB" strokeWidth="20"/>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#10B981" strokeWidth="20" 
                            strokeDasharray="132 308" strokeDashoffset="0"/>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#F59E0B" strokeWidth="20" 
                            strokeDasharray="88 352" strokeDashoffset="-132"/>
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#EF4444" strokeWidth="20" 
                            strokeDasharray="88 352" strokeDashoffset="-220"/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-700">245</div>
                    <div className="text-sm text-gray-500">만원</div>
                    <div className="text-xs text-green-600 mt-1">↗ 건강도 +15%</div>
                  </div>
                </div>
              </div>

              {/* 상세 분석 */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-green-600 font-bold">건강식</div>
                  <div className="text-sm text-gray-600">132만원 (54%)</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-yellow-600 font-bold">보통</div>
                  <div className="text-sm text-gray-600">88만원 (36%)</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-red-600 font-bold">주의</div>
                  <div className="text-sm text-gray-600">25만원 (10%)</div>
                </div>
              </div>

              {/* AI 추천 메시지 */}
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">🤖</span>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">AI 건강 분석</h3>
                    <p className="text-sm text-gray-700">
                      비타민D 섭취가 권장량의 62%로 부족합니다. 연어, 계란, 버섯 등의 섭취를 늘리고 
                      하루 15분 햇볕 쬐기를 추천드려요. 
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="bg-white px-2 py-1 rounded text-xs text-purple-600">비타민D ↓</span>
                      <span className="bg-white px-2 py-1 rounded text-xs text-green-600">단백질 ✓</span>
                      <span className="bg-white px-2 py-1 rounded text-xs text-blue-600">수분 ✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 음식 추천 탭 */}
        {activeTab === 'food' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">맞춤 건강 음식 추천</h2>
              <p className="text-gray-600 text-sm">비타민D 보충을 위한 개인 맞춤 메뉴</p>
            </div>

            <div className="space-y-4">
              {foodRecommendations.map(food => (
                <div key={food.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="flex">
                    <img src={food.image} alt={food.name} className="w-24 h-24 object-cover"/>
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800">{food.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-purple-600">{food.nutritionScore}</div>
                          <div className="text-xs text-gray-500">영양점수</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {food.nutrients.map(nutrient => (
                          <span key={nutrient} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                            {nutrient}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>₩{food.price.toLocaleString()}</span>
                        <span>근처 {food.nearbyStores}곳 • {food.deliveryTime}</span>
                      </div>
                      
                      <button className="w-full mt-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg font-semibold">
                        주문하기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 상담 탭 */}
        {activeTab === 'consultation' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">전문 약사 상담</h2>
              <p className="text-gray-600 text-sm">실시간 화상 상담으로 정확한 건강 조언을 받으세요</p>
            </div>

            <div className="space-y-4">
              {pharmacists.map(pharmacist => (
                <div key={pharmacist.id} className="bg-white rounded-xl shadow-lg p-4">
                  <div className="flex items-center mb-4">
                    <img src={pharmacist.image} alt={pharmacist.name} className="w-16 h-16 rounded-full mr-4"/>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{pharmacist.name}</h3>
                      <p className="text-sm text-gray-600">{pharmacist.experience}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400 text-sm">
                          {'★'.repeat(Math.floor(pharmacist.rating))}
                        </div>
                        <span className="text-sm text-gray-500 ml-1">
                          {pharmacist.rating} ({pharmacist.reviewCount} 리뷰)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-semibold text-sm mb-2">전문 분야</h4>
                    <div className="flex flex-wrap gap-2">
                      {pharmacist.specialties.map(specialty => (
                        <span key={specialty} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">오늘 상담 가능 시간</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {pharmacist.availableSlots.map(slot => (
                        <button key={slot} className="bg-blue-50 text-blue-700 py-1 px-2 rounded text-xs">
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => startVideoCall(pharmacist)}
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
                  >
                    📞 화상 상담 시작하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 쿠폰 탭 */}
        {activeTab === 'coupons' && (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">프리미엄 전용 혜택</h2>
              <p className="text-gray-600 text-sm">건강 관리에 도움이 되는 특별 할인 혜택</p>
            </div>

            <div className="space-y-4">
              {coupons.map(coupon => (
                <div key={coupon.id} className={`bg-gradient-to-r ${coupon.color} rounded-xl p-4 border-l-4`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{coupon.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <span className="mr-3">📅 {coupon.validUntil}까지</span>
                        <span>🏷️ {coupon.category}</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-red-600">
                        {coupon.type === 'percentage' ? `${coupon.discount}%` : `${coupon.discount.toLocaleString()}원`}
                      </div>
                      <div className="text-xs text-gray-500">할인</div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-white bg-opacity-80 text-gray-800 py-2 rounded-lg font-semibold mt-3 hover:bg-opacity-100 transition-all">
                    🎫 쿠폰 사용하기
                  </button>
                </div>
              ))}
            </div>

            {/* 추가 혜택 안내 */}
            <div className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
              <h3 className="font-bold mb-2">🎉 이달의 추가 혜택</h3>
              <ul className="text-sm space-y-1">
                <li>• 월 3회 무료 약사 상담</li>
                <li>• 건강식품 무료배송</li>
                <li>• 개인 맞춤 영양제 20% 할인</li>
                <li>• 우선 예약 서비스</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* 하단 탭 */}
      <BottomTab selected="care" onTabChange={onTabChange} />
    </div>
  );
}