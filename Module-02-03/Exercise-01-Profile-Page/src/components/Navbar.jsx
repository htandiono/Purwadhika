import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Profile', href: '#profile' },
        { name: 'Why Hire Me', href: '#why-hire-me' },
        { name: 'Projects', href: '#projects' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                <a href="#" className="text-xl font-heading font-bold text-blue-700 tracking-tight">HT<span className="text-slate-800">.dev</span></a>

                {/* Desktop Nav */}
                <div className="hidden md:flex space-x-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-slate-800" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-6 flex flex-col space-y-4">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-slate-600 hover:text-blue-600">
                            {link.name}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
