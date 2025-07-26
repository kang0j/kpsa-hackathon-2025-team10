const App = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="bg-green-50 py-20 text-center px-6">
        <h1 className="text-4xl font-extrabold mb-4">
          🍀 건강한 소비, 똑똑한 리워드
        </h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          영수증과 카드 내역을 분석하여 건강한 소비 습관을 만들고, 나에게 맞는
          리워드와 약사 상담까지 제공하는 올인원 헬스 핀테크 플랫폼
        </p>
        <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded shadow hover:bg-green-700">
          시작하기
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 grid grid-cols-1 sm:grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-bold mb-2">📸 OCR 영수증 분석</h2>
          <p>
            사진 한 장으로 건강 소비 여부를 분석하고 포인트를 자동
            적립해드립니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">💳 카드 내역 연동</h2>
          <p>
            마이데이터 기반 카드 소비 내역을 자동으로 불러와 건강 항목을
            분석합니다.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">💊 약사 건강 상담</h2>
          <p>구매 내역을 바탕으로 약사와 직접 상담하며 건강 정보를 받으세요.</p>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">🎁 맞춤형 리워드 제공</h2>
          <p>
            건강한 소비에 대해 포인트를 지급하고, 개인별 맞춤형 리워드를
            추천합니다.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-100 py-16 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">
          당신의 건강한 소비를 시작해보세요
        </h2>
        <p className="mb-6">OCR 분석, 포인트 적립, 상담까지 한 번에!</p>
        <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded hover:bg-green-700">
          무료 체험하기
        </button>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-500 py-6">
        &copy; 2025 건강소비분석 플랫폼. 모든 권리 보유.
      </footer>
    </div>
  );
};
export default App;
