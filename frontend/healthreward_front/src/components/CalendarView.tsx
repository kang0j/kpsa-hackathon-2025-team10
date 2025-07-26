import { useState, useEffect } from "react";

type CalendarViewProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

type DummyItem = {
  title: string;
  detail: string;
  point: string;
};

const CalendarView = ({ onDateChange }: CalendarViewProps) => {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0~11
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDates: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];

  // 모든 날짜에 대한 dummy data
  const dummyData: Record<string, DummyItem[]> = {
    [`${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`]: [
      { title: "양상추", detail: "다이어트에 좋아요", point: "+5" },
      { title: "PT 등록", detail: "건강관리", point: "+200" },
    ],
    [`${today.getFullYear()}-${today.getMonth() + 1}-15`]: [
      { title: "비타민", detail: "면역력 향상", point: "+10" },
    ],
    [`${today.getFullYear()}-${today.getMonth() + 1}-20`]: [
      { title: "병원 진료", detail: "건강 점검", point: "+30" },
    ],
  };

  // 선택된 날짜 문자열 (YYYY-MM-DD)
  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(
    2,
    "0"
  )}-${String(selectedDay).padStart(2, "0")}`;

  const selectedKey = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
  const data = dummyData[selectedKey];

  useEffect(() => {
    onDateChange(selectedDateStr);
  }, [selectedDateStr]);

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentYear, currentMonth + offset, 1);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());
    setSelectedDay(1);
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };

  const getDayPoint = (day: number | null) => {
    if (day === null) return null;
    const key = `${currentYear}-${currentMonth + 1}-${day}`;
    const items = dummyData[key];
    if (!items) return null;
    const total = items.reduce((sum, item) => sum + parseInt(item.point), 0);
    return `+${total}`;
  };

  return (
    <div className="px-4 py-2">
      {/* 년/월 선택 */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => handleMonthChange(-1)}>◀</button>
        <span className="font-semibold">
          {currentYear}년 {currentMonth + 1}월
        </span>
        <button onClick={() => handleMonthChange(1)}>▶</button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 text-sm text-center gap-y-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={i} className="font-medium text-gray-500">
            {d}
          </div>
        ))}

        {/* 날짜 셀 */}
        {calendarDates.map((day, i) => {
          const point = getDayPoint(day);
          const isSelected = day === selectedDay;
          return (
            <div
              key={i}
              className="relative h-12"
              onClick={() => day && setSelectedDay(day)}
            >
              <div
                className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full cursor-pointer ${
                  isSelected
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100 text-gray-800"
                }`}
              >
                {day}
              </div>
              {point && (
                <div className="text-[10px] text-blue-500 absolute w-full text-center mt-[-2px]">
                  {point}
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
          className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-500 rounded-full"
        >
          오늘
        </button>
      </div>

      {/* 선택된 날짜 상세 */}
      <div className="mt-6 space-y-3">
        {data &&
          data.map((item, idx) => (
            <div key={idx} className="p-3 text-sm bg-gray-100 rounded-xl">
              <p className="flex justify-between font-semibold">
                <span>{item.title}</span>
                <span>{item.point}</span>
              </p>
              <p className="mt-1 text-sm text-gray-600">{item.detail}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CalendarView;
