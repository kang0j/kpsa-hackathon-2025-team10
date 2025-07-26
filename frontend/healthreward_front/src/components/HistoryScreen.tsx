import BottomTab from "./BottomTab";

export default function HistoryScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex flex-col max-h-screen pb-20 overflow-hidden">
      <div className="p-4 text-center">
        <h2 className="mb-2 text-lg font-bold">소비 내역</h2>
        <ul className="text-sm">
          <li className="py-2 border-b">✔️ 샐러드 - 8,000원</li>
          <li className="py-2 border-b">✔️ 병원 진료 - 15,000원</li>
          <li className="py-2 border-b">✔️ 건강보조제 - 12,000원</li>
        </ul>
      </div>
      <BottomTab selected="history" onTabChange={onTabChange} />
    </div>
  );
}
