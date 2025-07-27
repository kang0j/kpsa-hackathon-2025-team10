import { useMemo, useState, useEffect } from "react";
import { ShoppingCart, Crown, Gift } from "lucide-react";
import BottomTab from "./BottomTab";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  benefits: string[];
  isRecommended?: boolean;
  hasDiscount?: boolean;
  discountRate?: number;
  isPremiumOnly?: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

type Screen = 'store' | 'product' | 'cart' | 'checkout' | 'success';

export default function StoreScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('store');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderInfo, setOrderInfo] = useState({
    name: localStorage.getItem('userName') || 'userName',
    phone: '01000000000',
    address: '서울특별시 관악구 관악로 1',
    paymentMethod: 'card'
  });

  // 프리미엄 및 포인트 관련 상태
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [usePremiumCoupon, setUsePremiumCoupon] = useState(false);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  // API 기본 URL
  const API_BASE_URL = 'https://df779d93eb1b.ngrok-free.app';

  // 프리미엄 상태 및 포인트 조회
  useEffect(() => {
    const premiumStatus = localStorage.getItem('isPremiumUser');
    setIsPremiumUser(premiumStatus === 'true');
    
    if (currentScreen === 'checkout') {
      fetchUserPoints();
    }
  }, [currentScreen]);

  // 포인트 조회 함수
  const fetchUserPoints = async () => {
    const userId = localStorage.getItem('userId') || 'cmdkegz8m0001he9oo6ggnapj';
    
    try {
      setPointsLoading(true);
      const response = await fetch(`${API_BASE_URL}/points/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUserPoints(data.totalPoints);
    } catch (error) {
      console.error('포인트 조회 실패:', error);
      setUserPoints(0);
    } finally {
      setPointsLoading(false);
    }
  };

  // 포인트 교환 함수
  const exchangePoints = async () => {
    const userId = localStorage.getItem('userId') || 'cmdkegz8m0001he9oo6ggnapj';
    if (pointsToUse <= 0) return false;

    try {
      setExchangeLoading(true);
      const response = await fetch(`${API_BASE_URL}/rewards/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({
          userId: userId,
          points: pointsToUse
        })
      });

      if (response.ok) {
        return true;
      } else {
        throw new Error('포인트 교환 실패');
      }
    } catch (error) {
      console.error('포인트 교환 실패:', error);
      alert('포인트 사용에 실패했습니다. 다시 시도해주세요.');
      return false;
    } finally {
      setExchangeLoading(false);
    }
  };

  const products: Product[] = [
    {
      id: "1",
      name: "여에스더 비타민D 3000IU",
      brand: "여에스더",
      price: 24900,
      originalPrice: 32000,
      image: "/images/products/vitamin-d.png",
      category: "vitamin",
      rating: 4.8,
      reviewCount: 1247,
      benefits: ["면역력 강화", "뼈 건강", "칼슘 흡수"],
      isRecommended: true,
      hasDiscount: true,
      discountRate: 22,
      isPremiumOnly: false,
    },
    {
      id: "2",
      name: "프로메가 오메가3 듀얼",
      brand: "종근당",
      price: 45000,
      image: "/images/products/omega3.png",
      category: "omega",
      rating: 4.9,
      reviewCount: 892,
      benefits: ["심혈관 건강", "뇌 기능", "염증 완화"],
      isRecommended: true,
      isPremiumOnly: true,
    },
    {
      id: "3",
      name: "멀티비타민 미네랄 복합",
      brand: "네이처스웨이",
      price: 19900,
      originalPrice: 25000,
      image: "/images/products/multivitamin.png",
      category: "vitamin",
      rating: 4.6,
      reviewCount: 634,
      benefits: ["종합 영양", "에너지 증진", "피로 회복"],
      hasDiscount: true,
      discountRate: 20,
    },
    {
      id: "4",
      name: "100억 프로바이오틱스",
      brand: "CMG 건강연구소",
      price: 35000,
      image: "/images/products/probiotics.png",
      category: "probiotics",
      rating: 4.7,
      reviewCount: 445,
      benefits: ["장 건강", "소화 개선", "면역력"],
      isPremiumOnly: true,
    },
    {
      id: "5",
      name: "뉴트리디데이 단백질 파우더",
      brand: "뉴트리디데이",
      price: 42000,
      originalPrice: 48000,
      image: "/images/products/protein.png",
      category: "protein",
      rating: 4.5,
      reviewCount: 523,
      benefits: ["근육 성장", "운동 회복", "포만감"],
      hasDiscount: true,
      discountRate: 12,
    },
    {
      id: "6",
      name: "마그네슘 + 아연 복합",
      brand: "미네랄플러스",
      price: 18500,
      image: "/images/products/mineral.png",
      category: "mineral",
      rating: 4.4,
      reviewCount: 267,
      benefits: ["스트레스 완화", "수면 개선", "근육 이완"],
    },
  ];

  const categoryCounts = useMemo(() => {
    const counts: Record<
      "all" | "vitamin" | "protein" | "mineral" | "omega" | "probiotics",
      number
    > = {
      all: products.length,
      vitamin: 0,
      protein: 0,
      mineral: 0,
      omega: 0,
      probiotics: 0,
    };

    products.forEach((p) => {
      counts[p.category as keyof typeof counts] =
        (counts[p.category as keyof typeof counts] || 0) + 1;
    });

    return counts;
  }, [products]);

  const categories: Category[] = [
    { id: "all", name: "전체", icon: "🏪", count: categoryCounts["all"] || 0 },
    {
      id: "vitamin",
      name: "비타민",
      icon: "💊",
      count: categoryCounts["vitamin"] || 0,
    },
    {
      id: "protein",
      name: "단백질",
      icon: "💪",
      count: categoryCounts["protein"] || 0,
    },
    {
      id: "mineral",
      name: "미네랄",
      icon: "⚡",
      count: categoryCounts["mineral"] || 0,
    },
    {
      id: "omega",
      name: "오메가",
      icon: "🐟",
      count: categoryCounts["omega"] || 0,
    },
    {
      id: "probiotics",
      name: "유산균",
      icon: "🦠",
      count: categoryCounts["probiotics"] || 0,
    },
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedProducts = products.filter((p) => p.isRecommended);

  // 장바구니 관련 함수들
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // 할인 계산 함수들
  const getPremiumDiscount = () => {
    if (!isPremiumUser || !usePremiumCoupon) return 0;
    return Math.floor(getTotalPrice() * 0.2); // 20% 할인
  };

  const getPointsDiscount = () => {
    if (!usePoints) return 0;
    return Math.min(pointsToUse, getTotalPrice() - getPremiumDiscount());
  };

  const getFinalPrice = () => {
    const totalPrice = getTotalPrice();
    const shippingFee = totalPrice >= 50000 ? 0 : 3000;
    const premiumDiscount = getPremiumDiscount();
    const pointsDiscount = getPointsDiscount();
    
    return Math.max(0, totalPrice + shippingFee - premiumDiscount - pointsDiscount);
  };

  // 바로 구매
  const buyNow = (product: Product) => {
    setCart([{ product, quantity: 1 }]);
    setCurrentScreen('checkout');
  };

  // 주문 완료
  const completeOrder = async () => {
    // 포인트 사용 시 교환 API 호출
    if (usePoints && pointsToUse > 0) {
      const exchangeSuccess = await exchangePoints();
      if (!exchangeSuccess) {
        return; // 포인트 교환 실패 시 주문 중단
      }
    }

    // 실제로는 주문 API 호출
    setTimeout(() => {
      setCurrentScreen('success');
      setCart([]);
      // 사용된 쿠폰과 포인트 초기화
      setUsePremiumCoupon(false);
      setUsePoints(false);
      setPointsToUse(0);
    }, 1000);
  };

  // 주문 성공 화면
  if (currentScreen === 'success') {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
          <p className="text-gray-600 mb-6 text-center">
            건강한 선택을 해주셔서 감사합니다.<br/>
            배송은 2-3일 내에 시작됩니다.
          </p>
          <button
            onClick={() => {
              setCurrentScreen('store');
              setSelectedProduct(null);
            }}
            className="w-full max-w-sm py-4 bg-blue-600 text-white font-bold rounded-xl"
          >
            쇼핑 계속하기
          </button>
        </div>
        <BottomTab selected="store" onTabChange={onTabChange} />
      </div>
    );
  }

  // 결제 화면
  if (currentScreen === 'checkout') {
    const totalPrice = getTotalPrice();
    const shippingFee = totalPrice >= 50000 ? 0 : 3000;
    const premiumDiscount = getPremiumDiscount();
    const pointsDiscount = getPointsDiscount();
    const finalPrice = getFinalPrice();

    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setCurrentScreen('cart')}
            className="text-2xl"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">주문/결제</h1>
          <div></div>
        </div>

        <div className="flex-1 p-4 space-y-4">
          {/* 주문 상품 */}
          <div className="bg-white p-4 rounded-xl">
            <h2 className="font-bold mb-3">주문 상품</h2>
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center space-x-3 mb-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{item.product.name}</h3>
                  <p className="text-xs text-gray-500">{item.product.brand}</p>
                  <p className="text-sm">수량: {item.quantity}개</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₩{(item.product.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 프리미엄 쿠폰 */}
          {isPremiumUser && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Crown className="w-5 h-5 text-purple-600 mr-2" />
                  <h3 className="font-bold text-purple-800">프리미엄 전용 쿠폰</h3>
                </div>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  20% 할인
                </span>
              </div>
              <p className="text-sm text-purple-600 mb-3">
                프리미엄 회원님만을 위한 특별 할인 혜택입니다.
              </p>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePremiumCoupon}
                  onChange={(e) => setUsePremiumCoupon(e.target.checked)}
                  className="mr-3 w-4 h-4"
                />
                <span className="text-sm font-semibold">
                  20% 할인 쿠폰 사용 (-₩{Math.floor(totalPrice * 0.2).toLocaleString()})
                </span>
              </label>
            </div>
          )}

          {/* 포인트 사용 */}
          <div className="bg-white p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Gift className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-bold">포인트 사용</h3>
              </div>
              {pointsLoading ? (
                <div className="text-sm text-gray-500">로딩중...</div>
              ) : (
                <span className="text-sm text-blue-600 font-bold">
                  보유: {userPoints.toLocaleString()}P
                </span>
              )}
            </div>
            
            <label className="flex items-center cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={usePoints}
                onChange={(e) => {
                  setUsePoints(e.target.checked);
                  if (!e.target.checked) {
                    setPointsToUse(0);
                  }
                }}
                className="mr-3 w-4 h-4"
              />
              <span className="text-sm font-semibold">포인트 사용하기</span>
            </label>

            {usePoints && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="사용할 포인트"
                    value={pointsToUse || ''}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 0;
                      const maxPoints = Math.min(userPoints, totalPrice - premiumDiscount);
                      setPointsToUse(Math.min(value, maxPoints));
                    }}
                    className="flex-1 p-2 border rounded-lg text-sm"
                    max={Math.min(userPoints, totalPrice - premiumDiscount)}
                  />
                  <button
                    onClick={() => {
                      const maxPoints = Math.min(userPoints, totalPrice - premiumDiscount);
                      setPointsToUse(maxPoints);
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
                  >
                    전액사용
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  최대 {Math.min(userPoints, totalPrice - premiumDiscount).toLocaleString()}P까지 사용 가능
                </p>
                {pointsToUse > 0 && (
                  <p className="text-sm text-blue-600 font-semibold">
                    사용 포인트: -{pointsToUse.toLocaleString()}P
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 배송 정보 */}
          <div className="bg-white p-4 rounded-xl">
            <h2 className="font-bold mb-3">배송 정보</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="받는 분 성함"
                value={orderInfo.name}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-3 bg-gray-100 rounded-lg"
              />
              <input
                type="text"
                placeholder="연락처"
                value={orderInfo.phone}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 bg-gray-100 rounded-lg"
              />
              <textarea
                placeholder="배송 주소"
                value={orderInfo.address}
                onChange={(e) => setOrderInfo(prev => ({ ...prev, address: e.target.value }))}
                className="w-full p-3 bg-gray-100 rounded-lg h-20 resize-none"
              />
            </div>
          </div>

          {/* 결제 방법 */}
          <div className="bg-white p-4 rounded-xl">
            <h2 className="font-bold mb-3">결제 방법</h2>
            <div className="space-y-2">
              {[
                { id: 'card', name: '신용카드', icon: '' },
                { id: 'bank', name: '계좌이체', icon: '' },
                { id: 'kakao', name: '카카오페이', icon: '' }
              ].map(method => (
                <label key={method.id} className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={orderInfo.paymentMethod === method.id}
                    onChange={(e) => setOrderInfo(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="mr-2">{method.icon}</span>
                  <span>{method.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 결제 금액 */}
          <div className="bg-white p-4 rounded-xl">
            <h2 className="font-bold mb-3">결제 금액</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>상품 금액</span>
                <span>₩{totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>배송비</span>
                <span className={shippingFee === 0 ? 'text-green-600' : ''}>
                  {shippingFee === 0 ? '무료' : `₩${shippingFee.toLocaleString()}`}
                </span>
              </div>
              {premiumDiscount > 0 && (
                <div className="flex justify-between text-purple-600">
                  <span>프리미엄 쿠폰 할인</span>
                  <span>-₩{premiumDiscount.toLocaleString()}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>포인트 사용</span>
                  <span>-₩{pointsDiscount.toLocaleString()}</span>
                </div>
              )}
              {totalPrice < 50000 && (
                <p className="text-xs text-gray-500">5만원 이상 구매 시 무료배송</p>
              )}
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제 금액</span>
                <span className="text-blue-600">₩{finalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 결제 버튼 */}
        <div className="p-4 bg-white border-t">
          <button
            onClick={completeOrder}
            disabled={!orderInfo.name || !orderInfo.phone || !orderInfo.address || exchangeLoading}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl disabled:bg-gray-300"
          >
            {exchangeLoading ? '처리 중...' : `₩${finalPrice.toLocaleString()} 결제하기`}
          </button>
        </div>
      </div>
    );
  }

  // 장바구니 화면
  if (currentScreen === 'cart') {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 bg-white border-b">
          <button
            onClick={() => setCurrentScreen('store')}
            className="text-2xl"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">장바구니</h1>
          <div></div>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-gray-600 mb-6">건강한 상품을 담아보세요!</p>
            <button
              onClick={() => setCurrentScreen('store')}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl"
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4">
              <div className="bg-white rounded-xl p-4">
                {cart.map(item => (
                  <div key={item.product.id} className="flex items-center space-x-3 py-4 border-b last:border-b-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">{item.product.brand}</p>
                      <p className="font-bold text-blue-600">₩{item.product.price.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-2 text-red-500"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 결제 정보 */}
            <div className="p-4 bg-white border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">총 {getTotalItems()}개</span>
                <span className="text-xl font-bold text-blue-600">₩{getTotalPrice().toLocaleString()}</span>
              </div>
              <button
                onClick={() => setCurrentScreen('checkout')}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl"
              >
                주문하기
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // 상품 상세 화면
  if (currentScreen === 'product' && selectedProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* 상품 상세 헤더 */}
        <div className="relative flex items-center justify-center p-4 border-b">
          <button
            onClick={() => {
              setSelectedProduct(null);
              setCurrentScreen('store');
            }}
            className="absolute text-2xl left-4"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">상품 상세</h1>
          <div
            onClick={() => setCurrentScreen('cart')}
            className="absolute right-4 cursor-pointer relative"
          >

          </div>
        </div>

        {/* 상품 이미지 */}
        <div className="p-8 text-center bg-gray-50">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.name}
            className="object-cover w-64 h-64 mx-auto rounded-lg"
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 p-6">
          <div className="mb-4">
            {selectedProduct.isPremiumOnly && (
              <span className="inline-block px-3 py-1 mb-2 text-xs font-bold text-purple-700 bg-purple-100 rounded-full">
                👑 프리미엄 전용
              </span>
            )}
            {selectedProduct.isRecommended && (
              <span className="inline-block px-3 py-1 mb-2 ml-2 text-xs font-bold text-green-700 bg-green-100 rounded-full">
                🎯 추천
              </span>
            )}
          </div>

          <h2 className="mb-2 text-xl font-bold">{selectedProduct.name}</h2>
          <p className="mb-4 text-gray-600">{selectedProduct.brand}</p>

          <div className="flex items-center mb-4">
            <div className="flex mr-2 text-yellow-400">
              {"★".repeat(Math.floor(selectedProduct.rating))}
            </div>
            <span className="text-sm text-gray-600">
              {selectedProduct.rating} ({selectedProduct.reviewCount} 리뷰)
            </span>
          </div>

          <div className="mb-6">
            {selectedProduct.originalPrice && (
              <div className="flex items-center mb-1">
                <span className="mr-2 text-sm text-gray-400 line-through">
                  ₩{selectedProduct.originalPrice.toLocaleString()}
                </span>
                <span className="px-2 py-1 text-xs text-white bg-red-500 rounded">
                  {selectedProduct.discountRate}% 할인
                </span>
              </div>
            )}
            <div className="text-2xl font-bold text-blue-600">
              ₩{selectedProduct.price.toLocaleString()}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-3 font-bold">주요 효과</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="px-3 py-1 text-sm text-blue-700 rounded-full bg-blue-50"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 mb-6 rounded-lg bg-gray-50">
            <h3 className="mb-2 font-bold">💡 섭취 방법</h3>
            <p className="text-sm text-gray-700">
              하루 1회, 1정씩 충분한 물과 함께 섭취하세요. 식후 30분 이내 섭취
              시 흡수율이 높아집니다.
            </p>
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className="p-6 bg-white border-t">
          <div className="flex space-x-3">
            <button 
              onClick={() => {
                addToCart(selectedProduct);
                alert('장바구니에 추가되었습니다!');
              }}
              className="flex-1 py-4 font-bold text-gray-700 bg-gray-200 rounded-xl"
            >
              장바구니
            </button>
            <button 
              onClick={() => buyNow(selectedProduct)}
              className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-xl"
            >
              바로 구매
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 메인 스토어 화면
  return (
    <div className="flex flex-col min-h-screen pb-10 bg-gray-50">
      {/* 헤더 */}
      <div className="px-6 py-4 pt-8 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Re:fit 스토어</h1>
          <div
            onClick={() => setCurrentScreen('cart')}
            className="cursor-pointer relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </div>
        </div>

        {/* 검색바 */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="건강기능식품을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-10 text-sm bg-gray-100 rounded-xl"
          />
          <span className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2">
            🔍
          </span>
        </div>
      </div>

      {/* 카테고리 */}
      <div className="px-6 pb-4 bg-white">
        <div className="flex space-x-3 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <span className="ml-1 text-xs opacity-75">
                ({category.count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 추천 상품 섹션 */}
      {activeCategory === "all" && (
        <div className="bg-white shadow-sm rounded-xl">
          <div className="p-4 pb-2">
            <h2 className="mb-3 text-lg font-bold">🎯 맞춤 추천</h2>
            <p className="mb-4 text-sm text-gray-600">
              비타민D 부족 개선을 위한 추천 제품
            </p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex space-x-4 overflow-x-auto">
              {recommendedProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setCurrentScreen('product');
                  }}
                  className="flex-shrink-0 w-40 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-32 mb-2 rounded-lg"
                    />
                    {product.hasDiscount && (
                      <span className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-2 left-2">
                        {product.discountRate}%
                      </span>
                    )}
                    {product.isPremiumOnly && (
                      <span className="absolute text-lg top-2 right-2">👑</span>
                    )}
                  </div>
                  <h3 className="mb-1 text-sm font-semibold line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="mb-1 text-xs text-gray-500">{product.brand}</p>
                  <div className="flex items-center mb-1">
                    <span className="mr-1 text-xs text-yellow-400">★</span>
                    <span className="text-xs text-gray-600">
                      {product.rating}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-blue-600">
                    ₩{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="flex-1 ">
        <div className="mb-4 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between p-4 ">
            <h2 className="text-lg font-bold">
              {activeCategory === "all"
                ? "전체 상품"
                : categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredProducts.length}개 상품
            </span>
          </div>
          <div className="grid grid-cols-2 rounded-xl">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setCurrentScreen('product');
                }}
                className="p-4 transition-shadow bg-white shadow-sm cursor-pointer hover:shadow-md"
              >
                <div className="relative mb-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-full h-32 rounded-lg"
                  />
                  {product.hasDiscount && (
                    <span className="absolute px-2 py-1 text-xs font-bold text-white bg-red-500 rounded top-2 left-2">
                      {product.discountRate}%
                    </span>
                  )}
                  {product.isPremiumOnly && (
                    <span className="absolute text-lg top-2 right-2">👑</span>
                  )}
                  {product.isRecommended && (
                    <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded bottom-2 right-2">
                      추천
                    </span>
                  )}
                </div>

                <h3 className="h-8 mb-1 text-sm font-semibold line-clamp-2">
                  {product.name}
                </h3>
                <p className="mb-2 text-xs text-gray-500">{product.brand}</p>

                <div className="flex items-center mb-2">
                  <span className="mr-1 text-sm text-yellow-400">★</span>
                  <span className="text-xs text-gray-600">
                    {product.rating} ({product.reviewCount})
                  </span>
                </div>

                <div className="mb-2">
                  {product.originalPrice && (
                    <div className="text-xs text-gray-400 line-through">
                      ₩{product.originalPrice.toLocaleString()}
                    </div>
                  )}
                  <div className="font-bold text-blue-600">
                    ₩{product.price.toLocaleString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.benefits.slice(0, 2).map((benefit) => (
                    <span
                      key={benefit}
                      className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 탭 */}
      <BottomTab selected="store" onTabChange={onTabChange} />
    </div>
  );
}