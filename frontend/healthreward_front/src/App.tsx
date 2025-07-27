import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import HomeScreen from "./components/HomeScreen";
import HistoryScreen from "./components/HistoryScreen";
import CareScreen from "./components/CareScreen";
import MyPageScreen from "./components/MyPageScreen";
import StoreScreen from "./components/StoreScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");

  // 로그인 상태 복원
  useEffect(() => {
    const stored = localStorage.getItem("isLoggedIn");
    if (stored === "true") setIsLoggedIn(true);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className="max-w-sm min-h-screen mx-auto text-gray-900 bg-white shadow-md no-scrollbar">
      {!isLoggedIn ? (
        isSignup ? (
          <SignupForm
            onLogin={handleLogin}
            onSwitch={() => setIsSignup(false)}
          />
        ) : (
          <LoginForm onLogin={handleLogin} onSwitch={() => setIsSignup(true)} />
        )
      ) : (
        <>
          {selectedTab === "home" ? (
            <HomeScreen onTabChange={setSelectedTab} />
          ) : selectedTab === "history" ? (
            <HistoryScreen onTabChange={setSelectedTab} />
          ) : selectedTab === "care" ? (
            <CareScreen onTabChange={setSelectedTab} />
          ) : selectedTab === "my" ? (
            <MyPageScreen onTabChange={setSelectedTab} />
          ) : selectedTab === "store" ? (
            <StoreScreen onTabChange={setSelectedTab} />
          ) : (
            <HomeScreen onTabChange={setSelectedTab} />
          )}
        </>
      )}
    </div>
  );
}
