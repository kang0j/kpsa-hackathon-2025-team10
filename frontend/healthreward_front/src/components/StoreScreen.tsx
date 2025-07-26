import { useMemo, useState } from "react";
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
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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

  if (selectedProduct) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* 상품 상세 헤더 */}
        <div className="relative flex items-center justify-center p-4 border-b">
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute text-2xl left-4"
          >
            ←
          </button>
          <h1 className="text-lg font-bold">상품 상세</h1>
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
            <button className="flex-1 py-4 font-bold text-gray-700 bg-gray-200 rounded-xl">
              장바구니
            </button>
            <button className="flex-1 py-4 font-bold text-white bg-blue-600 rounded-xl">
              바로 구매
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-gray-50">
      {/* 헤더 */}
      <div className="px-6 py-4 pt-8 bg-white">
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
                  onClick={() => setSelectedProduct(product)}
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
                onClick={() => setSelectedProduct(product)}
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
