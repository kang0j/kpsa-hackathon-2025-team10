import { useState } from "react";

export default function SignupForm({
  onLogin,
  onSwitch,
}: {
  onLogin: () => void;
  onSwitch: () => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="mb-4 text-2xl font-bold">회원가입</h1>
      <input
        type="email"
        placeholder="이메일"
        className="w-full max-w-sm px-4 py-2 mb-2 border rounded"
      />
      <div className="relative w-full max-w-sm mb-2">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호"
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
      <div className="relative w-full max-w-sm mb-4">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="비밀번호 확인"
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute text-sm text-gray-500 -translate-y-1/2 right-2 top-1/2"
        >
          {showConfirm ? "숨김" : "보기"}
        </button>
      </div>
      <button
        onClick={onLogin}
        className="w-full max-w-sm px-6 py-2 text-white bg-green-500 rounded"
      >
        가입하기
      </button>
      <button onClick={onSwitch} className="mt-4 text-sm text-green-600">
        이미 계정이 있으신가요? 로그인
      </button>
    </div>
  );
}
