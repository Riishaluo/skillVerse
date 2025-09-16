import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  console.log(email)
  const flow = location.state?.flow || "signup";

  useEffect(() => {
    if (!email) return navigate("/signup");

    const storedExpiry = localStorage.getItem("otpCooldownExpiry");

    if (storedExpiry) {
      const remaining = Math.floor((Number(storedExpiry) - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
        return;
      }
    }

    const expiry = Date.now() + 30 * 1000;
    localStorage.setItem("otpCooldownExpiry", expiry);
    setCooldown(30);
  }, [email, navigate]);


  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem("otpCooldownExpiry");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  const startCooldown = (expiryFromServer) => {
    const expiry = new Date(expiryFromServer).getTime();
    localStorage.setItem("otpCooldownExpiry", expiry);
    setCooldown(Math.floor((expiry - Date.now()) / 1000));
  };


  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const otpString = otp.join("");

      let endpoint =
        flow === "forgotPassword"
          ? "http://localhost:9999/user/verify-forgot-otp"
          : "http://localhost:9999/user/verify-otp";

      const { data } = await axios.post(endpoint, { email, otp: otpString });

      if (data.success) {
        if (flow === "forgotPassword") {
          navigate("/reset-password", { state: { email } });
        } else {
          navigate("/skills-offered", { state: { email } });
        }
      } else {
        setMessage(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Invalid OTP or server error");
    } finally {
      setLoading(false);
    }
  }


  const handleResendOtp = async () => {
    try {
      setMessage("");
      let endpoint =
        flow === "forgotPassword"
          ? "http://localhost:9999/user/resend-forgot-otp"
          : "http://localhost:9999/user/resend-otp";

      const response = await axios.post(endpoint, { email });
      setMessage(response.data.message);

      const newExpiry = Date.now() + 30 * 1000;
      startCooldown(newExpiry);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP.");
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 mb-2">
          SkillVerse
        </h1>

        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          OTP Verification
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter the OTP sent to{" "}
          <span className="font-semibold text-indigo-600">{email}</span>
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg border-indigo-300 focus:outline-none focus:border-indigo-500"
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || otp.includes("")}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4 text-center">
          {cooldown > 0 ? (
            <p className="text-gray-500">
              Resend OTP in{" "}
              <span
                className={
                  cooldown <= 5 ? "text-red-500 font-bold" : "text-indigo-600"
                }
              >
                {cooldown}s
              </span>
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>

        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default OtpVerification;
