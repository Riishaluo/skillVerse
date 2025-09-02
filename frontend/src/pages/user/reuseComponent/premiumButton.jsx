import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


import ReactDOM from "react-dom";

const PremiumModal = ({ isOpen, onClose, onConfirm, userEmail }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-[9999]">
      <div className="bg-white rounded-2xl max-w-md w-80 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
          <h2 className="text-lg font-bold">Upgrade to Premium 🚀</h2>
          <p className="mt-1 text-sm opacity-90">Unlock exclusive features</p>
        </div>

        {/* Body */}
        <div className="p-4 text-sm text-gray-700">
          <p className="mb-3">
            With Premium, you get access to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Unlimited skill connections</li>
            <li>Priority visibility in searches</li>
            <li>Exclusive premium-only features</li>
          </ul>
          {userEmail && (
            <p className="mt-3 text-xs text-gray-500">
              Logged in as: <span className="font-medium">{userEmail}</span>
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition"
          >
            Not Now
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};


const PremiumButton = ({ userEmail }) => {
    const [showModal, setShowModal] = useState(false);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBeforePurchase = () => {
        setShowModal((prev) => !prev);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePremiumPurchase = async () => {
        setShowModal(false);
        const res = await loadRazorpayScript();
        if (!res) {
            Swal.fire({ icon: "error", title: "Razorpay SDK failed to load" });
            return;
        }

        try {
            const orderRes = await axios.post(
                "http://localhost:9999/user/create-order",
                { amount: 129900 },
                { withCredentials: true }
            );
            const { amount, id: order_id, currency } = orderRes.data;
            const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY;

            const options = {
                key: RAZORPAY_KEY,
                amount,
                currency,
                name: "SkillVerse Premium",
                description: "Premium subscription",
                order_id,
                handler: async function (response) {
                    await axios.post("http://localhost:9999/user/verify", response, {
                        withCredentials: true,
                    });

                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful",
                        text: "You are now a Premium user!",
                    }).then(() => {
                        window.location.reload();
                    });


                },
                prefill: { email: userEmail },
                theme: { color: "#2563eb" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Payment Failed" });
        }
    };

    return (
        <div className="relative inline-block">
            <button
                onClick={handleBeforePurchase}
                className="ml-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg shadow-sm 
  hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
                Try Premium
            </button>


            <PremiumModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onConfirm={handlePremiumPurchase}
                userEmail={userEmail}
            />
        </div>
    );
};

export default PremiumButton;
