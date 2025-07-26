import { useState, useEffect } from "react";
import { ShoppingBag, Star, AlertCircle, RefreshCw } from "lucide-react";
import BottomTab from "./BottomTab";
import CalendarView from "./CalendarView";
import { transactionService } from "../../api/services";
import type { Transaction, ReceiptItem } from "../../api/services";

export default function HistoryScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  // 실제 데이터가 있는 날짜로 초기값 설정
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 거래내역 조회
  const fetchTransactions = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("로그인이 필요합니다.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getUserTransactions(userId);
      setTransactions(data);
    } catch (err: any) {
      console.error("거래내역 조회 실패:", err);
      if (err.response?.status === 404) {
        setTransactions([]); // 404는 데이터가 없는 상태로 처리
        setError(null);
      } else {
        setError("거래내역을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchTransactions();
  }, []);

  // 선택된 날짜의 거래내역 필터링
  const getTransactionsForDate = (date: string) => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.transactionDate);
      const selectedDateObj = new Date(date);
      return transactionDate.toDateString() === selectedDateObj.toDateString();
    });
  };

  // 월별 거래내역 개수 계산 (캘린더용)
  const getTransactionDates = () => {
    const dates: string[] = [];
    transactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!dates.includes(dateStr)) {
        dates.push(dateStr);
      }
    });
    return dates;
  };

  // 날짜별 포인트 데이터 계산 (캘린더용)
  const getDatePointsData = () => {
    const datePoints: { [key: string]: number } = {};
    transactions.forEach((transaction) => {
      const date = new Date(transaction.transactionDate);
      const dateStr = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      
      const points = calculateHealthPoints(transaction.items);
      if (!datePoints[dateStr]) {
        datePoints[dateStr] = 0;
      }
      datePoints[dateStr] += points;
    });
    return datePoints;
  };

  // 거래 상세보기
  const handleTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // 건강 포인트 계산 (양수만 합산)
  const calculateHealthPoints = (items: ReceiptItem[]) => {
    return items.reduce((sum, item) => {
      return item.healthyScore > 0 ? sum + item.healthyScore : sum;
    }, 0);
  };

  // 건강 점수 계산 (평균)
  const calculateHealthScore = (items: ReceiptItem[]) => {
    if (items.length === 0) return 0;
    const totalScore = items.reduce((sum, item) => sum + item.healthyScore, 0);
    return Math.round(totalScore / items.length);
  };

  const selectedDateTransactions = getTransactionsForDate(selectedDate);
  const transactionDates = getTransactionDates();
  const datePointsData = getDatePointsData();

  // 선택된 날짜의 총 포인트 계산
  const dailyTotalPoints = selectedDateTransactions.reduce((sum, transaction) => {
    return sum + calculateHealthPoints(transaction.items);
  }, 0);

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 스크롤 영역 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex-1 text-lg font-bold text-center">소비 내역</h2>
          <button
            onClick={fetchTransactions}
            className="p-2 ml-2 text-blue-500 rounded-lg hover:bg-blue-50"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* 에러 상태 */}
        {error && (
          <div className="p-4 mb-4 border border-red-200 bg-red-50 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* 기존 캘린더 뷰에 실제 데이터 전달 */}
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          transactionDates={transactionDates}
          transactions={transactions}
          datePointsData={datePointsData}
        />

        {/* 로딩 상태 */}
        {loading && (
          <div className="py-8 text-center">
            <div className="w-8 h-8 mx-auto mb-3 border-2 border-blue-200 rounded-full border-t-blue-500 animate-spin"></div>
            <p className="text-gray-600">거래내역을 불러오는 중...</p>
          </div>
        )}

        {/* 선택된 날짜의 거래내역 */}
        {!loading && !error && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                {new Date(selectedDate).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}{" "}
                구매내역
              </h3>
              {selectedDateTransactions.length > 0 && (
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {selectedDateTransactions.length}건
                  </span>
                  <div className="text-sm font-semibold text-green-600">
                    일일 총 포인트: +{dailyTotalPoints}
                  </div>
                </div>
              )}
            </div>

            {selectedDateTransactions.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500">이 날에는 구매 기록이 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-5 transition-all duration-200 bg-white border border-gray-100 shadow-lg cursor-pointer rounded-2xl hover:shadow-xl"
                    onClick={() => handleTransactionDetail(transaction)}
                  >
                    {/* 상점 헤더 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-100 rounded-full">
                          <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold">
                            {transaction.storeName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(
                              transaction.transactionDate
                            ).toLocaleTimeString("ko-KR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 포인트와 금액 */}
                    <div className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-sm text-gray-600">
                            획득 포인트
                          </p>
                          <div className="flex items-center">
                            <Star className="w-6 h-6 mr-2 text-yellow-500" />
                            <span className="text-3xl font-bold text-green-600">
                              +{calculateHealthPoints(transaction.items)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="mb-1 text-xs text-gray-500">
                            구매금액
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.totalAmount.toLocaleString()}원
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 구매 상품 목록 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-800">
                          구매 상품
                        </h5>
                        <span className="text-sm text-gray-500">
                          {transaction.items.length}개 항목
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {transaction.items.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-50"
                          >
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-800">
                                {item.itemName}
                              </span>
                              <span className="ml-2 text-xs text-gray-500">
                                x{item.quantity}
                              </span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                <span className={`text-sm font-bold ${
                                  item.healthyScore > 0 ? 'text-green-600' : 
                                  item.healthyScore < 0 ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {item.healthyScore > 0 ? '+' : ''}{item.healthyScore}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {item.price.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        ))}

                        {transaction.items.length > 5 && (
                          <div className="py-2 text-center">
                            <span className="text-sm font-medium text-blue-600">
                              +{transaction.items.length - 5}개 상품 더 보기
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 건강점수 진행바 */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            이번 구매 건강도
                          </span>
                          <span className="text-sm text-gray-600">
                            {calculateHealthScore(transaction.items)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              calculateHealthScore(transaction.items) >= 70
                                ? "bg-green-500"
                                : calculateHealthScore(transaction.items) >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.max(0, calculateHealthScore(
                                transaction.items
                              ))}%`,
                            }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {calculateHealthScore(transaction.items) >= 70
                            ? "매우 건강한 구매입니다! 🌟"
                            : calculateHealthScore(transaction.items) >= 40
                            ? "보통 수준의 구매입니다 👍"
                            : "더 건강한 선택을 해보세요 💪"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 거래 상세 모달 */}
      {showDetailModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">구매 상세</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-2xl text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* 상점 정보 */}
            <div className="p-4 mb-4 bg-gray-50 rounded-xl">
              <h3 className="mb-2 font-bold">구매 정보</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-semibold">상점:</span>{" "}
                  {selectedTransaction.storeName}
                </p>
                <p>
                  <span className="font-semibold">총 금액:</span>{" "}
                  {selectedTransaction.totalAmount.toLocaleString()}원
                </p>
                <p>
                  <span className="font-semibold">획득 포인트:</span>{" "}
                  <span className="text-green-600 font-bold">
                    +{calculateHealthPoints(selectedTransaction.items)}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">날짜:</span>{" "}
                  {new Date(selectedTransaction.transactionDate).toLocaleString(
                    "ko-KR"
                  )}
                </p>
              </div>
            </div>

            {/* 상품 목록 */}
            <div>
              <h3 className="mb-3 font-bold">
                구매 상품 ({selectedTransaction.items.length}개)
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-60">
                {selectedTransaction.items.map((item) => (
                  <div key={item.id} className="p-3 border rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="flex-1 text-sm font-semibold">
                        {item.itemName}
                      </h4>
                      <div className="flex items-center ml-2 space-x-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className={`text-sm font-bold ${
                          item.healthyScore > 0 ? 'text-green-600' : 
                          item.healthyScore < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {item.healthyScore > 0 ? '+' : ''}{item.healthyScore}
                        </span>
                      </div>
                    </div>

                    {item.commentByAI && (
                      <p className="p-2 mb-2 text-xs text-gray-600 rounded bg-blue-50">
                        💬 {item.commentByAI}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span>수량: {item.quantity}개</span>
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold ${
                          item.healthyScore > 0 ? 'text-green-600' : 
                          item.healthyScore < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {item.healthyScore > 0 ? '+' : ''}{item.healthyScore}점
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.price.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 건강 포인트 요약 */}
            <div className="p-4 mt-4 bg-green-50 rounded-xl">
              <h3 className="mb-2 font-bold text-green-700">건강 포인트 요약</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">총 획득 포인트</span>
                <span className="text-lg font-bold text-green-700">
                  +{calculateHealthPoints(selectedTransaction.items)}
                </span>
              </div>
              <p className="text-xs text-green-600">
                {calculateHealthPoints(selectedTransaction.items) >= 10
                  ? "훌륭한 건강 포인트 획득! 👍"
                  : calculateHealthPoints(selectedTransaction.items) >= 5
                  ? "좋은 선택입니다! 🤔"
                  : "더 건강한 선택으로 포인트를 늘려보세요! 💪"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 하단 탭 고정 */}
      <BottomTab selected="history" onTabChange={onTabChange} />
    </div>
  );
}