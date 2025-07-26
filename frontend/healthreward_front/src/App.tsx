import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignUpForm";
import HomeScreen from "./components/HomeScreen";
import HistoryScreen from "./components/HistoryScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [selectedTab, setSelectedTab] = useState("home");

  return (
    <div className="max-w-sm min-h-screen mx-auto text-gray-900 bg-white shadow-md">
      {!isLoggedIn ? (
        isSignup ? (
          <SignupForm
            onLogin={() => setIsLoggedIn(true)}
            onSwitch={() => setIsSignup(false)}
          />
        ) : (
          <LoginForm
            onLogin={() => setIsLoggedIn(true)}
            onSwitch={() => setIsSignup(true)}
          />
        )
      ) : (
        <>
          {selectedTab === "home" ? (
            <HomeScreen onTabChange={setSelectedTab} />
          ) : selectedTab === "history" ? (
            <HistoryScreen onTabChange={setSelectedTab} />
          ) : (
            <HomeScreen onTabChange={setSelectedTab} />
          )}
        </>
      )}
    </div>
  );
}
