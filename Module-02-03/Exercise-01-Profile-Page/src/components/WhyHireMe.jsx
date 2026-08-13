import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Briefcase } from 'lucide-react';

const WhyHireMe = () => {
    const highlights = [
        { title: "12+ Years Experience", desc: "Building software used across real operations and multi-department workflows." },
        { title: "Business to System", desc: "Able to convert complex business problems into clean, scalable digital systems." },
        { title: "Database Engineering", desc: "Strong background in complex queries, automation, and optimization." },
        { title: "Cross-Industry", desc: "Experience in agriculture, logistics, retail, R&D, traceability, and more." },
        { title: "Reliable & Independent", desc: "Communicative and able to work independently with minimal supervision." }
    ];

    return (
        <section id="why-hire-me" className="py-24 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-heading font-bold text-slate-900"
                    >
                        Why Clients <span className="text-blue-600">Hire Me</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-4 text-slate-600"
                    >
                        I understand how software needs to work in day-to-day operations.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-1"
                    >
                        {highlights.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                                <CheckCircle className="text-blue-600 shrink-0 mt-1" size={24} />
                                <div>
                                    <h3 className="font-semibold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-600 text-sm mt-1">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>

                        <h3 className="text-xl font-heading font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Briefcase className="text-blue-600" /> Background Highlights
                        </h3>
                        <p className="text-slate-700 mb-6 text-sm leading-relaxed">
                            Before becoming a full-stack developer, I spent years working closely with field operations, research teams, logistics, and monitoring programs. This gives me a unique advantage to bridge the gap between operations and technology.
                        </p>

                        <h4 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wider">Enterprise Projects</h4>
                        <ul className="space-y-3">
                            {[
                                "Digital recording & traceability operations",
                                "GIS-based automated mapping tools",
                                "AI software development & consultation",
                                "Cross-company API integrations",
                                "Spreadsheet and BI consultation"
                            ].map((proj, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                    {proj}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default WhyHireMe;
