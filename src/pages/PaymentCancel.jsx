import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, Home } from "lucide-react";

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Cancelled</h2>
                    <p className="text-gray-500">
                        You have cancelled the payment process. No charges were made.
                    </p>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full py-3 px-6 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                    >
                        <Home className="w-5 h-5" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
