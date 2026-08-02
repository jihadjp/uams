import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuthStore } from '../../store/authStore';
import { SIDEBAR_CONFIG } from '../../utils/sidebarConfig';
import { useState, useEffect } from 'react';
import { Settings, X, ChevronDown } from 'lucide-react';

const SidebarItem = ({ item, isCollapsed, isMobile, onClose, isExpanded, onToggle }) => {
    const { pathname } = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const isActive =
        item.type === 'single'
            ? pathname === item.path
            : item.children?.some((child) => pathname.startsWith(child.path));

    if (item.type === 'single') {
        const isLogout = item.path === '/logout';
        const baseClasses = `flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-xl font-medium transition-all duration-200 group relative w-full`;
        const activeClasses =
            'bg-gradient-to-r from-[#007A55] to-[#00956A] text-white shadow-lg shadow-emerald-700/25';
        const inactiveClasses = 'text-white/45 hover:bg-white/[0.06] hover:text-white/90';

        const content = (
            <>
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl border border-white/10">
                        {item.label}
                    </div>
                )}
            </>
        );

        if (isLogout) {
            return (
                <button
                    onClick={() => {
                        logout();
                        if (isMobile) onClose();
                    }}
                    className={`${baseClasses} ${inactiveClasses} text-red-300/70 hover:text-red-200 hover:bg-red-500/10`}
                >
                    {content}
                </button>
            );
        }

        return (
            <NavLink
                to={item.path}
                end
                onClick={isMobile ? onClose : undefined}
                className={({ isActive: linkActive }) =>
                    `${baseClasses} ${linkActive ? activeClasses : inactiveClasses}`
                }
            >
                {content}
            </NavLink>
        );
    }

    const groupActiveClasses =
        isActive && !isExpanded
            ? 'bg-white/[0.06] text-white font-semibold'
            : isExpanded
                ? 'bg-white/[0.06] text-white'
                : 'text-white/45 hover:bg-white/[0.06] hover:text-white/90';

    return (
        <div className="space-y-1">
            <button
                onClick={onToggle}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-3 rounded-xl font-medium transition-all duration-200 group relative ${groupActiveClasses}`}
            >
                <div className="flex items-center space-x-3">
                    <item.icon size={20} className={`shrink-0 ${isActive ? 'text-emerald-300' : ''}`} />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </div>
                {!isCollapsed && (
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={14} className="text-white/20 group-hover:text-white/40" />
                    </motion.div>
                )}
                {isCollapsed && (
                    <div className="absolute left-full top-0 ml-4 p-2 bg-[#0B1225] border border-white/10 rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 shadow-2xl min-w-[210px]">
                        <p className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5 mb-1.5">
                            {item.label}
                        </p>
                        {item.children.map((child) => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive: childActive }) =>
                                    `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                                        childActive
                                            ? 'bg-gradient-to-r from-[#007A55] to-[#00956A] text-white shadow-md'
                                            : 'text-white/45 hover:bg-white/[0.06] hover:text-white/90'
                                    }`
                                }
                            >
                                {child.icon && <child.icon size={14} />}
                                <span>{child.label}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="my-1 ml-3 p-1.5 space-y-1 bg-[#070D1D] rounded-2xl border border-white/[0.06]">
                            {item.children.map((child) => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    onClick={isMobile ? onClose : undefined}
                                    className={({ isActive: childActive }) =>
                                        `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                                            childActive
                                                ? 'text-white bg-gradient-to-r from-[#007A55] to-[#00956A] font-semibold shadow-md'
                                                : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
                                        }`
                                    }
                                >
                                    {child.icon && <child.icon size={15} className="shrink-0" />}
                                    <span className="truncate">{child.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Sidebar = ({ role }) => {
    const { pathname } = useLocation();
    const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore();
    const [expandedGroup, setExpandedGroup] = useState(null);
    const currentMenu = SIDEBAR_CONFIG[role] || [];

    useEffect(() => {
        const activeGroup = currentMenu.find(
            (item) => item.type === 'group' && item.children?.some((child) => pathname.startsWith(child.path))
        );
        if (activeGroup) setExpandedGroup(activeGroup.label);
    }, [pathname, role, currentMenu]);

    const handleToggleGroup = (label) => {
        setExpandedGroup((prev) => (prev === label ? null : label));
    };

    const sidebarVariants = {
        expanded: { width: 296 },
        collapsed: { width: 88 },
    };

    const renderNavItems = (isMobile = false) =>
        currentMenu.map((item, idx) => (
            <SidebarItem
                key={item.label || idx}
                item={item}
                isCollapsed={isMobile ? false : isCollapsed}
                isMobile={isMobile}
                onClose={() => setMobileOpen(false)}
                isExpanded={item.type === 'group' && expandedGroup === item.label}
                onToggle={() => handleToggleGroup(item.label)}
            />
        ));

    return (
        <>
            {/* Desktop Sidebar - Royal Bengal University Branding */}
            <motion.aside
                initial={false}
                animate={isCollapsed ? 'collapsed' : 'expanded'}
                variants={sidebarVariants}
                className="h-screen fixed left-0 top-0 border-r border-white/10 z-40 hidden lg:block"
            >
                <div className="h-full flex flex-col bg-[#09101F] text-slate-300">
                    {/* Logo - Same as Login Page */}
                    <div className={`py-7 border-b border-white/[0.06] ${isCollapsed ? 'px-3 flex justify-center' : 'px-6 flex items-center gap-3'}`}>
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white p-1.5 shadow-xl shadow-black/20">
                            <img src="/images/logo.png" alt="Royal Bengal University" className="h-full w-full object-contain" />
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.35 }}
                                className="min-w-0"
                            >
                                <h1 className="text-[13.5px] font-black leading-tight tracking-tight text-white whitespace-nowrap">
                                    Royal Bengal University
                                </h1>
                                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 whitespace-nowrap">
                                    Academic Management System
                                </p>
                            </motion.div>
                        )}
                    </div>

                    <nav className="flex-1 px-3 mt-4 space-y-1 overflow-y-auto custom-scrollbar">
                        {renderNavItems(false)}
                    </nav>

                    <div className="p-4 mt-auto border-t border-white/[0.06]">
                        <div className={`rounded-2xl bg-white/[0.05] border border-white/[0.06] ${isCollapsed ? 'p-3 flex justify-center' : 'p-3.5 flex items-center gap-3'}`}>
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08] text-white/40">
                                <Settings size={16} />
                            </div>
                            {!isCollapsed && (
                                <div className="min-w-0">
                                    <p className="text-[13px] font-bold leading-none text-white/80">Settings</p>
                                    <p className="text-[10px] text-white/30 font-medium mt-1">Profile & Privacy</p>
                                </div>
                            )}
                        </div>
                        {!isCollapsed && (
                            <p className="mt-3 text-center text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                                © {new Date().getFullYear()} · Royal Bengal University
                            </p>
                        )}
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-[#09101F]/80 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 h-screen w-[300px] z-[60] lg:hidden shadow-2xl border-r border-white/10"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-5 right-5 p-2.5 bg-white/10 backdrop-blur border border-white/10 rounded-xl text-white/60 hover:text-white transition"
                            >
                                <X size={18} />
                            </button>
                            <div className="h-full flex flex-col bg-[#09101F]">
                                <div className="px-6 py-7 flex items-center gap-3 border-b border-white/[0.06]">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white p-1.5 shadow-xl">
                                        <img src="/images/logo.png" alt="Royal Bengal University" className="h-full w-full object-contain" />
                                    </div>
                                    <div>
                                        <h1 className="text-[14px] font-black tracking-tight text-white leading-tight">Royal Bengal University</h1>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40 mt-0.5">University Services</p>
                                    </div>
                                </div>
                                <nav className="flex-1 px-4 mt-4 space-y-1 overflow-y-auto">{renderNavItems(true)}</nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
