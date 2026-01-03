import React from 'react';
import { Apple, PlayCircle, Smartphone, Download } from 'lucide-react';

const AppDownload = () => {
    return (
        <section className="bg-white py-20 px-5 md:px-20 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-8 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full font-bold text-sm tracking-wide uppercase">
                        <Smartphone className="w-4 h-4" />
                        Seamless Experience
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                        The World is in the <br />
                        <span className="text-blue-600">Palm of Your Hand</span>
                    </h2>

                    <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
                        Download our mobile app to discover exclusive events, track your bookings, and explore breathtaking destinations anywhere, anytime. Your next adventure is just a tap away.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <a href="/app-debug.apk" download className="flex items-center gap-3 bg-black text-white px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-black/10">
                            <PlayCircle className="w-6 h-6 text-white" />
                            <div className="text-left">
                                <p className="text-[10px] uppercase font-bold text-gray-400">Download APK</p>
                                <p className="text-lg font-bold">Direct Install</p>
                            </div>
                        </a>
                    </div>

                    <div className="flex items-center gap-8 pt-6">
                        <div className="text-center">
                            <p className="text-3xl font-black text-gray-900">8.79 MB</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">APK Size</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100" />
                        <div className="text-center">
                            <p className="text-3xl font-black text-gray-900">v1.0.0 (Beta)</p>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Version</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative order-1 md:order-2">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 rounded-full blur-[100px] -z-10 opacity-60" />
                    <div className="relative hover:scale-105 transition-transform duration-700 cursor-pointer">
                        <img
                            src="/utrip_app_mockup.png"
                            alt="UTrip Mobile App"
                            className="w-full max-w-[450px] mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] rounded-[40px]"
                        />
                        {/* Floating badges */}
                        <div className="absolute top-10 -right-4 bg-white p-4 rounded-2xl shadow-2xl animate-bounce duration-[3000ms]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Download className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900">New Version</p>
                                    <p className="text-[10px] text-gray-400">(beta version) Available Now</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AppDownload;
