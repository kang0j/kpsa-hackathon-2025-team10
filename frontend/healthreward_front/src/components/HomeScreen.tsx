export default function HomeScreen() {
  return (
    <div className="flex flex-col">
      <div className="p-4 text-center">
        <p className="text-sm">홍길동님, 안녕하세요</p>
        <p className="text-xs text-gray-500">12월 3일 금요일</p>
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

      <div className="grid grid-cols-2 gap-4 px-4 mb-20">
        <div className="bg-blue-400 text-white rounded-xl p-4 flex items-center justify-center text-lg font-bold min-h-[90px]">
          영수증 인증하기
        </div>
        <div className="bg-green-400 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px]">
          소비내역
        </div>
        <div className="bg-sky-300 rounded-xl p-4 flex items-center justify-center text-white font-semibold min-h-[90px]">
          케어
        </div>
        <div className="bg-gray-100 rounded-xl p-4 border flex items-center justify-center text-gray-500 font-semibold min-h-[90px]">
          + 추가 예정
        </div>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 flex justify-around max-w-sm py-2 mx-auto text-xs bg-white border-t">
        <div className="text-center">
          🏠
          <br />홈
        </div>
        <div className="text-center">
          📑
          <br />
          소비 내역
        </div>
        <div className="text-center">
          ❤️
          <br />
          케어
        </div>
        <div className="text-center">
          🛍️
          <br />
          스토어
        </div>
        <div className="text-center">
          👤
          <br />
          MY
        </div>
      </nav>
    </div>
  );
}
