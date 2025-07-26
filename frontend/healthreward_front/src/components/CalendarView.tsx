import { useState, useEffect } from "react";

type CalendarViewProps = {
  selectedDate: string;
  onDateChange: (date: string) => void;
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

  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(
    2,
    "0"
  )}-${String(selectedDay).padStart(2, "0")}`;

  useEffect(() => {
    onDateChange(selectedDateStr);
  }, [selectedDateStr]);

  // 오늘 날짜의 키
  const todayKey = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // 더미 데이터 (오늘 날짜에만 있음)
  const dummyData = {
    [todayKey]: [
      {
        title: "양상추",
        detail: "다이어트, 피부 건강, 눈 건강, 혈압 조절에 좋아요",
        point: "+5",
      },
      { title: "PT 등록", detail: "건강 관리에 좋아요", point: "+200" },
      { title: "양상추", detail: "효능 잠이 잘 올 수 있음.", point: "+5" },
    ],
  };

  const selectedKey = `${currentYear}-${currentMonth + 1}-${selectedDay}`;
  const data = dummyData[selectedKey];
  const isToday =
    currentYear === today.getFullYear() &&
    currentMonth === today.getMonth() &&
    selectedDay === today.getDate();

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentYear, currentMonth + offset, 1);
    setCurrentYear(newDate.getFullYear());
    setCurrentMonth(newDate.getMonth());
    setSelectedDay(1); // 기본 선택 날짜 초기화
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => handleMonthChange(-1)}>◀</button>
        <span className="font-semibold">
          {currentYear}년 {currentMonth + 1}월
        </span>
        <button onClick={() => handleMonthChange(1)}>▶</button>
      </div>

      <div className="grid grid-cols-7 text-sm text-center gap-y-2">
        {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
          <div key={i} className="font-medium text-gray-500">
            {d}
          </div>
        ))}
        {calendarDates.map((day, i) => (
          <div
            key={i}
            className={`h-10 w-10 mx-auto flex items-center justify-center rounded-full cursor-pointer
              ${
                day === null
                  ? ""
                  : day === selectedDay
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            onClick={() => {
              if (day !== null) setSelectedDay(day);
            }}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {isToday &&
          data &&
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
