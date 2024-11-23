import { useState, useCallback, useEffect, useRef } from "react";
import { FiEye, FiEyeOff, FiCopy, FiMoon, FiSun } from "react-icons/fi";
import { Switch } from "@headlessui/react";
import Header from "./component/Header";
import QRCodeGenerator from "./component/QRCodeGenerator";

function App() {
  // State variables
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [characterAllowed, setCharAllowed] = useState(false);
  const [uppercaseAllowed, setUppercaseAllowed] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordHistory, setPasswordHistory] = useState([]);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [customInputPosition, setCustomInputPosition] = useState("start");
  const passwordRef = useRef(null);

  // Password generation hook
  const usePasswordGenerator = useCallback(() => {
    let pass = "";
    let str = "abcdefghijklmnopqrstuvwxyz";

    if (uppercaseAllowed) str += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (numberAllowed) str += "0123456789";
    if (characterAllowed) str += "!@#$%^&*()+={}~`";
    if (excludeSimilar) str = str.replace(/[O0Il1]/g, "");

    for (let i = 0; i < length; i++) {
      const char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    // Insert custom input if provided
    if (customInput) {
      const insertionIndex = {
        start: 0,
        end: pass.length,
        random: Math.floor(Math.random() * (length - customInput.length)),
      }[customInputPosition];

      pass =
        pass.slice(0, insertionIndex) +
        customInput +
        pass.slice(insertionIndex);
    }

    return pass;
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
    customInput,
    customInputPosition,
  ]);

  // Calculate password strength
  const calculateStrength = useCallback(
    (pass) => {
      if (
        pass.length >= 16 &&
        numberAllowed &&
        characterAllowed &&
        uppercaseAllowed
      ) {
        return "Strong";
      } else if (pass.length >= 12) {
        return "Moderate";
      }
      return "Weak";
    },
    [numberAllowed, characterAllowed, uppercaseAllowed]
  );

  // Copy password to clipboard
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // Generate password on state change
  useEffect(() => {
    const newPassword = usePasswordGenerator();
    setPassword(newPassword);
    setPasswordHistory((prev) => [newPassword, ...prev.slice(0, 4)]);
    setTimeRemaining(30);
  }, [
    length,
    numberAllowed,
    characterAllowed,
    uppercaseAllowed,
    excludeSimilar,
    usePasswordGenerator,
  ]);

  // Countdown timer for password reset
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(
        () => setTimeRemaining((prev) => prev - 1),
        1000
      );
      return () => clearInterval(timer);
    } else {
      const newPassword = usePasswordGenerator();
      setPassword(newPassword);
      setTimeRemaining(30);
    }
  }, [timeRemaining, usePasswordGenerator]);

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Handle password history usage
  const handleUsePassword = (pass) => {
    setPassword(pass);
    alert(`Password "${pass}" has been selected!`);
  };

  // Define color styles based on dark mode
  const bgColor = darkMode ? "bg-gray-900" : "bg-white";
  const textColor = darkMode ? "text-white" : "text-gray-900";
  const borderColor = darkMode ? "border-gray-600" : "border-gray-300";
  const inputBgColor = darkMode ? "bg-gray-700" : "bg-gray-100";
  const buttonBgColor = darkMode ? "bg-gray-800" : "bg-gray-200";
  const buttonHoverColor = darkMode ? "bg-gray-700" : "bg-gray-300";
  const passwordInputTextColor = darkMode ? "text-gray-300" : "text-gray-600";
  const switchBgColor = darkMode ? "bg-blue-600" : "bg-gray-300";

  return (
    <div
      className={`min-h-screen flex flex-col ${bgColor} ${textColor} transition-all`}
    >
      {/* <Header /> */}

      <main className="container flex-grow max-w-4xl p-6 mx-auto ">
        <section className={`p-8 shadow-lg rounded-xl ${bgColor} ${textColor}`}>
          {/* Form Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
              Password Generator
            </h1>
            <Switch
              checked={darkMode}
              onChange={toggleDarkMode}
              className={`relative inline-flex items-center h-6 w-12 rounded-full ${
                darkMode ? "bg-blue-600" : "bg-gray-400"
              }`}
            >
              <span
                className={`${
                  darkMode ? "translate-x-6" : "translate-x-1"
                } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
              />
            </Switch>
          </div>

          <div className="relative">
            <label className="block mb-2 text-lg font-semibold">
              Generated Password:
            </label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                ref={passwordRef}
                readOnly
                className={`w-full px-3 py-2 transition ${inputBgColor} ${borderColor} rounded-lg focus:ring-2 focus:ring-blue-500`}
              />
              <button
                onClick={copyPasswordToClipboard}
                className={`absolute p-2 right-12 ${passwordInputTextColor} hover:text-white`}
                title="Copy"
              >
                <FiCopy size={18} />
              </button>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute p-2 right-4 ${passwordInputTextColor} hover:text-white`}
                title={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {copied && (
              <p className="mt-2 text-sm text-green-500">
                Copied to clipboard!
              </p>
            )}
          </div>

          {/* Custom Input */}
          <div className="mb-8">
            <label className="block mb-2 text-lg font-semibold">
              Custom Text (optional):
            </label>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add custom text"
              className={`w-full px-3 py-2 mb-4 transition ${inputBgColor} ${borderColor} rounded-lg focus:ring-2 focus:ring-blue-500`}
            />
            <label className="block mt-4 text-lg font-semibold">
              Position:
            </label>
            <select
              value={customInputPosition}
              onChange={(e) => setCustomInputPosition(e.target.value)}
              className={`w-full px-3 py-2 mt-2 transition ${inputBgColor} ${borderColor} rounded-lg focus:ring-2 focus:ring-blue-500`}
            >
              <option value="start">Start</option>
              <option value="end">End</option>
              <option value="random">Random</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block mb-2 text-lg font-semibold">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {[
              {
                label: "Include Numbers",
                value: numberAllowed,
                setValue: setNumberAllowed,
              },
              {
                label: "Include Uppercase",
                value: uppercaseAllowed,
                setValue: setUppercaseAllowed,
              },
              {
                label: "Include Special Characters",
                value: characterAllowed,
                setValue: setCharAllowed,
              },
              {
                label: "Exclude Similar Characters",
                value: excludeSimilar,
                setValue: setExcludeSimilar,
              },
            ].map((option, idx) => (
              <div key={idx} className="flex items-center">
                <label className="mr-2 text-lg font-semibold">
                  {option.label}
                </label>
                <Switch
                  checked={option.value}
                  onChange={option.setValue}
                  className={`relative inline-flex items-center h-6 rounded-full w-12 transition ${
                    option.value ? switchBgColor : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`${
                      option.value ? "translate-x-6" : "translate-x-1"
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
              </div>
            ))}
          </div>

          {/* Password Strength */}
          <div className="mb-8">
            <span className="text-lg font-semibold">Password Strength: </span>
            <span
              className={`text-lg font-bold ${
                calculateStrength(password) === "Strong"
                  ? "text-green-500"
                  : calculateStrength(password) === "Moderate"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {calculateStrength(password)}
            </span>
          </div>

          {/* Password History */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-semibold">Password History:</h2>
            <ul className="space-y-2">
              {passwordHistory.map((pass, idx) => (
                <li
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg transition ${inputBgColor} ${textColor}`}
                >
                  <span className="truncate">{pass}</span>
                  <button
                    onClick={() => handleUsePassword(pass)}
                    className={`px-2 py-1 text-sm rounded-lg transition ${buttonBgColor} ${textColor} hover:${buttonHoverColor}`}
                  >
                    Use
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <QRCodeGenerator password={password} darkMode={darkMode} />
        </section>
      </main>
    </div>
  );
}

export default App;
