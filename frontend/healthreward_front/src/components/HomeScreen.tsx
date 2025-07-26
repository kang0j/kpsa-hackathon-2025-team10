import React from 'react';
import { Receipt, History, Heart } from "lucide-react";
import BottomTab from "./BottomTab";

export default function HomeScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  // 현재 날짜 가져오기
  const getCurrentDateString = () => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const dayName = dayNames[now.getDay()];
    
    return `${month}월 ${date}일 ${dayName}`;
  };

  return (
    <div className="flex flex-col max-h-screen pb-20 overflow-hidden">
      <div className="p-4 text-center">
        <p className="text-sm">홍길동님, 안녕하세요</p>
        <p className="text-xs text-gray-500">{getCurrentDateString()}</p>
      </div>

      <div className="p-4 mx-4 mb-4 bg-gradient-to-r from-sky-200 to-blue-200 rounded-2xl">
        <p className="text-sm">적립 포인트</p>
        <p className="text-3xl font-extrabold">530(p.)</p>
      </div>

      <div className="flex justify-between px-6 mb-4 text-xs">
        {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
          <div key={i} className="flex flex-col items-center">
            <span>{d}</span>
            <span className="px-2 mt-1 text-xs bg-gray-200 rounded-full">
              {21 + i}
            </span>
          </div>
        ))}
      </div>

      <div className="py-6 mx-4 mb-4 text-sm text-center text-white bg-black rounded-xl">
        &lt;AD&gt;
      </div>

      <div className="flex items-center justify-between p-4 mx-4 mb-4 bg-sky-50 rounded-xl">
        <div>
          <p className="text-sm font-bold">💊 약사 건강 컨설팅</p>
          <p className="text-xs text-gray-600">&lt;약사 소개 한 줄&gt;</p>
        </div>
        <div className="text-xs text-gray-500">근처 500m</div>
      </div>

      {/* Updated Button Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 mb-20">
        {/* 영수증 인증하기 - Large Left Button */}
        <div className="col-span-1 row-span-2 relative">
          <div className="w-full h-48 bg-gradient-to-l from-blue-400 to-blue-600 rounded-xl cursor-pointer overflow-hidden relative">
            {/* Background Icon */}
            <div className="absolute top-4 right-4 opacity-20">
              <Receipt className="w-16 h-16 text-white/60" />
            </div>
            {/* Text */}
            <div className="absolute bottom-6 left-4 text-white text-lg font-bold">
              영수증<br/>인증하기
            </div>
          </div>
        </div>

        {/* 소비내역 - Top Right Button */}
        <div 
          className="bg-green-400 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px] cursor-pointer relative overflow-hidden"
          onClick={() => onTabChange("history")}
        >
          {/* Background Icon */}
          <div className="absolute top-2 right-2 opacity-30">
            <History className="w-8 h-8 text-white/60" />
          </div>
          {/* Text */}
          <span className="absolute bottom-3 left-4 text-white text-base font-bold">소비내역</span>
        </div>

        {/* 케어 - Bottom Right Button */}
        <div className="bg-sky-300 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px] cursor-pointer relative overflow-hidden">
          {/* Background Icon */}
          <div className="absolute top-2 right-2 opacity-30">
            <Heart className="w-8 h-8 text-white/60" />
          </div>
          {/* Text */}
          <span className="absolute bottom-3 left-4 text-white text-base font-bold">케어</span>
        </div>
      </div>

      <BottomTab selected="home" onTabChange={onTabChange} />
    </div>
  );
}