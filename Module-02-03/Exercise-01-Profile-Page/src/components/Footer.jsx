import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <a href="#" className="flex items-center gap-1 justify-center md:justify-start text-xl font-heading font-bold text-white mb-2 tracking-tight">
                        <span className="text-blue-500">HT</span>.dev
                    </a>
                    <p className="text-sm">Senior Full-Stack Developer & Database Engineer.</p>
                </div>

                <div className="flex space-x-6 text-sm">
                    <a href="#profile" className="hover:text-white transition-colors">Profile</a>
                    <a href="#projects" className="hover:text-white transition-colors">Projects</a>
                    <a href="#contact" className="hover:text-white transition-colors">Contact</a>
                </div>

                <div className="text-sm text-center md:text-right">
                    &copy; {new Date().getFullYear()} Hendrik Tandiono. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
