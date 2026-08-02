import React from 'react';

const Footer = () => {
    return (
        <footer className="pt-10 pb-6 text-center border-t border-slate-100 dark:border-white/[0.06] mt-auto">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/30 leading-relaxed">
                {new Date().getFullYear()} © Royal Bengal University — Developed by Metamorph-X
            </p>
        </footer>
    );
};

export default Footer;
