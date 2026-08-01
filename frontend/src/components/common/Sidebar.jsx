import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuthStore } from '../../store/authStore';
import { SIDEBAR_CONFIG } from '../../utils/sidebarConfig';
import { useState, useEffect } from 'react';
import {
    GraduationCap,
    Settings,
    X,
    ChevronDown
} from 'lucide-react';

const SidebarItem = ({ item, isCollapsed, isMobile, onClose, isExpanded, onToggle }) => {
    const { pathname } = useLocation();
    const logout = useAuthStore(state => state.logout);

    const isActive = item.type === 'single'
        ? pathname === item.path
        : item.children?.some(child => pathname.startsWith(child.path));

    if (item.type === 'single') {
        const isLogout = item.path === '/logout';

        const baseClasses = `
      flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-3 px-4'} py-3 rounded-xl font-medium transition-all duration-200 group relative w-full
    `;

        const activeClasses = 'bg-primary-600 text-white shadow-lg shadow-primary-500/30';
        const inactiveClasses = 'text-slate-400 hover:bg-white/5 hover:text-white';

        const content = (
            <>
                <item.icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                    <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
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
                    className={`${baseClasses} ${inactiveClasses} text-red-400 hover:text-red-300 hover:bg-red-500/10`}
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
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            >
                {content}
            </NavLink>
        );
    }

    // Group Item
    return (
        <div className="space-y-1">
            <button
                onClick={onToggle}
                className={`
          w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-4'} py-3 rounded-xl font-medium transition-all duration-200 group relative
          ${isActive && !isExpanded
                    ? 'bg-white/5 text-white font-semibold'
                    : isExpanded
                        ? 'bg-white/5 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'}
        `}
            >
                <div className="flex items-center space-x-3">
                    <item.icon size={20} className={`shrink-0 ${isActive ? 'text-primary-400' : ''}`} />
                    {!isCollapsed && <span className="text-sm">{item.label}</span>}
                </div>

                {!isCollapsed && (
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                        <ChevronDown size={14} className="text-slate-500 group-hover:text-slate-300" />
                    </motion.div>
                )}

                {/* Collapsed Hover Flyout Menu (Darker Background: #090d16) */}
                {isCollapsed && (
                    <div className="absolute left-full top-0 ml-4 p-2 bg-[#090d16] border border-white/10 rounded-2xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 z-50 shadow-2xl min-w-[200px]">
                        <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 mb-1">{item.label}</p>
                        {item.children.map(child => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) => `
                  flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors
                  ${isActive ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
                            >
                                {child.icon && <child.icon size={14} />}
                                <span>{child.label}</span>
                            </NavLink>
                        ))}
                    </div>
                )}
            </button>

            {/* Expanded Submenu Wrapper - Darker Background Added (#090d16) */}
            <AnimatePresence initial={false}>
                {isExpanded && !isCollapsed && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="my-1 ml-3 p-1.5 space-y-1 bg-[#090d16]/70 rounded-2xl border border-white/5">
                            {item.children.map(child => (
                                <NavLink
                                    key={child.path}
                                    to={child.path}
                                    onClick={isMobile ? onClose : undefined}
                                    className={({ isActive }) => `
                    flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150
                    ${isActive
                                        ? 'text-white bg-primary-600 font-semibold shadow-md shadow-primary-500/20'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
                  `}
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

    // Auto expand on active route change
    useEffect(() => {
        const activeGroup = currentMenu.find(
            item => item.type === 'group' && item.children?.some(child => pathname.startsWith(child.path))
        );
        if (activeGroup) {
            setExpandedGroup(activeGroup.label);
        }
    }, [pathname, role]);

    const handleToggleGroup = (label) => {
        setExpandedGroup(prev => (prev === label ? null : label));
    };

    const sidebarVariants = {
        expanded: { width: 288 },
        collapsed: { width: 88 },
    };

    const renderNavItems = (isMobile = false) => (
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
        ))
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={isCollapsed ? 'collapsed' : 'expanded'}
                variants={sidebarVariants}
                className="h-screen fixed left-0 top-0 border-r border-gray-100 dark:border-gray-800/50 z-40 hidden lg:block"
            >
                <div className="h-full flex flex-col bg-[#0f172a] text-slate-300 transition-colors duration-300">
                    <div className={`p-8 flex items-center ${isCollapsed ? 'justify-center px-0' : 'space-x-4'}`}>
                        <div className="p-2.5 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30 shrink-0">
                            <GraduationCap size={28} />
                        </div>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-col"
                            >
                                <span className="text-xl font-black text-white tracking-tight leading-none">UAMS</span>
                                <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mt-1">University Portal</span>
                            </motion.div>
                        )}
                    </div>

                    <nav className="flex-1 px-3 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
                        {renderNavItems(false)}
                    </nav>

                    <div className="p-4 mt-auto border-t border-white/5">
                        <div className={`p-4 bg-white/5 rounded-2xl ${isCollapsed ? 'flex justify-center p-3' : ''}`}>
                            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                                <div className="p-2.5 bg-white/10 rounded-xl text-slate-400 shrink-0">
                                    <Settings size={18} />
                                </div>
                                {!isCollapsed && (
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white leading-none">Settings</p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-1">Profile & Privacy</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 h-screen w-80 z-[60] lg:hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="absolute top-6 right-6 p-2 bg-white dark:bg-gray-800 rounded-xl text-gray-400 shadow-lg z-10"
                            >
                                <X size={20} />
                            </button>
                            <div className="h-full flex flex-col bg-[#0f172a] text-slate-300">
                                <div className="p-8 flex items-center space-x-4">
                                    <div className="p-2.5 bg-primary-600 rounded-2xl text-white shadow-lg shadow-primary-500/30 shrink-0">
                                        <GraduationCap size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-white tracking-tight leading-none">UAMS</span>
                                        <span className="text-[9px] font-bold text-primary-400 uppercase tracking-widest mt-1">Mobile Portal</span>
                                    </div>
                                </div>
                                <nav className="flex-1 px-4 mt-2 space-y-1 overflow-y-auto custom-scrollbar">
                                    {renderNavItems(true)}
                                </nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;