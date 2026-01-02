import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaFacebook, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
    useEffect(() => {
        document.title = 'Contact Us - FinEase';
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setIsSubmitting(false);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <FaEnvelope className="text-3xl text-primary-500" />,
            title: "Email Us",
            content: "support@finease.com",
            link: "mailto:support@finease.com"
        },
        {
            icon: <FaPhone className="text-3xl text-accent-500" />,
            title: "Call Us",
            content: "+880 1234-567890",
            link: "tel:+8801234567890"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl text-secondary-500" />,
            title: "Visit Us",
            content: "Dhaka, Bangladesh",
            link: null
        }
    ];

    const socialLinks = [
        {
            icon: <FaFacebook className="text-2xl" />,
            name: "Facebook",
            link: "#",
            color: "hover:text-blue-600"
        },
        {
            icon: <FaTwitter className="text-2xl" />,
            name: "Twitter",
            link: "#",
            color: "hover:text-sky-500"
        },
        {
            icon: <FaLinkedin className="text-2xl" />,
            name: "LinkedIn",
            link: "#",
            color: "hover:text-blue-700"
        },
        {
            icon: <FaGithub className="text-2xl" />,
            name: "GitHub",
            link: "#",
            color: "hover:text-gray-800 dark:hover:text-gray-300"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-base-100 pt-16">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 py-20">
                <div className="max-w-[1220px] mx-auto px-6 text-center">
                    <h1 className="text-5xl font-bold text-white mb-6">Get In Touch</h1>
                    <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
                        Have questions about FinEase? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="bg-white dark:bg-base-200 py-16">
                <div className="max-w-[1220px] mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        {contactInfo.map((info, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 dark:bg-base-100 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 dark:border-base-300"
                            >
                                <div className="flex justify-center mb-4">{info.icon}</div>
                                <h3 className="text-xl font-bold text-base-content mb-2">{info.title}</h3>
                                {info.link ? (
                                    <a
                                        href={info.link}
                                        className="text-base-content/70 hover:text-primary-500 transition-colors"
                                    >
                                        {info.content}
                                    </a>
                                ) : (
                                    <p className="text-base-content/70">{info.content}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Form and Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <div className="bg-white dark:bg-base-200 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-base-300">
                            <h2 className="text-3xl font-bold text-base-content mb-6">Send Us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-base-content font-medium mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-base-content font-medium mb-2">
                                        Your Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-base-content font-medium mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-base-content font-medium mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="5"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-8">
                            {/* FAQ Section */}
                            <div className="bg-white dark:bg-base-200 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-base-300">
                                <h2 className="text-3xl font-bold text-base-content mb-6">Frequently Asked Questions</h2>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-base-content mb-2">Is FinEase free to use?</h3>
                                        <p className="text-base-content/70">
                                            Yes! FinEase is completely free for personal use. We believe everyone should have access to quality financial management tools.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base-content mb-2">Is my financial data secure?</h3>
                                        <p className="text-base-content/70">
                                            Absolutely. We use industry-standard encryption and security practices to keep your data safe and private.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base-content mb-2">Can I export my data?</h3>
                                        <p className="text-base-content/70">
                                            Yes, you can export your transaction data anytime in various formats for your records.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-base-content mb-2">How do I get support?</h3>
                                        <p className="text-base-content/70">
                                            You can reach us through this contact form, email, or phone. We typically respond within 24 hours.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-white dark:bg-base-200 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-base-300">
                                <h2 className="text-2xl font-bold text-base-content mb-6">Connect With Us</h2>
                                <p className="text-base-content/70 mb-6">
                                    Follow us on social media for updates, tips, and financial insights
                                </p>
                                <div className="flex gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            className={`w-12 h-12 rounded-full bg-gray-100 dark:bg-base-100 flex items-center justify-center text-base-content ${social.color} transition-all duration-300 hover:scale-110`}
                                            title={social.name}
                                        >
                                            {social.icon}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-700">
                                <h2 className="text-2xl font-bold text-base-content mb-4">Support Hours</h2>
                                <div className="space-y-2 text-base-content/80">
                                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                                    <p><strong>Sunday:</strong> Closed</p>
                                    <p className="text-sm mt-4 text-base-content/60">
                                        * All times are in Bangladesh Standard Time (BST)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
