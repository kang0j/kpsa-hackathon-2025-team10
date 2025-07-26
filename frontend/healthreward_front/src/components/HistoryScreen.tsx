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

  const dummyData: Record<
    string,
    { title: string; desc: string; point: number }[]
  > = {
    [todayStr]: [
      { title: "샐러드", desc: "건강한 한 끼 식사", point: 8000 },
      { title: "병원 진료", desc: "정기 건강 검진", point: 15000 },
      { title: "건강보조제", desc: "영양제 구입", point: 12000 },
    ],
  };

  return (
    <div className="flex flex-col max-h-screen pb-20 overflow-hidden">
      <div className="p-4 text-center">
        <h2 className="mb-2 text-lg font-bold">소비 내역</h2>
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
        <div className="mt-4 space-y-2">
          {(dummyData[selectedDate] || []).map((item, i) => (
            <div
              key={i}
              className="flex justify-between p-4 text-sm text-left bg-gray-50 rounded-xl"
            >
              <div>
                <p className="mb-1 font-semibold">{item.title}</p>
                <p className="text-xs text-gray-600">{item.desc}</p>
              </div>
              <p className="text-sm font-semibold text-right">
                -{item.point.toLocaleString()}원
              </p>
            </div>
          ))}
        </div>
      </div>
      <BottomTab selected="history" onTabChange={onTabChange} />
    </div>
  );
}
