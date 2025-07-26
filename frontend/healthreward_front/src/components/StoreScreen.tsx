import { useState } from "react";
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

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export default function StoreScreen({
  onTabChange,
}: {
  onTabChange: (tab: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const categories: Category[] = [
    { id: 'all', name: '전체', icon: '🏪', count: 24 },
    { id: 'vitamin', name: '비타민', icon: '💊', count: 8 },
    { id: 'protein', name: '단백질', icon: '💪', count: 6 },
    { id: 'mineral', name: '미네랄', icon: '⚡', count: 5 },
    { id: 'omega', name: '오메가', icon: '🐟', count: 3 },
    { id: 'probiotics', name: '유산균', icon: '🦠', count: 2 }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: '프리미엄 비타민D 3000IU',
      brand: '헬시라이프',
      price: 24900,
      originalPrice: 32000,
      image: 'https://placehold.co/200x200',
      category: 'vitamin',
      rating: 4.8,
      reviewCount: 1247,
      benefits: ['면역력 강화', '뼈 건강', '칼슘 흡수'],
      isRecommended: true,
      hasDiscount: true,
      discountRate: 22,
      isPremiumOnly: false
    },
    {
      id: '2',
      name: '오메가3 EPA+DHA 고함량',
      brand: '바이오텍',
      price: 45000,
      image: 'https://placehold.co/200x200',
      category: 'omega',
      rating: 4.9,
      reviewCount: 892,
      benefits: ['심혈관 건강', '뇌 기능', '염증 완화'],
      isRecommended: true,
      isPremiumOnly: true
    },
    {
      id: '3',
      name: '멀티비타민 미네랄 복합',
      brand: '네이처스웨이',
      price: 19900,
      originalPrice: 25000,
      image: 'https://placehold.co/200x200',
      category: 'vitamin',
      rating: 4.6,
      reviewCount: 634,
      benefits: ['종합 영양', '에너지 증진', '피로 회복'],
      hasDiscount: true,
      discountRate: 20
    },
    {
      id: '4',
      name: '프로바이오틱스 100억',
      brand: '굿헬스',
      price: 35000,
      image: 'https://placehold.co/200x200',
      category: 'probiotics',
      rating: 4.7,
      reviewCount: 445,
      benefits: ['장 건강', '소화 개선', '면역력'],
      isPremiumOnly: true
    },
    {
      id: '5',
      name: '식물성 단백질 파우더',
      brand: '플랜트프로',
      price: 42000,
      originalPrice: 48000,
      image: 'https://placehold.co/200x200',
      category: 'protein',
      rating: 4.5,
      reviewCount: 523,
      benefits: ['근육 성장', '운동 회복', '포만감'],
      hasDiscount: true,
      discountRate: 12
    },
    {
      id: '6',
      name: '마그네슘 + 아연 복합',
      brand: '미네랄플러스',
      price: 18500,
      image: 'https://placehold.co/200x200',
      category: 'mineral',
      rating: 4.4,
      reviewCount: 267,
      benefits: ['스트레스 완화', '수면 개선', '근육 이완']
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const recommendedProducts = products.filter(p => p.isRecommended);

  if (selectedProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* 상품 상세 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setSelectedProduct(null)}
            className="text-2xl"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">상품 상세</h1>
          <button className="text-2xl">♡</button>
        </div>

        {/* 상품 이미지 */}
        <div className="bg-gray-50 p-8 text-center">
          <img 
            src={selectedProduct.image} 
            alt={selectedProduct.name}
            className="w-64 h-64 mx-auto object-cover rounded-lg"
          />
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 p-6">
          <div className="mb-4">
            {selectedProduct.isPremiumOnly && (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                👑 프리미엄 전용
              </span>
            )}
            {selectedProduct.isRecommended && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block ml-2">
                🎯 추천
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold mb-2">{selectedProduct.name}</h2>
          <p className="text-gray-600 mb-4">{selectedProduct.brand}</p>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {'★'.repeat(Math.floor(selectedProduct.rating))}
            </div>
            <span className="text-sm text-gray-600">
              {selectedProduct.rating} ({selectedProduct.reviewCount} 리뷰)
            </span>
          </div>

          <div className="mb-6">
            {selectedProduct.originalPrice && (
              <div className="flex items-center mb-1">
                <span className="text-gray-400 line-through text-sm mr-2">
                  ₩{selectedProduct.originalPrice.toLocaleString()}
                </span>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                  {selectedProduct.discountRate}% 할인
                </span>
              </div>
            )}
            <div className="text-2xl font-bold text-blue-600">
              ₩{selectedProduct.price.toLocaleString()}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3">주요 효과</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.benefits.map(benefit => (
                <span 
                  key={benefit}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-bold mb-2">💡 섭취 방법</h3>
            <p className="text-sm text-gray-700">
              하루 1회, 1정씩 충분한 물과 함께 섭취하세요. 
              식후 30분 이내 섭취 시 흡수율이 높아집니다.
            </p>
          </div>
        </div>

        {/* 구매 버튼 */}
        <div className="p-6 border-t bg-white">
          <div className="flex space-x-3">
            <button className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold">
              장바구니
            </button>
            <button className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-bold">
              바로 구매
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* 상단 상태바 */}
      <div className="bg-white flex justify-between items-center px-6 py-4">
        <div className="text-black text-lg font-semibold">9:41</div>
        <div className="flex items-center space-x-1">
          <div className="flex space-x-0.5">
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-black rounded-sm"></div>
            <div className="w-1 h-3 bg-gray-400 rounded-sm"></div>
          </div>
          <svg className="w-5 h-4" viewBox="0 0 20 16" fill="none">
            <path d="M2 6C2 4.89543 2.89543 4 4 4H16C17.1046 4 18 4.89543 18 6V10C18 11.1046 17.1046 12 16 12H4C2.89543 12 2 11.1046 2 10V6Z" fill="black"/>
            <path d="M18 8H20V8.5C20 9.32843 19.3284 10 18.5 10H18V8Z" fill="black"/>
          </svg>
        </div>
      </div>

      {/* 헤더 */}
      <div className="bg-white px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">건강 스토어</h1>
          <button className="text-2xl">🛒</button>
        </div>

        {/* 검색바 */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="건강기능식품을 검색해보세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 pr-10 text-sm"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      {/* 카테고리 */}
      <div className="bg-white px-6 pb-4">
        <div className="flex space-x-3 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex-shrink-0 flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
              <span className="ml-1 text-xs opacity-75">({category.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* 추천 상품 섹션 */}
      {activeCategory === 'all' && (
        <div className="bg-white mx-6 rounded-xl shadow-sm mb-4">
          <div className="p-4 pb-2">
            <h2 className="text-lg font-bold mb-3">🎯 맞춤 추천</h2>
            <p className="text-sm text-gray-600 mb-4">
              비타민D 부족 개선을 위한 추천 제품
            </p>
          </div>
          <div className="px-4 pb-4">
            <div className="flex space-x-4 overflow-x-auto">
              {recommendedProducts.map(product => (
                <div 
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="flex-shrink-0 w-40 cursor-pointer"
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                    {product.hasDiscount && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        {product.discountRate}%
                      </span>
                    )}
                    {product.isPremiumOnly && (
                      <span className="absolute top-2 right-2 text-lg">👑</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                  <div className="flex items-center mb-1">
                    <span className="text-yellow-400 text-xs mr-1">★</span>
                    <span className="text-xs text-gray-600">{product.rating}</span>
                  </div>
                  <div className="font-bold text-blue-600 text-sm">
                    ₩{product.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상품 목록 */}
      <div className="flex-1 px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">
            {activeCategory === 'all' ? '전체 상품' : categories.find(c => c.id === activeCategory)?.name}
          </h2>
          <span className="text-sm text-gray-500">
            {filteredProducts.length}개 상품
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="relative mb-3">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                {product.hasDiscount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    {product.discountRate}%
                  </span>
                )}
                {product.isPremiumOnly && (
                  <span className="absolute top-2 right-2 text-lg">👑</span>
                )}
                {product.isRecommended && (
                  <span className="absolute bottom-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    추천
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-8">{product.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{product.brand}</p>

              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-sm mr-1">★</span>
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
                {product.benefits.slice(0, 2).map(benefit => (
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

      {/* 하단 탭 */}
      <BottomTab selected="store" onTabChange={onTabChange} />
    </div>
  );
}