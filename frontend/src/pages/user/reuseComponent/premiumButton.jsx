import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


const PremiumModal = ({ isOpen, onClose, onConfirm, userEmail }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl max-w-md w-80 overflow-hidden shadow-xl z-50">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white">
                <h2 className="text-lg font-bold">Upgrade to Premium 🚀</h2>
                <p className="mt-1 text-sm opacity-90">Unlock exclusive features</p>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Chat Without Connect</h3>
                        <p className="text-xs text-gray-600">Message users instantly</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Premium Event Invitations</h3>
                        <p className="text-xs text-gray-600">Exclusive invites to events</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Premium Badge</h3>
                        <p className="text-xs text-gray-600">Showcase with profile badge</p>
                    </div>
                </div>

                <div className="bg-yellow-50 p-2 rounded-lg text-xs text-yellow-800 font-medium">
                    🎁 Special Offer: 20% OFF for first 100 users!
                </div>
            </div>

            <div className="bg-gray-50 px-4 py-2 flex justify-end space-x-2">
                <button
                    onClick={onClose}
                    className="px-3 py-1 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                >
                    Not Now
                </button>
                <button
                    onClick={onConfirm}
                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                >
                    Proceed
                </button>
            </div>
        </div>
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
                className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-lg border border-blue-700 
        hover:scale-105 hover:from-blue-600 hover:to-blue-700 duration-300 flex items-center gap-2 w-auto rounded-full"
            >
                <span>Premium</span>
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
