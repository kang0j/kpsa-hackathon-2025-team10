import { Home, FileText, Heart, ShoppingBag, User } from "lucide-react";

interface BottomTabProps {
  selected: string;
  onTabChange: (tab: string) => void;
}

export default function BottomTab({
  selected,
  onTabChange,
}: BottomTabProps) {
  const base = "flex flex-col items-center justify-center text-xs w-full";
  const selectedClass = "text-blue-600 font-bold";

  const tabs = [
    { id: "home", icon: Home, label: "홈" },
    { id: "history", icon: FileText, label: "소비 내역" },
    { id: "care", icon: Heart, label: "케어" },
    { id: "store", icon: ShoppingBag, label: "스토어" },
    { id: "my", icon: User, label: "MY" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around max-w-sm py-2 mx-auto bg-white border-t">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${base} ${
              selected === tab.id ? selectedClass : "text-gray-500"
            }`}
          >
            <IconComponent size={20} className="mb-1" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}