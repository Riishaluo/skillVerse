import React from "react";
import axios from "axios";
import Swal from "sweetalert2";


const PremiumButton = ({ userEmail }) => {
    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePremiumPurchase = async () => {
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
                console.log(amount)
                console.log(currency)
            const options = {
                key: RAZORPAY_KEY,
                amount: amount,
                currency: currency,
                name: "SkillVerse Premium",
                description: "Premium subscription",
                order_id: order_id,
                handler: async function (response) {
                    await axios.post(
                        "http://localhost:9999/user/verify",
                        response,
                        { withCredentials: true }
                    );

                    Swal.fire({
                        icon: "success",
                        title: "Payment Successful",
                        text: "You are now a Premium user!",
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
        <button
            onClick={handlePremiumPurchase}
            className="ml-3 px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold shadow-lg border border-blue-700 
hover:scale-105 hover:from-blue-600 hover:to-blue-700 duration-300 flex items-center gap-2 w-auto rounded-full
"
        >
            <span>Premium</span>
        </button>
    );
};



export default PremiumButton;
