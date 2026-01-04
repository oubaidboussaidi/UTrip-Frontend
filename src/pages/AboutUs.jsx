import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { Users, Target, Award, Globe, Heart, Shield } from "lucide-react";
import { getPublicStats } from "../api/apiStats";

const AboutUs = () => {
    const [stats, setStats] = useState({
        activeUsers: 0,
        uniqueLocations: 0,
        totalEvents: 0,
        rating: 4.9
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await getPublicStats();
            setStats(data);
        } catch (e) {
            console.error("Error fetching public stats", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <div className="relative pt-40 pb-20 px-5 md:px-20 overflow-hidden bg-gray-900 text-white">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1920"
                        alt="Adventure background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        Redefining Your <br />
                        <span className="text-blue-500">Adventure experience</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium leading-relaxed">
                        UTrip is more than just a booking platform. We are a community of explorers,
                        organizers, and dreamers dedicated to bringing the world's most unique experiences to your doorstep.
                    </p>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 px-5 md:px-20 -mt-12">
                <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-2xl p-10 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-8 border border-gray-100">
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                            {loading ? "..." : `${stats.activeUsers}+`}
                        </p>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Active Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                            {loading ? "..." : `${stats.uniqueLocations}+`}
                        </p>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Global Destinations</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                            {loading ? "..." : `${stats.totalEvents}+`}
                        </p>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Events Hosted</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                            {loading ? "..." : `${stats.totalFavorites}+`}
                        </p>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Community Favorites</p>
                    </div>
                </div>
            </div>

            {/* Our Values */}
            <div className="py-24 px-5 md:px-20 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-gray-900 mb-4">Core Values That Drive Us</h2>
                        <p className="text-gray-500 font-medium">Building a better way to explore the world together.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            {
                                icon: <Globe className="w-8 h-8 text-blue-500" />,
                                title: "Exploration",
                                desc: "We believe in the power of discovery and stepping out of your comfort zone."
                            },
                            {
                                icon: <Shield className="w-8 h-8 text-green-500" />,
                                title: "Trust & Security",
                                desc: "Your safety and security are our top priorities in every booking and adventure."
                            },
                            {
                                icon: <Heart className="w-8 h-8 text-red-500" />,
                                title: "Community First",
                                desc: "We build platforms that connect people and create lasting memories."
                            }
                        ].map((value, i) => (
                            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-2">
                                <div className="mb-6">{value.icon}</div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4">{value.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-32 px-5 md:px-20">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1">
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800"
                                alt="Mission"
                                className="rounded-[3rem] shadow-2xl relative z-10"
                            />
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600 rounded-[3rem] -z-0"></div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-8">
                        <div className="inline-block px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm tracking-widest uppercase">
                            Our Mission
                        </div>
                        <h2 className="text-5xl font-black text-gray-900 leading-tight">
                            To bring authenticity back to travel.
                        </h2>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium">
                            In a world of mass tourism, UTrip focuses on curated, local, and meaningful experiences.
                            We empower local organizers to share their passion and help travelers find hidden gems
                            that conventional platforms overlook.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Direct connection with local experts",
                                "Sustainable and respectful tourism",
                                "Seamless booking and secure payments",
                                "24/7 dedicated support team"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-900 font-bold">
                                    <Award className="text-amber-500" size={20} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer/Contact CTA */}
            <div className="py-20 px-5 md:px-20 bg-black text-white text-center">
                <div className="max-w-4xl mx-auto space-y-10">
                    <h2 className="text-4xl md:text-5xl font-black">Ready to start your journey?</h2>
                    <p className="text-gray-400 text-xl font-medium">
                        Join thousands of travelers who have already found their next adventure with UTrip.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => window.location.href = '/events'}
                            className="px-10 py-5 bg-white text-black rounded-2xl font-black hover:bg-gray-200 transition-all"
                        >
                            Browse Events
                        </button>
                        <button className="px-10 py-5 bg-gray-800 text-white rounded-2xl font-black hover:bg-gray-700 transition-all">
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
