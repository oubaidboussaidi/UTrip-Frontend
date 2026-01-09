import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import apiAuth from "../api/apiAuth";

const LoginModal = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const endpoint = isLogin ? "/login" : "/register";
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password
                };

            const { data } = await apiAuth.post(endpoint, payload);

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user || data));

            window.dispatchEvent(new Event("userChanged"));
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Authentication failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
                {/* Header/Banner */}
                <div className="bg-gradient-to-br from-blue-600 to-black p-8 text-center text-white">
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
                        <Compass size={32} className="text-white animate-pulse" />
                    </div>

                    <h2 className="text-3xl font-black tracking-tight">
                        {isLogin ? "Welcome Back" : "Join the Journey"}
                    </h2>
                    <p className="mt-2 text-sm text-blue-100/80">
                        {isLogin ? "Sign in to access your travel plans" : "Create an account to start exploring"}
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white p-8">
                    <AnimatePresence mode="wait">
                        <motion.form
                            key={isLogin ? "login" : "signup"}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >
                            {!isLogin && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">First Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="firstName"
                                                required
                                                className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Last Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                name="lastName"
                                                required
                                                className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="name@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-12 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-blue-500"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            required
                                            className="w-full rounded-xl border border-gray-100 bg-gray-50 py-3 pl-10 pr-4 text-sm font-medium outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            )}

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="rounded-lg bg-red-50 p-3 text-center text-xs font-bold text-red-500"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/50 active:scale-[0.98] disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    isLogin ? "Sign In" : "Create Account"
                                )}
                            </button>
                        </motion.form>
                    </AnimatePresence>

                    <div className="mt-8 text-center text-sm font-medium text-gray-400">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <button
                            onClick={toggleMode}
                            className="font-bold text-blue-600 hover:underline"
                        >
                            {isLogin ? "Sign up" : "Sign in"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;
