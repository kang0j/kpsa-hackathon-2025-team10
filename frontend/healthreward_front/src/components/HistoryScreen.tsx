import { useState } from "react";
import BottomTab from "./BottomTab";
import CalendarView from "./CalendarView";

export default function HistoryScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 스크롤 영역 */}
      <div className="flex-1 p-4 overflow-y-auto text-center">
        <h2 className="mb-2 text-lg font-bold">소비 내역</h2>
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>

      {/* 하단 탭 고정 */}
      <BottomTab selected="history" onTabChange={onTabChange} />
    </div>
  );
}
