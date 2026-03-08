import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 -z-10 skew-x-12 translate-x-32 hidden lg:block"></div>

            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl md:text-5xl font-heading font-bold text-slate-900 leading-tight mb-6">
                            Let's build something <span className="text-blue-600">great together.</span>
                        </h2>
                        <p className="text-slate-600 text-lg mb-8 max-w-md">
                            Whether you need a new application, want to optimize your existing systems, or require a developer who can handle backend + frontend + database, I can deliver.
                        </p>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 text-slate-700">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Mail />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Email Me At</p>
                                    <p className="font-semibold text-slate-900">tech.masterload8@gmail.com</p>
                                    {/* Assuming email, user can update text above */}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl p-8 border border-slate-100 shadow-2xl shadow-slate-200/50"
                    >
                        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <MessageSquare className="text-blue-600" /> Send a Message
                        </h3>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                                    <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
                                    <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                <input type="text" id="subject" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Project Inquiry" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none" placeholder="Tell me about your project..."></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors mt-6">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
