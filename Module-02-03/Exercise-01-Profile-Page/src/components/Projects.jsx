import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import proj1Img from '../assets/projects-1.jpg';
import proj2Img from '../assets/projects-2.jpg';
import proj3Img from '../assets/projects-3.jpg';

const Projects = () => {
    const projects = [
        {
            title: "Traceability & Operations System",
            description: "End-to-end digital recording and traceability system for plantation operations.",
            tech: ["React", "Node.js", "PostgreSQL", "Tailwind"],
            imageSrc: proj1Img
        },
        {
            title: "GIS Automated Mapping",
            description: "Custom GIS-based mapping tool for spatial data analysis and operations planning.",
            tech: ["MapInfo", "Python", "SQL Server", "React"],
            imageSrc: proj2Img
        },
        {
            title: "AI Software Development & Consultation",
            description: "Custom AI solutions and consulting to optimize business processes and decision making.",
            tech: ["Python", "TensorFlow", "Node.js", "React"],
            imageSrc: proj3Img
        }
    ];

    return (
        <section id="projects" className="py-24 bg-slate-50">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-heading font-bold text-slate-900"
                        >
                            Featured <span className="text-blue-600">Projects</span>
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-4 text-slate-600"
                        >
                            A selection of enterprise-grade systems I've built to solve complex operational challenges.
                        </motion.p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                        >
                            <div className="h-48 w-full bg-slate-100 relative overflow-hidden shrink-0">
                                <img src={project.imageSrc} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                    <button className="p-2 bg-white rounded-full text-slate-900 hover:text-blue-600 transition-colors">
                                        <ExternalLink size={20} />
                                    </button>
                                    <button className="p-2 bg-white rounded-full text-slate-900 hover:text-blue-600 transition-colors">
                                        <Github size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
                                <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {project.tech.map((tech, i) => (
                                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
