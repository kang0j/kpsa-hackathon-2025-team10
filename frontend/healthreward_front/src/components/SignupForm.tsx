import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Shield } from "lucide-react";
import { authService } from "../../api/services";

export default function SignupForm({
  onSwitch,
}: {
  onLogin: () => void;
  onSwitch: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!formData.name.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }

    if (!formData.email || !formData.password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 백엔드에 회원가입 요청
      const newUser = await authService.signup({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
      });

      console.log("회원가입 성공:", newUser);
      alert("회원가입이 완료되었습니다! 로그인해주세요.");

      // 회원가입 성공 후 로그인 페이지로 이동
      onSwitch();
    } catch (err: any) {
      console.error("회원가입 실패:", err);

      if (err.response?.status === 400) {
        setError(err.response.data.message || "입력 정보를 확인해주세요.");
      } else if (err.response?.status === 409) {
        setError("이미 존재하는 이메일입니다.");
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="relative w-full max-w-md">
        {/* 메인 카드 */}
        <div className="overflow-hidden border shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl border-white/20">
          {/* 헤더 그라데이션 */}
          <div className="p-8 text-center bg-gradient-to-r from-sky-400 to-blue-600">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-white/20">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">Re:fit</h1>
            <p className="text-sm text-white/80">새로운 건강 여정을 함께해요</p>
          </div>

          {/* 폼 컨텐츠 */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 에러 메시지 */}
              {error && (
                <div className="px-4 py-3 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">
                  {error}
                </div>
              )}

              {/* 이름 입력 */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-sky-600" />
                  이름
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="홍길동"
                    className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* 이메일 입력 */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-sky-600" />
                  이메일
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 text-sm transition-all duration-200 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4 mr-2 text-sky-600" />
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="안전한 비밀번호를 입력하세요"
                    className="w-full px-4 py-3 pr-12 text-sm transition-all duration-200 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  8자 이상, 영문·숫자·특수문자 포함
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Shield className="w-4 h-4 mr-2 text-sky-600" />
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="비밀번호를 다시 입력하세요"
                    className="w-full px-4 py-3 pr-12 text-sm transition-all duration-200 border border-gray-200 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 약관 동의 */}
              <div className="space-y-3">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 border-gray-300 rounded text-sky-600 focus:ring-sky-500"
                    required
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-600">
                    <span className="font-medium text-sky-600">이용약관</span>{" "}
                    및{" "}
                    <span className="font-medium text-sky-600">
                      개인정보처리방침
                    </span>
                    에 동의합니다.
                  </span>
                </label>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 border-gray-300 rounded text-sky-600 focus:ring-sky-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-600">
                    건강 정보 및 혜택 알림을 받겠습니다. (선택)
                  </span>
                </label>
              </div>

              {/* 가입하기 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-sky-400 to-blue-600 text-white hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                }`}
              >
                {loading ? "가입 중..." : "건강 여정 시작하기 🚀"}
              </button>
            </form>

            {/* 로그인 링크 */}
            <div className="mt-8 text-center">
              <span className="text-sm text-gray-600">
                이미 계정이 있으신가요?{" "}
              </span>
              <button
                onClick={onSwitch}
                className="text-sm font-semibold transition-colors text-sky-600 hover:text-sky-700"
                disabled={loading}
              >
                로그인하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
