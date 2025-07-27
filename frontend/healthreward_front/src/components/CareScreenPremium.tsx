import { useEffect, useState } from "react";
import { 
  Crown, 
  BarChart3, 
  Utensils, 
  Phone, 
  Ticket, 
  Mic, 
  Video, 
  PhoneCall, 
  MessageSquare,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Store,
  Truck,
  User,
  RefreshCw,
  AlertCircle,
  Pill
} from "lucide-react";
import BottomTab from "./BottomTab";
import { supplementService, transactionService } from "../../api/services";
import type { SupplementRecommendation, Transaction } from "../../api/services";

interface FoodRecommendationData {
  oneCommand: string;
  "맞춤 음식 추천": string[];
  "ai 추천 사항": string;
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
  location: { lat: number; lng: number };
}

interface Coupon {
  id: string;
  title: string;
  discount: number;
  type: "percentage" | "fixed";
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
  const [activeTab, setActiveTab] = useState<
    "analysis" | "food" | "supplements" | "consultation" | "coupons"
  >("analysis");
  const [selectedPharmacist, setSelectedPharmacist] =
    useState<Pharmacist | null>(null);
  const [inCall, setInCall] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [sortedPharmacists, setSortedPharmacists] = useState<Pharmacist[]>([]);
  const [distances, setDistances] = useState<Record<string, number>>({});
  
  // API 연결을 위한 상태들
  const [supplementData, setSupplementData] = useState<SupplementRecommendation | null>(null);
  const [foodRecommendationData, setFoodRecommendationData] = useState<FoodRecommendationData | null>(null);
  // const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [healthAnalysis, setHealthAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 주문하기 함수 추가
  const handleOrder = (foodName: string) => {
    const query = encodeURIComponent(foodName);
    const kurlyUrl = `https://www.kurly.com/search?sword=${query}`;
    window.open(kurlyUrl, '_blank');
  };

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

  // 음식 추천 API 호출
  const fetchFoodRecommendation = async (userId: string) => {
    try {
      const response = await fetch(`https://df779d93eb1b.ngrok-free.app/recommends/food/${userId}`, {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });
      const result = await response.json();
      
      if (result.success && result.data.recommendation) {
        // JSON 문자열을 파싱
        const recommendationText = result.data.recommendation;
        const jsonMatch = recommendationText.match(/```json\n([\s\S]*?)\n```/);
        
        if (jsonMatch) {
          try {
            let jsonString = jsonMatch[1].trim();
            
            // 더 안전한 JSON 파싱을 위해 문자열을 정리
            // 1. 줄바꿈을 공백으로 변경하되, 문자열 내부의 줄바꿈은 \\n으로 처리
            jsonString = jsonString.replace(/"\s*:\s*"/g, '": "'); // 콜론 주변 공백 정리
            jsonString = jsonString.replace(/,\s*\n\s*/g, ', '); // 배열/객체 구분자 정리
            
            // 문자열 값 내부의 실제 줄바꿈을 이스케이프 처리
            jsonString = jsonString.replace(/"([^"]*)"(\s*:\s*)"([^"]*(?:\n[^"]*)*[^"]*)"/g, (_: string, key: string, colon: string, value: string) => {
              const escapedValue = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
              return `"${key}"${colon}"${escapedValue}"`;
            });
            
            console.log('정리된 JSON 문자열:', jsonString);
            
            const parsedData = JSON.parse(jsonString);
            
            // 파싱된 데이터에서 이스케이프된 문자를 다시 복원
            if (parsedData["ai 추천 사항"]) {
              parsedData["ai 추천 사항"] = parsedData["ai 추천 사항"]
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t');
            }
            
            setFoodRecommendationData(parsedData);
          } catch (parseError) {
            console.error('JSON 파싱 오류:', parseError);
            console.log('원본 JSON:', jsonMatch[1]);
            
            // JSON 파싱이 실패하면 수동으로 데이터 추출 시도
            try {
              const fallbackData = extractDataManually(jsonMatch[1]);
              if (fallbackData) {
                setFoodRecommendationData(fallbackData);
              }
            } catch (fallbackError) {
              console.error('수동 데이터 추출도 실패:', fallbackError);
            }
          }
        }
      }
    } catch (err) {
      console.error('음식 추천 조회 실패:', err);
    }
  };

  // JSON 파싱 실패 시 수동으로 데이터 추출하는 함수
  const extractDataManually = (jsonString: string): FoodRecommendationData | null => {
    try {
      // oneCommand 추출
      const oneCommandMatch = jsonString.match(/"oneCommand"\s*:\s*"([^"]+)"/);
      const oneCommand = oneCommandMatch ? oneCommandMatch[1] : "";

      // 맞춤 음식 추천 배열 추출
      const foodRecommendMatch = jsonString.match(/"맞춤 음식 추천"\s*:\s*\[(.*?)\]/s);
      let foodRecommendations: string[] = [];
      if (foodRecommendMatch) {
        const foodItems = foodRecommendMatch[1].match(/"([^"]+)"/g);
        foodRecommendations = foodItems ? foodItems.map(item => item.replace(/"/g, '')) : [];
      }

      // ai 추천 사항 추출
      const aiRecommendMatch = jsonString.match(/"ai 추천 사항"\s*:\s*"([\s\S]*?)"\s*}/);
      const aiRecommend = aiRecommendMatch ? aiRecommendMatch[1] : "";

      return {
        oneCommand,
        "맞춤 음식 추천": foodRecommendations,
        "ai 추천 사항": aiRecommend
      };
    } catch (error) {
      console.error('수동 추출 실패:', error);
      return null;
    }
  };

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
      // setTransactions(transactionResult);
      
      // 음식 추천 데이터도 가져오기
      await fetchFoodRecommendation(userId);
      
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

  // 거리 계산 (Haversine 공식)
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    // 데이터 가져오기
    fetchData();
    
    // 위치 정보 가져오기
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        const newDistances: Record<string, number> = {};
        const sorted = [...pharmacists].sort((a, b) => {
          const distA = calculateDistance(
            latitude,
            longitude,
            a.location.lat,
            a.location.lng
          );
          const distB = calculateDistance(
            latitude,
            longitude,
            b.location.lat,
            b.location.lng
          );
          newDistances[a.id] = distA;
          newDistances[b.id] = distB;
          return distA - distB;
        });

        setDistances(newDistances);
        setSortedPharmacists(sorted);
      },
      (error) => {
        console.warn("위치 정보를 가져올 수 없습니다:", error.message);
        setSortedPharmacists(pharmacists);
      }
    );
  }, []);

  // 더미 데이터 (약사 정보만 남김)

  const pharmacists: Pharmacist[] = [
    {
      id: "1",
      name: "김민정 약사",
      experience: "10년 경력",
      rating: 4.9,
      reviewCount: 127,
      image: "/images/people/pharmacist1.png",
      availableSlots: ["14:00", "15:30", "16:00", "17:30"],
      specialties: ["영양상담", "건강기능식품", "만성질환"],
      location: { lat: 37.5651, lng: 126.98955 },
    },
    {
      id: "2",
      name: "박성호 약사",
      experience: "8년 경력",
      rating: 4.8,
      reviewCount: 89,
      image: "/images/people/pharmacist2.png",
      availableSlots: ["13:30", "15:00", "16:30"],
      specialties: ["비타민상담", "면역력", "스포츠영양"],
      location: { lat: 37.5665, lng: 126.978 },
    },
  ];

  const coupons: Coupon[] = [
    {
      id: "1",
      title: "비타민D 제품 20% 할인",
      discount: 20,
      type: "percentage",
      category: "건강기능식품",
      validUntil: "2025-08-31",
      description: "비타민D 부족 개선을 위한 특별 할인",
      color: "from-blue-100 to-cyan-100 border-blue-400",
    },
    {
      id: "2",
      title: "약사 상담료 5,000원 할인",
      discount: 5000,
      type: "fixed",
      category: "상담",
      validUntil: "2025-09-30",
      description: "첫 상담 이용객 특별 혜택",
      color: "from-indigo-100 to-blue-100 border-indigo-400",
    },
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
        <div className="relative flex-1">
          <div className="flex items-center justify-center w-full h-full bg-gray-800">
            <img
              src={selectedPharmacist.image}
              alt={selectedPharmacist.name}
              className="w-64 h-64 border-4 border-white rounded-full"
            />
          </div>

          {/* 내 화면 (작은 창) */}
          <div className="absolute flex items-center justify-center w-32 h-24 bg-gray-700 border-2 border-white rounded-lg top-4 right-4">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* 상담 정보 */}
          <div className="absolute p-3 text-white bg-black bg-opacity-50 rounded-lg top-4 left-4">
            <p className="font-semibold">{selectedPharmacist.name}</p>
            <p className="text-sm opacity-75">상담 진행중...</p>
          </div>
        </div>

        {/* 통화 컨트롤 */}
        <div className="flex justify-center p-6 space-x-6 bg-gray-900">
          <button className="flex items-center justify-center bg-gray-600 rounded-full w-14 h-14">
            <Mic className="w-6 h-6 text-white" />
          </button>
          <button className="flex items-center justify-center bg-gray-600 rounded-full w-14 h-14">
            <Video className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={endCall}
            className="flex items-center justify-center bg-red-500 rounded-full w-14 h-14"
          >
            <PhoneCall className="w-6 h-6 text-white" />
          </button>
          <button className="flex items-center justify-center bg-gray-600 rounded-full w-14 h-14">
            <MessageSquare className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20 bg-gradient-to-b from-blue-50 to-white">
      {/* 프리미엄 헤더 */}
      <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="flex items-center mt-4">
          <Crown className="w-8 h-8 mr-3 text-yellow-300" />
          <div>
            <h1 className="text-xl font-bold text-white">프리미엄 케어</h1>
            <p className="text-sm text-blue-100">맞춤형 건강 관리 서비스</p>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="px-4 bg-white border-b border-gray-200">
        <div className="flex space-x-6 overflow-x-auto">
          {[
            { key: "analysis", label: "분석", icon: BarChart3 },
            { key: "food", label: "음식추천", icon: Utensils },
            { key: "supplements", label: "영양제", icon: Pill },
            { key: "consultation", label: "상담", icon: Phone },
            { key: "coupons", label: "혜택", icon: Ticket },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(
                  tab.key as "analysis" | "food" | "supplements" | "consultation" | "coupons"
                )
              }
              className={`py-3 px-1 border-b-2 transition-colors whitespace-nowrap flex items-center ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500"
              }`}
            >
              <tab.icon className="w-4 h-4 mr-1" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 p-4">
        {/* 분석 탭 */}
        {activeTab === "analysis" && (
          <div>
            {/* 새로고침 버튼 */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">7월 심화 분석 리포트</h2>
              <button 
                onClick={fetchData}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* 에러 표시 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            )}

            {/* 고급 소비 분석 */}
            <div className="p-6 mb-6 bg-white shadow-lg rounded-2xl">
              {/* 실제 데이터 기반 차트 */}
              <div className="flex justify-center mb-6">
                <div className="relative w-48 h-48">
                  {healthAnalysis && !loading ? (
                    <>
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 200 200"
                      >
                        {(() => {
                          const { goodPercent, badPercent } = calculatePercentages(healthAnalysis);
                          const radius = 70;
                          const circumference = 2 * Math.PI * radius;
                          
                          // 좋은 음식 (파란색)
                          const goodLength = (goodPercent / 100) * circumference;
                          const goodOffset = 0;
                          
                          // 나쁜 음식 (빨간색)
                          const badLength = (badPercent / 100) * circumference;
                          const badOffset = -goodLength;
                          
                          return (
                            <>
                              <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke="#E5E7EB"
                                strokeWidth="20"
                              />
                              <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke="#3B82F6"
                                strokeWidth="20"
                                strokeDasharray={`${goodLength} ${circumference}`}
                                strokeDashoffset={goodOffset}
                              />
                              <circle
                                cx="100"
                                cy="100"
                                r={radius}
                                fill="none"
                                stroke="#EF4444"
                                strokeWidth="20"
                                strokeDasharray={`${badLength} ${circumference}`}
                                strokeDashoffset={badOffset}
                              />
                            </>
                          );
                        })()}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-gray-700">
                          {Math.round(healthAnalysis.totalAmount / 10000)}
                        </div>
                        <div className="text-sm text-gray-500">만원</div>
                        <div className="mt-1 text-xs text-blue-600">
                          건강도 분석 완료
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">분석 중...</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 실제 데이터 기반 상세 분석 */}
              {healthAnalysis && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 text-center rounded-lg bg-blue-50">
                    <div className="font-bold text-blue-600">건강식</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(healthAnalysis.goodAmount / 10000)}만원 ({calculatePercentages(healthAnalysis).goodPercent}%)
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-gray-50">
                    <div className="font-bold text-gray-600">보통</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(healthAnalysis.neutralAmount / 10000)}만원
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-red-50">
                    <div className="font-bold text-red-600">주의</div>
                    <div className="text-sm text-gray-600">
                      {Math.round(healthAnalysis.badAmount / 10000)}만원 ({calculatePercentages(healthAnalysis).badPercent}%)
                    </div>
                  </div>
                </div>
              )}

              {/* AI 추천 메시지 */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-blue-100 to-indigo-100">
                <div className="flex items-start">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
                  <div>
                    <h3 className="mb-1 font-bold text-gray-800">
                      AI 건강 분석
                    </h3>
                    <p className="text-sm text-gray-700">
                      {supplementData?.["ai 추천 사항"] || 
                       "로딩 중..."}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="px-2 py-1 text-xs text-blue-600 bg-white rounded">
                        건강 개선
                      </span>
                      <span className="px-2 py-1 text-xs text-green-600 bg-white rounded">
                        맞춤 분석
                      </span>
                      <span className="px-2 py-1 text-xs text-indigo-600 bg-white rounded">
                        프리미엄
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 음식 추천 탭 */}
        {activeTab === "food" && (
          <div>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-bold">맞춤 건강 음식 추천</h2>
              <p className="text-sm text-gray-600">
                {foodRecommendationData?.oneCommand || "AI가 분석한 맞춤 메뉴"}
              </p>
            </div>

            {loading && (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-600">AI가 음식을 추천하는 중...</p>
              </div>
            )}

            {foodRecommendationData && !loading && (
              <div className="space-y-4">
                {/* 음식 추천 목록 */}
                <div className="space-y-3">
                  {foodRecommendationData["맞춤 음식 추천"].map((food, index) => (
                    <div
                      key={index}
                      className="bg-white shadow-lg rounded-xl p-4 border border-blue-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-800 text-lg">{food}</h3>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                            AI 추천
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Store className="w-4 h-4 mr-1" />
                          <span className="mr-3">마켓컬리에서 주문 가능</span>
                          <Truck className="w-4 h-4 mr-1" />
                          <span>빠른 배송</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleOrder(food)}
                        className="w-full py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center hover:from-blue-700 hover:to-indigo-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        마켓컬리에서 주문하기
                      </button>
                    </div>
                  ))}
                </div>

                {/* AI 상세 추천 사항 */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200 mt-6">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                      🤖
                    </span>
                    AI 전문가 조언
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {foodRecommendationData["ai 추천 사항"]}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 영양제 추천 탭 */}
        {activeTab === "supplements" && (
          <div>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-bold">AI 맞춤 영양제 추천</h2>
              <p className="text-sm text-gray-600">
                소비 패턴을 분석한 개인 맞춤 영양제
              </p>
            </div>
            
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {supplementData["맞춤 영양제 추천"].map((supplement, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Pill className="w-6 h-6 text-blue-600" />
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
        )}

        {/* 상담 탭 */}
        {activeTab === "consultation" && (
          <div>
            <h2 className="mb-2 text-xl font-bold">위치 기반 약사 상담</h2>
            <p className="mb-4 text-sm text-gray-600 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              가까운 약사 순으로 정렬됩니다.
            </p>

            <div className="space-y-4">
              {sortedPharmacists.map((pharmacist) => (
                <div
                  key={pharmacist.id}
                  className="p-4 bg-white border shadow-md rounded-xl"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={pharmacist.image}
                      alt={pharmacist.name}
                      className="w-16 h-16 mr-4 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold">{pharmacist.name}</h3>
                      <p className="text-sm text-gray-500">{pharmacist.experience}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {pharmacist.rating} ({pharmacist.reviewCount} 리뷰)
                        </span>
                      </div>
                      {userLocation && distances[pharmacist.id] && (
                        <p className="mt-1 text-xs text-blue-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          약 {distances[pharmacist.id].toFixed(1)} km 거리
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    <strong className="text-sm">전문 분야:</strong>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pharmacist.specialties.map((spec) => (
                        <span
                          key={spec}
                          className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <strong className="text-sm flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      상담 가능 시간:
                    </strong>
                    <div className="grid grid-cols-4 gap-2 mt-1">
                      {pharmacist.availableSlots.map((slot) => (
                        <button
                          key={slot}
                          className="px-2 py-1 text-xs text-blue-700 rounded bg-blue-50"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => startVideoCall(pharmacist)}
                    className="w-full py-2 font-semibold text-white bg-blue-500 rounded-lg flex items-center justify-center"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    전화 상담 시작하기
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 쿠폰 탭 */}
        {activeTab === "coupons" && (
          <div>
            <div className="mb-4">
              <h2 className="mb-2 text-xl font-bold">프리미엄 전용 혜택</h2>
              <p className="text-sm text-gray-600">
                건강 관리에 도움이 되는 특별 할인 혜택
              </p>
            </div>

            <div className="space-y-4">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`bg-gradient-to-r ${coupon.color} rounded-xl p-4 border-l-4`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 flex items-center">
                        <Ticket className="w-4 h-4 mr-2" />
                        {coupon.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {coupon.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span className="mr-3">{coupon.validUntil}까지</span>
                        <span>{coupon.category}</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {coupon.type === "percentage"
                          ? `${coupon.discount}%`
                          : `${coupon.discount.toLocaleString()}원`}
                      </div>
                      <div className="text-xs text-gray-500">할인</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 추가 혜택 안내 */}
            <div className="p-4 mt-6 text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <h3 className="mb-2 font-bold flex items-center">
                <Crown className="w-5 h-5 mr-2 text-yellow-300" />
                이달의 추가 혜택
              </h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center">
                  <Phone className="w-3 h-3 mr-2" />
                  월 3회 무료 약사 상담
                </li>
                <li className="flex items-center">
                  <Truck className="w-3 h-3 mr-2" />
                  건강식품 무료배송
                </li>
                <li className="flex items-center">
                  <Ticket className="w-3 h-3 mr-2" />
                  개인 맞춤 영양제 20% 할인
                </li>
                <li className="flex items-center">
                  <Star className="w-3 h-3 mr-2" />
                  우선 예약 서비스
                </li>
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