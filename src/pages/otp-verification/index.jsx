import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

export default function OTPVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Redirect to signup if no email is provided
    if (!email) {
      navigate("/signup");
      return;
    }

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);

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
      const response = await axios.post(`${BASE_URL}/verify-otp`, {
        email: email,
        otp: otpString,
      });

      if (response.data.success) {
        setSuccess(true);
        setError("");
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Email verified successfully! Please login.",
            },
          });
        }, 2000);
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
    setIsResending(true);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess(false);

    try {
      await axios.post(`${BASE_URL}/send-otp`, { email: email });
      setError("");
      // Show success message
      const successMsg = document.createElement("div");
      successMsg.className =
        "bg-green-100 text-green-700 text-sm rounded-lg p-3 mb-4";
      successMsg.textContent = "OTP resent successfully!";
      document.querySelector(".otp-container")?.prepend(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend OTP. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Don't render if no email (will redirect)
  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-800 flex justify-center items-center p-8">
      <div className="otp-container w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-center text-2xl font-bold text-violet-700 pb-6">
          Verify Your OTP
        </h2>
        <p className="text-center text-gray-600 text-sm mb-2">
          Enter the 6-digit code sent to
        </p>
        <p className="text-center text-violet-700 font-semibold text-sm mb-6">
          {email}
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
              Redirecting to login page...
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
              className="w-full mt-6 bg-violet-700 text-white font-bold text-base py-3 rounded-lg hover:bg-violet-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-600">
                Didn&apos;t receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isVerifying || isResending}
                  className="text-violet-700 font-bold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/signup")}
                className="text-gray-600 text-sm hover:text-violet-700 transition-colors"
              >
                ← Back to Signup
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
