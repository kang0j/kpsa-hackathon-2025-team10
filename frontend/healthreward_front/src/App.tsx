import { useState } from "react";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignUpForm";
import HomeScreen from "./components/HomeScreen";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

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
        <HomeScreen />
      )}
    </div>
  );
}
