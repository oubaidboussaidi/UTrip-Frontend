import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 pt-20 pb-10 px-5 md:px-20 border-t border-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            {/* Logo would go here */}
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                                <span className="text-white font-black text-xl">U</span>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">UTrip</h3>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Made with passion by:
                            <br />
                            <span className="font-bold text-gray-900">Boussaidi Oubaid Allah</span>
                            <br />
                            <span className="font-bold text-gray-900">Ben Hamad Yassine</span>
                            <br />
                            <span className="font-bold text-gray-900">Magouri Fares</span>
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg uppercase tracking-wider">Explore</h4>
                        <ul className="space-y-4">
                            {['Home', 'Events', 'About Us', 'For You'].map((item) => (
                                <li key={item}>
                                    <a href={item === 'Home' ? '/' : item === 'For You' ? '/recommendations' : item === 'About Us' ? '/about' : `/${item.toLowerCase().replace(' ', '')}`} className="text-gray-500 hover:text-black hover:translate-x-2 transition-all flex items-center gap-2 group text-sm font-medium">
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                <span className="text-gray-500 text-sm">Tunis, Rades</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-blue-600" />
                                <span className="text-gray-500 text-sm">oubaydboussaidi@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter / Contact Prompt */}
                    <div>
                        <h4 className="text-gray-900 font-bold mb-6 text-lg uppercase tracking-wider">Stay Inspired</h4>
                        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-transparent border-none focus:ring-0 text-sm px-4 w-full text-black"
                            />
                            <button className="bg-black text-white p-3 rounded-xl hover:scale-105 transition-transform">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed font-medium uppercase tracking-widest">
                            * Subscribe to get our weekly travel highlights & deals.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
                        © 2026 ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-8">
                        {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                            <a key={item} href="#" className="text-gray-400 hover:text-black text-xs font-bold uppercase tracking-widest transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
