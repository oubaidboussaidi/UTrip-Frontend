import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, Home } from "lucide-react";
import apiPayment from "../api/apiPayment";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState("loading"); // loading, success, error

    useEffect(() => {
        if (sessionId) {
            confirmPayment();
        } else {
            setStatus("error");
        }
    }, [sessionId]);

    const confirmPayment = async () => {
        try {
            await apiPayment.confirmPayment(sessionId);
            setStatus("success");
        } catch (error) {
            console.error("Payment confirmation failed", error);
            setStatus("error");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                {status === "loading" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <h2 className="text-xl font-semibold text-gray-900">Confirming your payment...</h2>
                        <p className="text-gray-500">Please wait while we finalize your booking.</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Payment Successful!</h2>
                        <p className="text-gray-500">
                            Your ticket has been booked successfully. A confirmation email has been sent to you.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Back to Home
                        </button>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
                        <p className="text-gray-500">
                            We couldn't confirm your payment. If you were charged, please contact support.
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors"
                        >
                            Back to Home
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
