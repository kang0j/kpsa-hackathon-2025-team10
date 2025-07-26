import { useState } from "react";

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

  const handleLogin = () => {
    if (email === "test@example.com" && password === "123456") {
      onLogin();
    } else {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="mb-4 text-2xl font-bold">로그인</h1>
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-sm px-4 py-2 mb-2 border rounded"
      />
      <div className="relative w-full max-w-sm mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute text-sm text-gray-500 -translate-y-1/2 right-2 top-1/2"
        >
          {showPassword ? "숨김" : "보기"}
        </button>
      </div>
      {error && <p className="mb-2 text-sm text-red-500">{error}</p>}
      <button
        onClick={handleLogin}
        className="w-full max-w-sm px-6 py-2 text-white bg-blue-500 rounded"
      >
        로그인
      </button>
      <button onClick={onSwitch} className="mt-4 text-sm text-blue-600">
        계정이 없으신가요? 회원가입
      </button>
    </div>
  );
}
