import { useState, useEffect } from "react";

type CalendarViewProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
  transactionDates?: string[]; // 거래가 있는 날짜들 ['2023-04-26', ...]
  transactions?: any[]; // 전체 거래 데이터
  datePointsData?: { [key: string]: number }; // 날짜별 포인트 데이터
};

const CalendarView = ({ 
  selectedDate, 
  onDateChange, 
  transactionDates = [], 
  transactions = [],
  datePointsData = {}
}: CalendarViewProps) => {
  // selectedDate를 파싱해서 초기값 설정
  const parseSelectedDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate()
    };
  };

  const { year: initYear, month: initMonth, day: initDay } = parseSelectedDate(selectedDate);
  
  const [currentYear, setCurrentYear] = useState(initYear);
  const [currentMonth, setCurrentMonth] = useState(initMonth); // 0~11
  const [selectedDay, setSelectedDay] = useState(initDay);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDates: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];

  // 선택된 날짜 문자열 (YYYY-MM-DD)
  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(
    2,
    "0"
  )}-${String(selectedDay).padStart(2, "0")}`;

  // 상위 컴포넌트에 날짜 변경 알림
  useEffect(() => {
    onDateChange(selectedDateStr);
  }, [selectedDateStr, onDateChange]);

  // selectedDate prop이 변경되면 캘린더 상태 업데이트
  useEffect(() => {
    const { year, month, day } = parseSelectedDate(selectedDate);
    setCurrentYear(year);
    setCurrentMonth(month);
    setSelectedDay(day);
  }, [selectedDate]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentYear, currentMonth + offset, 1);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());
    setSelectedDay(1);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  // 건강 포인트 계산 (양수만 합산)
  const calculateHealthPoints = (items: any[]) => {
    return items.reduce((sum, item) => {
      return item.healthyScore > 0 ? sum + item.healthyScore : sum;
    }, 0);
  };

  // 특정 날짜에 거래가 있는지 확인
  const hasTransactionOnDate = (day: number | null) => {
    if (day === null) return false;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return transactionDates.includes(dateStr);
  };

  // 특정 날짜의 거래 개수와 총 포인트 계산
  const getDateInfo = (day: number | null) => {
    if (day === null) return null;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    const dayTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      const transactionDateStr = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}-${String(transactionDate.getDate()).padStart(2, "0")}`;
      return transactionDateStr === dateStr;
    });

    if (dayTransactions.length === 0) return null;

    const totalPoints = dayTransactions.reduce((sum, t) => sum + calculateHealthPoints(t.items), 0);
    const count = dayTransactions.length;

    return { count, totalPoints };
  };

  // 선택된 날짜의 거래 정보
  const getSelectedDateTransactions = () => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.transactionDate);
      const transactionDateStr = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}-${String(transactionDate.getDate()).padStart(2, "0")}`;
      return transactionDateStr === selectedDateStr;
    });
  };

  const selectedDateTransactions = getSelectedDateTransactions();

  return (
    <div className="px-4 py-2">
      {/* 년/월 선택 */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => handleMonthChange(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ◀
        </button>
        <span className="font-bold text-lg">
          {currentYear}년 {currentMonth + 1}월
        </span>
        <button 
          onClick={() => handleMonthChange(1)}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          ▶
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-sm text-center gap-y-2 mb-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={i} className="font-medium text-gray-500 py-2">
            {d}
          </div>
        ))}

        {/* 날짜 셀 */}
        {calendarDates.map((day, i) => {
          const dateInfo = getDateInfo(day);
          const isSelected = day === selectedDay;
          const hasTransaction = hasTransactionOnDate(day);
          
          return (
            <div
              key={i}
              className="relative h-16 flex flex-col items-center"
              onClick={() => day && setSelectedDay(day)}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-500 text-white shadow-lg"
                    : hasTransaction
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                {day}
              </div>
              
              {/* 거래 정보 표시 - 포인트 중심 */}
              {dateInfo && (
                <div className="text-[10px] text-center mt-1">
                  <div className="text-green-600 font-bold">
                    +{dateInfo.totalPoints}
                  </div>
                  <div className="text-gray-400 text-[8px]">
                    {dateInfo.count}건
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 오늘 버튼 */}
      <div className="mt-4 text-center">
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-500 rounded-full hover:bg-blue-50 transition-colors"
        >
          오늘
        </button>
      </div>

      {/* 선택된 날짜 요약 정보 - 포인트 중심 */}
      {selectedDateTransactions.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-3">
            {currentMonth + 1}월 {selectedDay}일 구매 요약
          </h4>
          <div className="space-y-2">
            {selectedDateTransactions.map((transaction, idx) => (
              <div key={idx} className="p-3 text-sm bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-800">{transaction.storeName}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {transaction.items.length}개 상품 • {" "}
                      {new Date(transaction.transactionDate).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-lg">
                      +{calculateHealthPoints(transaction.items)}점
                    </p>
                    <p className="text-xs text-gray-400">
                      {transaction.totalAmount.toLocaleString()}원
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 일일 총계 - 포인트 중심 */}
            {selectedDateTransactions.length > 1 && (
              <div className="p-3 bg-green-100 rounded-xl border-t-2 border-green-500">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">일일 누적 포인트</span>
                  <div className="text-right">
                    <p className="font-bold text-green-600 text-xl">
                      +{selectedDateTransactions.reduce((sum, t) => sum + calculateHealthPoints(t.items), 0)}점
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedDateTransactions.length}건의 구매
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 선택된 날짜에 데이터가 없을 때 */}
      {selectedDateTransactions.length === 0 && (
        <div className="mt-6 text-center py-4">
          <p className="text-gray-500 text-sm">
            {currentMonth + 1}월 {selectedDay}일에는 구매 기록이 없습니다.
          </p>
        </div>
      )}
    </div>
  );
};

export default CalendarView;