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
  const [selectedDate, setSelectedDate] = useState<string>("2023-04-26");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 거래내역 조회
  const fetchTransactions = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await transactionService.getUserTransactions(userId);
      setTransactions(data);
    } catch (err: any) {
      console.error('거래내역 조회 실패:', err);
      if (err.response?.status === 404) {
        setTransactions([]); // 404는 데이터가 없는 상태로 처리
        setError(null);
      } else {
        setError('거래내역을 불러오는데 실패했습니다.');
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
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      const selectedDateObj = new Date(date);
      return transactionDate.toDateString() === selectedDateObj.toDateString();
    });
  };

  // 월별 거래내역 개수 계산 (캘린더용)
  const getTransactionDates = () => {
    const dates: string[] = [];
    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate);
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (!dates.includes(dateStr)) {
        dates.push(dateStr);
      }
    });
    return dates;
  };

  // 거래 상세보기
  const handleTransactionDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailModal(true);
  };

  // 건강 점수 계산
  const calculateHealthScore = (items: ReceiptItem[]) => {
    if (items.length === 0) return 0;
    const totalScore = items.reduce((sum, item) => sum + item.healthyScore, 0);
    return Math.round(totalScore / items.length);
  };

  // 상태별 색상
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'VERIFIED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedDateTransactions = getTransactionsForDate(selectedDate);
  const transactionDates = getTransactionDates();

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 스크롤 영역 */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-center flex-1">소비 내역</h2>
          <button 
            onClick={fetchTransactions}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg ml-2"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
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
        />

        {/* 로딩 상태 */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600">거래내역을 불러오는 중...</p>
          </div>
        )}

        {/* 선택된 날짜의 거래내역 */}
        {!loading && !error && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">
                {new Date(selectedDate).toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short'
                })} 구매내역
              </h3>
              {selectedDateTransactions.length > 0 && (
                <span className="text-sm text-gray-500">
                  {selectedDateTransactions.length}건
                </span>
              )}
            </div>

            {selectedDateTransactions.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">이 날에는 구매 기록이 없습니다.</p>
                <p className="text-sm text-gray-400 mt-1">2023년 4월 26일에 데이터가 있습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer hover:shadow-xl transition-all duration-200 border border-gray-100"
                    onClick={() => handleTransactionDetail(transaction)}
                  >
                    {/* 상점 헤더 */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <ShoppingBag className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{transaction.storeName}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.transactionDate).toLocaleTimeString('ko-KR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'PENDING' ? '검증대기' : 
                           transaction.status === 'VERIFIED' ? '검증완료' : '거부됨'}
                        </span>
                      </div>
                    </div>

                    {/* 금액과 건강점수 */}
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">총 구매금액</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {transaction.totalAmount.toLocaleString()}원
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">건강점수</p>
                          <div className="flex items-center">
                            <Star className="w-5 h-5 text-yellow-500 mr-1" />
                            <span className="text-xl font-bold text-green-600">
                              {calculateHealthScore(transaction.items)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 구매 상품 목록 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-gray-800">구매 상품</h5>
                        <span className="text-sm text-gray-500">{transaction.items.length}개 항목</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 mb-3">
                        {transaction.items.slice(0, 5).map((item) => (
                          <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-800">{item.itemName}</span>
                              <span className="text-xs text-gray-500 ml-2">x{item.quantity}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-yellow-500 mr-1" />
                                <span className="text-xs font-medium">{item.healthyScore}</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-700">
                                {item.price.toLocaleString()}원
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {transaction.items.length > 5 && (
                          <div className="text-center py-2">
                            <span className="text-sm text-blue-600 font-medium">
                              +{transaction.items.length - 5}개 상품 더 보기
                            </span>
                          </div>
                        )}
                      </div>

                      {/* 건강점수 진행바 */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">이번 구매 건강도</span>
                          <span className="text-sm text-gray-600">{calculateHealthScore(transaction.items)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              calculateHealthScore(transaction.items) >= 70 ? 'bg-green-500' :
                              calculateHealthScore(transaction.items) >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${calculateHealthScore(transaction.items)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {calculateHealthScore(transaction.items) >= 70 ? '매우 건강한 구매입니다! 🌟' :
                           calculateHealthScore(transaction.items) >= 40 ? '보통 수준의 구매입니다 👍' :
                           '더 건강한 선택을 해보세요 💪'}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">구매 상세</h2>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* 상점 정보 */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h3 className="font-bold mb-2">구매 정보</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold">상점:</span> {selectedTransaction.storeName}</p>
                <p><span className="font-semibold">총 금액:</span> {selectedTransaction.totalAmount.toLocaleString()}원</p>
                <p><span className="font-semibold">날짜:</span> {new Date(selectedTransaction.transactionDate).toLocaleString('ko-KR')}</p>
                <p>
                  <span className="font-semibold">상태:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status === 'PENDING' ? '검증 대기' : 
                     selectedTransaction.status === 'VERIFIED' ? '검증 완료' : '거부됨'}
                  </span>
                </p>
              </div>
            </div>

            {/* 상품 목록 */}
            <div>
              <h3 className="font-bold mb-3">구매 상품 ({selectedTransaction.items.length}개)</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedTransaction.items.map((item) => (
                  <div key={item.id} className="border rounded-xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm flex-1">{item.itemName}</h4>
                      <div className="flex items-center space-x-1 ml-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-bold">{item.healthyScore}</span>
                      </div>
                    </div>
                    
                    {item.commentByAI && (
                      <p className="text-xs text-gray-600 mb-2 bg-blue-50 p-2 rounded">
                        💬 {item.commentByAI}
                      </p>
                    )}
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>수량: {item.quantity}개</span>
                      <span className="font-semibold">{item.price.toLocaleString()}원</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 건강 점수 요약 */}
            <div className="bg-green-50 rounded-xl p-4 mt-4">
              <h3 className="font-bold mb-2 text-green-700">건강 점수 요약</h3>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${calculateHealthScore(selectedTransaction.items)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {calculateHealthScore(selectedTransaction.items)}/100점
                </span>
              </div>
              <p className="text-xs text-green-600 mt-2">
                {calculateHealthScore(selectedTransaction.items) >= 70 ? '건강한 선택입니다! 👍' :
                 calculateHealthScore(selectedTransaction.items) >= 40 ? '보통 수준입니다. 🤔' :
                 '더 건강한 선택을 고려해보세요. 💪'}
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