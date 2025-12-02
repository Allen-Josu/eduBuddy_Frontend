import { useState, useRef, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

export default function OTPVerification() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${BASE_URL}/api/verify-otp`, {
        
        otp: otpString,
      });

      if (response.data.success) {
        setSuccess(true);
        setError("");
      } else {
        setError(response.data.message || "Invalid OTP");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess(false);
    inputRefs.current[0]?.focus();

    try {
      // Add your resend OTP API call here
      await axios.post(`${BASE_URL}/api/resend-otp`);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-800 flex justify-center items-center p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-2xl font-bold text-violet-700 pb-6">
          Verify Your OTP
        </h2>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter the 6-digit code sent to your device
        </p>

        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-violet-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Verification Successful!
            </h3>
            <p className="text-gray-600 text-sm">
              Your OTP has been verified successfully.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 text-red-700 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <div className="flex gap-2 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-semibold bg-gray-50 border-2 border-violet-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                  disabled={isVerifying}
                />
              ))}
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifying || otp.join("").length !== 6}
              className="w-full mt-6 bg-violet-700 text-white font-bold text-base py-3 rounded-lg hover:bg-violet-800 transition-all duration-300 disabled:opacity-50"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-6 text-center text-sm">
              <p>
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isVerifying}
                  className="text-violet-700 font-bold hover:underline disabled:opacity-50"
                >
                  Resend
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
