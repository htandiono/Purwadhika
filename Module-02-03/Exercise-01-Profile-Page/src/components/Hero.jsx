import React from 'react';
import { motion } from 'framer-motion';
import { Database, LayoutTemplate, Smartphone, Server } from 'lucide-react';
import heroImg from '../assets/hero.png';

const Hero = () => {
    return (
        <section id="profile" className="pt-32 pb-20 md:pt-40 md:pb-32 px-6 max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12">
            <div className="flex-1 space-y-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold tracking-wider mb-4 uppercase">Senior Full-Stack Developer</span>
                    <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-slate-900 leading-tight">
                        Building smart, <br />
                        <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">scalable digital systems.</span>
                    </h1>
                    <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl">
                        I build web and mobile applications, APIs, and databases. My background in field operations and research helps me understand how the software will be used day to day.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="flex flex-wrap gap-4"
                >
                    <a href="#projects" className="px-8 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">View Projects</a>
                    <a href="#contact" className="px-8 py-3 rounded-lg bg-white text-slate-700 font-medium hover:bg-slate-50 border border-slate-200 transition-colors">Let's Work Together</a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="pt-8 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { icon: LayoutTemplate, label: 'Web Apps' },
                        { icon: Smartphone, label: 'Mobile UI' },
                        { icon: Server, label: 'Backend/API' },
                        { icon: Database, label: 'Databases' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center sm:items-start space-y-2">
                            <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                                <item.icon size={20} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">{item.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="flex-1 w-full max-w-md md:max-w-none relative"
            >
                {/* Profile Picture */}
                <div className="aspect-square rounded-3xl overflow-hidden bg-slate-200 border-8 border-white shadow-2xl relative group">
                    <div className="absolute inset-0 bg-indigo-900/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={heroImg} alt="Hendrik Tandiono Profile" className="w-full h-full object-cover object-center" />
                </div>

                {/* Decorative elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-linear-to-tr from-blue-100 to-indigo-50 rounded-full blur-3xl opacity-70"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
