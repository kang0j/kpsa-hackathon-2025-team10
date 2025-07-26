export default function BottomTab({
  selected,
  onTabChange,
}: {
  selected: string;
  onTabChange: (tab: string) => void;
}) {
  const base = "flex flex-col items-center justify-center text-xs w-full";
  const selectedClass = "text-blue-600 font-bold";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around max-w-sm py-2 mx-auto bg-white border-t">
      <button
        onClick={() => onTabChange("home")}
        className={`${base} ${
          selected === "home" ? selectedClass : "text-gray-500"
        }`}
      >
        🏠
        <br />홈
      </button>
      <button
        onClick={() => onTabChange("history")}
        className={`${base} ${
          selected === "history" ? selectedClass : "text-gray-500"
        }`}
      >
        📑
        <br />
        소비 내역
      </button>
      <button
        onClick={() => onTabChange("care")}
        className={`${base} ${
          selected === "care" ? selectedClass : "text-gray-500"
        }`}
      >
        ❤️
        <br />
        케어
      </button>
      <button
        onClick={() => onTabChange("store")}
        className={`${base} ${
          selected === "store" ? selectedClass : "text-gray-500"
        }`}
      >
        🛍️
        <br />
        스토어
      </button>
      <button
        onClick={() => onTabChange("my")}
        className={`${base} ${
          selected === "my" ? selectedClass : "text-gray-500"
        }`}
      >
        👤
        <br />
        MY
      </button>
    </nav>
  );
}
