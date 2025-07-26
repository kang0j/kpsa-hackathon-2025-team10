import React, { useState, useRef, useEffect } from "react";
import {
  Receipt,
  History,
  Heart,
  Crown,
  Star,
  Zap,
  CheckCircle,
  TrendingUp,
  Bookmark,
  Camera,
  Upload,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import BottomTab from "./BottomTab";
import { receiptService, userService } from "../../api/services";
import type { User } from "../../api/services";

export default function HomeScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [showPremiumAd, setShowPremiumAd] = useState(true);
  const [completedTip, setCompletedTip] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(530);
  const [loading, setLoading] = useState(false);

  // 영수증 업로드 관련 상태
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 사용자 포인트 조회
  const fetchUserPoints = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      setLoading(true);
      const userInfo = await userService.getUserInfo(userId);
      setUserPoints(userInfo.rewardPoints);
    } catch (error) {
      console.error('포인트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 포인트 조회
  useEffect(() => {
    fetchUserPoints();
  }, []);

  const weeklyChallenge = {
    title: "이번 주 목표: 건강한 음식 5개 이상 구입하기",
    current: 3,
    total: 5,
    reward: 100,
    daysLeft: 4,
  };

  const healthTip = {
    title: "물 하루 8잔 마시기",
    description: "충분한 수분 섭취로 신진대사를 활발하게 하고 독소를 배출하세요.",
    icon: "💧",
  };

  const healthNews = [
    {
      id: "1",
      title: "겨울철 면역력 높이는 5가지 방법",
      summary: "비타민D와 아연 섭취의 중요성",
      source: "헬스조선",
      time: "2시간 전",
    },
    {
      id: "2",
      title: "요즘 인기 슈퍼푸드 TOP 3",
      summary: "아보카도, 퀴노아, 케일의 놀라운 효과",
      source: "라이프",
      time: "5시간 전",
    },
  ];

  // 영수증 업로드 관련 함수들
  const handleReceiptUpload = () => {
    setShowUploadModal(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        setUploadError(null);
      } else {
        setUploadError("이미지 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setUploadError("영수증 이미지를 선택해주세요.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setUploadError("로그인이 필요합니다.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);

      const result = await receiptService.uploadReceipt(userId, selectedFile);

      setUploadResult(result);
      setShowUploadModal(false);
      setShowResultModal(true);
    } catch (error: any) {
      console.error("영수증 업로드 실패:", error);
      if (error.response?.status === 400) {
        setUploadError(error.response.data.error || "잘못된 요청입니다.");
      } else if (error.response?.status === 500) {
        setUploadError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setUploadError("영수증 업로드에 실패했습니다.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setShowResultModal(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadError(null);
    setUploadResult(null);
  };

  // 현재 날짜 가져오기
  const getCurrentDateString = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayNames = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const dayName = dayNames[now.getDay()];

    return `${month}월 ${date}일 ${dayName}`;
  };

  // 사용자 이름 가져오기
  const getUserName = () => {
    return localStorage.getItem("userName") || "사용자";
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 pt-8 text-center">
        <p className="text-sm">{getUserName()}님, 안녕하세요</p>
        <p className="text-xs text-gray-500">{getCurrentDateString()}</p>
      </div>

      {/* 포인트 카드 */}
      <div className="p-4 mx-4 mb-4 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm">적립 포인트</p>
            <p className="text-3xl font-extrabold">{userPoints.toLocaleString()}P</p>
          </div>
          <button 
            onClick={fetchUserPoints}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 주간 캘린더 */}
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

      {/* 프리미엄 플랜 광고 - 블루 그라데이션 */}
      {showPremiumAd && (
        <div className="relative p-4 mx-4 mb-4 overflow-hidden text-white bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-700 rounded-2xl">
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
            className="absolute text-lg top-3 right-3 text-white/70 hover:text-white"
          >
            ✕
          </button>

          {/* 메인 컨텐츠 */}
          <div className="relative z-10">
            <div className="flex items-center mb-2">
              <Crown className="w-5 h-5 mr-2" />
              <span className="text-sm font-bold">프리미엄 플랜</span>
              <span className="bg-yellow-400 text-blue-800 px-2 py-0.5 rounded-full text-xs font-bold ml-2">
                HOT
              </span>
            </div>

            <h3 className="mb-2 text-lg font-bold">
              맞춤 건강 관리의 시작!
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
                <div className="text-xs line-through opacity-90">
                  월 14,900원
                </div>
                <div className="text-lg font-bold">
                  월 9,900원
                  <span className="text-xs ml-1 bg-red-500 px-2 py-0.5 rounded">
                    33% 할인
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.setItem('showPremiumPlan', 'true');
                  onTabChange("care");
                }}
                className="px-4 py-2 text-sm font-bold text-blue-600 transition-colors bg-white rounded-full hover:bg-blue-50"
              >
                7일 무료 체험
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 약사 상담 이미지 */}
      <div className="p-1 mx-4 mb-4 bg-sky-50 rounded-xl">
        <img
          src="/images/home_pharm_cunsulting.gif"
          alt="약사 건강 컨설팅"
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* 버튼 그리드 */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-6">
        {/* 영수증 인증하기 - 큰 왼쪽 버튼 */}
        <div className="relative col-span-1 row-span-2">
          <div
            className="relative w-full h-48 overflow-hidden transition-all duration-200 cursor-pointer bg-gradient-to-l from-blue-400 to-blue-600 rounded-xl hover:from-blue-500 hover:to-blue-700"
            onClick={handleReceiptUpload}
          >
            <div className="absolute top-4 right-4 opacity-20">
              <Receipt className="w-16 h-16 text-white/60" />
            </div>
            <div className="absolute text-lg font-bold text-white bottom-6 left-4">
              영수증<br/>인증하기
            </div>
          </div>
        </div>

        {/* 소비내역 - 오른쪽 상단 */}
        <div
          className="bg-green-400 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px] cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange("history")}
        >
          <div className="absolute top-2 right-2 opacity-30">
            <History className="w-8 h-8 text-white/60" />
          </div>
          <span className="absolute text-base font-bold text-white bottom-3 left-4">
            소비내역
          </span>
        </div>

        {/* 케어 - 오른쪽 하단 */}
        <div
          className="bg-sky-300 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px] cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange("care")}
        >
          <div className="absolute top-2 right-2 opacity-30">
            <Heart className="w-8 h-8 text-white/60" />
          </div>
          <span className="absolute text-base font-bold text-white bottom-3 left-4">
            케어
          </span>
        </div>
      </div>

      {/* 주간 챌린지 */}
      <div className="mx-4 mb-6">
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-black">🏆 주간 챌린지</h2>
            <span className="text-sm font-semibold text-blue-600">
              {weeklyChallenge.daysLeft}일 남음
            </span>
          </div>
          <h3 className="mb-2 font-semibold">{weeklyChallenge.title}</h3>
          <div className="flex items-center mb-3">
            <div className="flex-1 h-3 mr-3 bg-gray-200 rounded-full">
              <div
                className="h-3 transition-all duration-500 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                style={{
                  width: `${(weeklyChallenge.current / weeklyChallenge.total) * 100}%`,
                }}
              ></div>
            </div>
            <span className="text-sm font-semibold">
              {weeklyChallenge.current}/{weeklyChallenge.total}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              완료 시 <span className="font-bold text-green-600">{weeklyChallenge.reward}P</span> 적립
            </span>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg">
              도전 중
            </button>
          </div>
        </div>
      </div>

      {/* 오늘의 건강 팁 */}
      <div className="mx-4 mb-6">
        <div className="p-4 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-black">💡 오늘의 건강 팁</h2>
            <span className="text-2xl">{healthTip.icon}</span>
          </div>
          <h3 className="mb-2 font-semibold">{healthTip.title}</h3>
          <p className="mb-3 text-sm text-gray-600">{healthTip.description}</p>
          <button
            onClick={() => setCompletedTip(!completedTip)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              completedTip ? "bg-green-100 text-green-700" : "bg-blue-500 text-white"
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">
              {completedTip ? "실천 완료!" : "실천하기"}
            </span>
          </button>
        </div>
      </div>

      {/* 건강 뉴스 & 트렌드 */}
      <div className="mx-4 mb-6">
        <div className="mb-3">
          <h2 className="text-lg font-bold text-black">📰 건강 뉴스 & 트렌드</h2>
          <p className="text-sm text-gray-600">최신 건강 정보를 확인하세요</p>
        </div>
        <div className="space-y-3">
          {healthNews.map((news) => (
            <div key={news.id} className="p-4 bg-white shadow-sm rounded-xl">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 text-sm font-semibold">{news.title}</h3>
                  <p className="mb-2 text-xs text-gray-600">{news.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {news.source} • {news.time}
                    </span>
                    <button className="text-blue-500">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <TrendingUp className="flex-shrink-0 w-6 h-6 ml-3 text-green-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 영수증 업로드 모달 */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">영수증 업로드</h2>
              <button onClick={closeModal} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {!previewUrl ? (
              <div className="space-y-4">
                <div
                  className="p-8 text-center transition-colors border-2 border-gray-300 border-dashed cursor-pointer rounded-xl hover:border-blue-400"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="mb-2 text-gray-600">영수증 이미지를 업로드하세요</p>
                  <p className="text-sm text-gray-400">JPG, PNG 파일 지원</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center flex-1 py-3 space-x-2 text-white bg-blue-500 rounded-xl"
                  >
                    <Camera className="w-5 h-5" />
                    <span>사진 촬영</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center flex-1 py-3 space-x-2 text-white bg-gray-500 rounded-xl"
                  >
                    <Upload className="w-5 h-5" />
                    <span>갤러리</span>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-hidden border rounded-xl">
                  <img
                    src={previewUrl}
                    alt="영수증 미리보기"
                    className="object-cover w-full h-48"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="flex-1 py-3 text-white bg-gray-500 rounded-xl"
                  >
                    다시 선택
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    disabled={isUploading}
                    className="flex-1 py-3 text-white bg-blue-500 rounded-xl disabled:bg-gray-400"
                  >
                    {isUploading ? "업로드 중..." : "업로드"}
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="flex items-center px-4 py-3 mt-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
                <AlertCircle className="flex-shrink-0 w-4 h-4 mr-2" />
                {uploadError}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 로딩 모달 */}
      {isUploading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 text-center bg-white rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
            <h3 className="mb-2 text-lg font-bold">AI가 영수증을 분석 중입니다</h3>
            <p className="text-sm text-gray-600">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}

      {/* 결과 모달 */}
      {showResultModal && uploadResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-green-600">✅ 분석 완료!</h2>
              <button onClick={closeModal} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* 상점 정보 */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <h3 className="mb-2 font-bold">구매 정보</h3>
                <p className="text-sm">
                  <span className="font-semibold">상점:</span> {uploadResult.transaction.storeName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">총 금액:</span> {uploadResult.transaction.totalAmount.toLocaleString()}원
                </p>
                <p className="text-sm">
                  <span className="font-semibold">날짜:</span> {new Date(uploadResult.transaction.transactionDate).toLocaleDateString()}
                </p>
              </div>

              {/* 상품 목록 */}
              <div>
                <h3 className="mb-3 font-bold">구매 상품 ({uploadResult.transaction.items.length}개)</h3>
                <div className="space-y-3">
                  {uploadResult.transaction.items.map((item: any) => (
                    <div key={item.id} className="p-3 border rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-semibold">{item.itemName}</h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-bold">{item.healthyScore}점</span>
                        </div>
                      </div>
                      <p className="mb-2 text-xs text-gray-600">{item.commentByAI}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.quantity}개</span>
                        <span className="font-semibold">{item.price.toLocaleString()}원</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 건강 점수 요약 */}
              <div className="p-4 bg-green-50 rounded-xl">
                <h3 className="mb-3 font-bold text-green-700">건강 점수 요약</h3>
                <div className="mb-3 text-center">
                  <div className="mb-1 text-3xl font-bold text-green-600">
                    {Math.round((uploadResult.transaction.items.reduce((acc: number, item: any) => acc + item.healthyScore, 0) / uploadResult.transaction.items.length) * 20)}점
                  </div>
                  <div className="text-sm text-gray-600">평균 건강 점수</div>
                </div>

                <div className="mb-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 transition-all duration-500 rounded-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{
                        width: `${(uploadResult.transaction.items.reduce((acc: number, item: any) => acc + item.healthyScore, 0) / (uploadResult.transaction.items.length * 5)) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-bold text-green-600">
                      {uploadResult.transaction.items.filter((item: any) => item.healthyScore >= 4).length}개
                    </div>
                    <div className="text-gray-600">건강 상품</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-orange-600">
                      {uploadResult.transaction.items.filter((item: any) => item.healthyScore < 3).length}개
                    </div>
                    <div className="text-gray-600">주의 상품</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  closeModal();
                  onTabChange("history");
                }}
                className="w-full py-3 font-semibold text-white bg-blue-500 rounded-xl"
              >
                소비내역에서 확인하기
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomTab selected="home" onTabChange={onTabChange} />
    </div>
  );
}