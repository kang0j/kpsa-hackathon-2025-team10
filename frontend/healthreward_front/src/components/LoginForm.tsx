import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { authService } from "../../api/services";

export default function LoginForm({
  onLogin,
  onSwitch,
}: {
  onLogin: () => void;
  onSwitch: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      // 백엔드에 로그인 요청
      const response = await authService.login({
        email: email,
        password: password
      });

      console.log('로그인 성공:', response);
      
      // 사용자 ID와 이름을 로컬 스토리지에 저장
      localStorage.setItem('userId', response.user.id);
      localStorage.setItem('userName', response.user.name);
      
      // 로그인 성공 처리
      onLogin();
      
    } catch (err: any) {
      console.error('로그인 실패:', err);
      
      if (err.response?.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (err.response?.status === 400) {
        setError("입력 정보를 확인해주세요.");
      } else {
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      
      <div className="relative w-full max-w-md">
        {/* 메인 카드 */}
        <div className="rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* 헤더 그라데이션 */}
          <div className="bg-gradient-to-r from-sky-400 to-blue-600 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">다시 만나요!</h1>
            <p className="text-white/80 text-sm">건강한 하루를 시작해볼까요?</p>
          </div>

          {/* 폼 컨텐츠 */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-sky-600" />
                  이메일
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 text-sm"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-sky-600" />
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all duration-200 text-sm pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-600">{error}</span>
                </div>
              )}

              {/* 로그인 옵션 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500" 
                    disabled={isLoading}
                  />
                  <span className="text-gray-600">로그인 유지</span>
                </label>
                <button 
                  type="button" 
                  className="text-sky-600 hover:text-sky-700 transition-colors"
                  disabled={isLoading}
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-sky-400 to-blue-600 text-white hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>로그인 중...</span>
                  </div>
                ) : (
                  '로그인하기 🚀'
                )}
              </button>
            </form>

            {/* 회원가입 링크 */}
            <div className="text-center mt-8">
              <span className="text-gray-600 text-sm">아직 계정이 없으신가요? </span>
              <button 
                onClick={onSwitch} 
                className="text-sky-600 font-semibold text-sm hover:text-sky-700 transition-colors"
                disabled={isLoading}
              >
                회원가입하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}