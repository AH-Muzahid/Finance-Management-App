import React, { useState } from 'react';
import { Link } from 'react-router';
import {
    FaLightbulb, FaBullseye, FaCheck, FaChartLine, FaWallet, FaShieldAlt,
    FaUserFriends, FaQuoteLeft, FaChevronDown, FaArrowRight, FaEnvelope, FaLock,
    FaUserPlus, FaListUl
} from 'react-icons/fa';

const Home = () => {
    // --- FAQ State ---
    const [openFaq, setOpenFaq] = useState(null);
    const faqs = [
        { q: "Is FinEase completely free?", a: "Yes, currently FinEase is free to use for all individual users." },
        { q: "Is my data secure?", a: "Absolutely. We use industry-standard encryption to protect your financial data." },
        { q: "Can I export my data?", a: "Yes, you can export your transaction history to CSV at any time." },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-base-100 font-sans text-slate-800 dark:text-slate-100 selection:bg-orange-100 selection:text-orange-600">

            {/* 1. STATIC HERO SECTION */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900">
                {/* Premium Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black z-0"></div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-md text-orange-400 text-xs md:text-sm font-semibold tracking-wide uppercase animate-fade-in-up">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        #1 Personal Finance Solution
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 md:mb-8 leading-tight animate-fade-in-up delay-100">
                        Master Your Money <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">With Clarity</span>
                    </h1>

                    <p className="text-base sm:text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 font-light leading-relaxed animate-fade-in-up delay-200">
                        Track expenses, set budgets, and achieve your financial goals with an intuitive dashboard designed for modern life.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300 px-4 sm:px-0">
                        <Link
                            to="/dashboard/add-transaction"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all transform hover:scale-105 shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Get Started Free <FaArrowRight />
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-8 py-3 md:py-4 rounded-xl font-semibold text-white/90 hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center backdrop-blur-sm w-full sm:w-auto"
                        >
                            Live Demo
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden md:block">
                    <FaChevronDown className="text-white/30 text-2xl" />
                </div>
            </section>

            {/* 2. STATS SECTION (Floating Overlap) */}
            <div className="relative z-20 -mt-10 md:-mt-16 px-4 md:px-6">
                <div className="max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 md:p-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 md:divide-x dark:divide-slate-700">
                        {[
                            { label: "Active Users", value: "15,000+", icon: FaUserFriends },
                            { label: "Transactions", value: "$50M+", icon: FaChartLine },
                            { label: "App Rating", value: "4.9/5", icon: FaBullseye },
                            { label: "Security", value: "256-bit", icon: FaLock }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center group md:px-4">
                                <div className="flex justify-center mb-2 md:mb-3">
                                    <stat.icon className="text-2xl md:text-3xl text-orange-500 opacity-80 group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. KEY FEATURES GRID */}
            <section className="py-20 md:py-32 bg-slate-50 dark:bg-base-200 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <span className="text-orange-500 font-bold tracking-wider uppercase text-xs md:text-sm bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full mb-6 inline-block animate-fade-in-up">
                            Why Choose FinEase
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight animate-fade-in-up delay-100">
                            Powerful Features for <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Modern Finance</span>
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                            We provide the tools you need to take full control of your financial life, securely and effortlessly.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: FaChartLine, title: "Smart Analytics", desc: "Gain deep insights with interactive graphs that visualize your spending habits instantly." },
                            { icon: FaWallet, title: "Budget Control", desc: "Set smart limits on categories and get real-time notifications to stay on track." },
                            { icon: FaShieldAlt, title: "Bank-Grade Security", desc: "Your data is protected with 256-bit encryption and never shared with third parties." },
                            { icon: FaBullseye, title: "Goal Tracking", desc: "Define your financial dreams and watch your progress with dedicated milestones." },
                            { icon: FaUserFriends, title: "Family Sync", desc: "Shared wallets allow your family to track household expenses in one place." },
                            { icon: FaLightbulb, title: "Smart Trends", desc: "AI-powered analysis helps you identify where you can save more money." }
                        ].map((feature, idx) => (
                            <div key={idx} className="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-bl-[60px] -mr-6 -mt-6 transition-transform group-hover:scale-150 duration-500"></div>

                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white mb-4 shadow-md shadow-orange-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                    <feature.icon className="text-xl" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-20 md:py-32 bg-white dark:bg-base-100 relative overflow-hidden z-10">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="text-center mb-16 md:mb-24">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 animate-fade-in-up">
                            Start in 3 Simple Steps
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto animate-fade-in-up delay-100">
                            Your journey to financial freedom is just a few clicks away.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Create Account", desc: "Sign up deeply securely in 30 seconds with just your email.", icon: FaUserPlus },
                            { step: "02", title: "Add Transactions", desc: "Log your daily income and expenses with ease.", icon: FaListUl },
                            { step: "03", title: "View Insights", desc: "Get instant breakdown of your spending habits.", icon: FaChartLine }
                        ].map((item, idx) => (
                            <div key={idx} className="group relative p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] border-2 border-transparent hover:border-orange-500/20 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                                {/* Watermark Number */}
                                <div className="absolute top-4 right-8 text-8xl font-black text-slate-200 dark:text-slate-700/50 group-hover:text-orange-100 dark:group-hover:text-orange-900/20 transition-colors duration-300 select-none">
                                    {item.step}
                                </div>

                                <div className="relative z-10 pt-12">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-2xl flex items-center justify-center text-orange-500 shadow-md mb-8 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                        <item.icon className="text-2xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. TESTIMONIALS */}
            <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-orange-500/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">Trusted by smart spenders</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { name: "Sarah J.", role: "Freelancer", text: "FinEase changed the way I look at money. I finally have savings because I know where every cent goes." },
                            { name: "Mike T.", role: "Small Biz Owner", text: "Simple, cleaner, and faster than any other app I've tried. The reporting features are exactly what I needed." },
                            { name: "Emily R.", role: "Student", text: "Perfect for tracking my student loans and daily coffee expenses. Ideally simple interface." }
                        ].map((t, idx) => (
                            <div key={idx} className="bg-slate-800/50 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-slate-700 hover:border-orange-500/50 transition-colors">
                                <FaQuoteLeft className="text-orange-500 text-2xl md:text-3xl mb-4 md:mb-6 opacity-50" />
                                <p className="text-slate-300 mb-4 md:mb-6 italic leading-relaxed text-sm md:text-base">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{t.name}</h4>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. FAQ SECTION */}
            <section className="py-16 md:py-24 bg-white dark:bg-base-200 relative overflow-hidden">
                <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-900 dark:text-white mb-8 md:mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`group bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-300 cursor-pointer ${openFaq === idx
                                    ? 'border-orange-500 shadow-xl shadow-orange-500/10'
                                    : 'border-slate-100 dark:border-slate-700 hover:border-orange-300 dark:hover:border-slate-600'
                                    }`}
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            >
                                <div className="flex items-center justify-between p-6">
                                    <span className={`text-base md:text-lg font-bold transition-colors ${openFaq === idx ? 'text-orange-600' : 'text-slate-900 dark:text-white'
                                        }`}>
                                        {faq.q}
                                    </span>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-orange-500 text-white rotate-180' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 group-hover:bg-orange-100 group-hover:text-orange-600'
                                        }`}>
                                        <FaChevronDown className="text-sm" />
                                    </div>
                                </div>
                                <div className={`overflow-hidden transition-all duration-300 ease-in-out px-6 ${openFaq === idx ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'
                                    }`}>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base border-t border-slate-100 dark:border-slate-700 pt-4">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. SECURITY SECTION (Replacement for Blog) */}
            <section className="py-16 md:py-24 bg-slate-50 dark:bg-base-300 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
                                Bank-Grade Security
                            </h2>
                            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 md:mb-8 leading-relaxed">
                                We protect your financial data with the highest security standards. Your information is encrypted and never shared without your permission.
                            </p>

                            <div className="space-y-4 md:space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                                        <FaLock className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">256-bit Encryption</h4>
                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">All data transferred between your device and our servers is encrypted.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
                                        <FaShieldAlt className="text-xl" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-2">Secure Infrastructure</h4>
                                        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">Hosted on world-class secure servers with 24/7 monitoring.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2 flex justify-center">
                            {/* Abstract visual representation of security */}
                            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                <div className="absolute inset-0 border-2 border-dashed border-orange-500/30 rounded-full animate-spin-slow"></div>
                                <FaLock className="text-6xl md:text-8xl text-slate-400 dark:text-slate-500 opacity-20" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <FaShieldAlt className="text-8xl md:text-9xl text-orange-500 drop-shadow-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7.5 NEW SECTION: Financial Wisdom */}
            <section className="py-20 bg-white dark:bg-base-200 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

                <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
                    <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        {/* Deco */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -mr-16 -mt-16"></div>

                        <div className="relative z-10 flex-1">
                            <span className="text-orange-400 font-bold tracking-wider uppercase text-xs mb-3 block">Expert Insights</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                Stay ahead of the curve.
                            </h2>
                            <p className="text-slate-400 text-lg leading-relaxed mb-8">
                                Get weekly financial tips, market updates, and exclusive guides delivered straight to your dashboard.
                            </p>

                            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
                                />
                                <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25">
                                    Subscribe
                                </button>
                            </form>
                            <p className="text-xs text-slate-500 mt-4">No spam, unsubscribe at any time.</p>
                        </div>

                        <div className="relative z-10 w-full md:w-auto">
                            <div className="w-full md:w-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                        <FaChartLine />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Market Update</div>
                                        <div className="text-xs text-slate-400">Just now</div>
                                    </div>
                                </div>
                                <div className="h-2 w-2/3 bg-slate-700 rounded-full mb-3"></div>
                                <div className="h-2 w-full bg-slate-700 rounded-full mb-3"></div>
                                <div className="h-2 w-5/6 bg-slate-700 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 8. CTA SECTION */}
            <section className="py-32 bg-orange-600 relative overflow-hidden text-center">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-white">
                    <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">Ready to master your finances?</h2>
                    <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">Join thousands of users who have transformed their financial lives with FinEase today.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register" className="bg-white text-orange-600 text-lg font-bold px-10 py-4 rounded-xl shadow-2xl hover:bg-slate-50 hover:scale-105 transition-all w-full sm:w-auto">
                            Create Free Account
                        </Link>
                        <Link to="/login" className="bg-orange-700 text-white text-lg font-bold px-10 py-4 rounded-xl shadow-lg border border-orange-500 hover:bg-orange-800 transition-all w-full sm:w-auto">
                            Log In
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;