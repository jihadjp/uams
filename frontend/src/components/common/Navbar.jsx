import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Sun, Moon, LogOut, User as UserIcon, Menu, Cog, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useSidebarStore } from '../../store/sidebarStore';
import { useNoticeStore } from '../../store/noticeStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SIDEBAR_CONFIG } from '../../utils/sidebarConfig';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isCollapsed, toggleCollapsed, toggleMobile } = useSidebarStore();
  const { unreadCount, fetchUnreadCount } = useNoticeStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Init theme
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      }
    }
    fetchUnreadCount();
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const toggleDarkMode = () => {
    if (typeof document === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  const getBasePath = () => {
    if (!user?.role) return '';
    if (user.role === 'ADMIN' || user.role === 'REGISTRAR') return '/portal';
    return `/${user.role.toLowerCase()}`;
  };

  const basePath = getBasePath();

  const handleNoticeClick = () => {
    if (basePath) navigate(`${basePath}/notices`);
    else navigate('/login');
  };

  const handleProfileClick = () => {
    if (basePath) navigate(`${basePath}/profile`);
    else navigate('/login');
  };

  const handleSettingsClick = () => {
    if (basePath) navigate(`${basePath}/settings`);
    else navigate('/login');
  };

  // Dynamic Title Logic
  const getPageTitle = () => {
    if (!user?.role) return 'Portal';
    const menu = SIDEBAR_CONFIG[user.role] || [];
    const path = location.pathname;

    // 1. Direct match in sidebar
    for (const item of menu) {
      if (item.type === 'single' && item.path === path) return item.label;
      if (item.type === 'group' && item.children) {
        const child = item.children.find(c => c.path === path);
        if (child) return child.label;
      }
    }

    // 2. Fallback for dynamic/detail routes
    if (path.includes('/students/')) return 'Student Profile';
    if (path.includes('/faculty/')) return 'Faculty Profile';
    if (path.includes('/courses/')) return 'Course Details';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/settings')) return 'Account Settings';
    if (path.includes('/scholarship/apply')) return 'Aid Application';

    return 'Portal';
  };

  const pageTitle = getPageTitle();

  useEffect(() => {
    document.title = `${pageTitle} | Royal Bengal University`;
  }, [pageTitle]);

  return (
      <header
          className={`h-[72px] bg-white/[0.92] dark:bg-[#09101F]/90 backdrop-blur-xl sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between border-b border-slate-200 dark:border-white/10 transition-all duration-300 ${
              isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-[296px]'
          }`}
      >
        <AnimatePresence mode="wait">
          {isMobileSearchOpen ? (
              /* Mobile Open Search Bar */
              <motion.div
                  key="mobile-search"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center w-full gap-2 sm:hidden"
              >
                <div className="relative flex-1">
                  <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30"
                      size={18}
                  />
                  <input
                      type="text"
                      autoFocus
                      placeholder="Search courses, students..."
                      className="w-full pl-11 pr-4 py-2 bg-slate-100 dark:bg-white/[0.06] border border-[#007A55] dark:border-[#007A55] rounded-xl text-slate-900 dark:text-white text-sm outline-none font-medium"
                  />
                </div>
                <button
                    onClick={() => setIsMobileSearchOpen(false)}
                    className="p-2 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] rounded-xl transition-all"
                    aria-label="Close search"
                >
                  <X size={20} />
                </button>
              </motion.div>
          ) : (
              /* Standard Navbar Content */
              <motion.div
                  key="standard-nav"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center justify-between w-full"
              >
                {/* Left side: Hamburger, Title, Desktop Search */}
                <div className="flex items-center flex-1 max-w-xl min-w-0 mr-2 sm:mr-0">
                  <button
                      onClick={() => {
                        if (typeof window !== 'undefined' && window.innerWidth < 1024) toggleMobile();
                        else toggleCollapsed();
                      }}
                      className="mr-3 sm:mr-6 p-2 sm:p-2.5 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-white rounded-xl transition-all shrink-0"
                      aria-label="Toggle sidebar"
                  >
                    <Menu size={20} />
                  </button>

                  {/* Page Title - Now visible on Mobile too */}
                  <div className="mr-3 sm:mr-8 shrink min-w-0">
                    <motion.h2
                        key={pageTitle}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate"
                    >
                      {pageTitle}
                    </motion.h2>
                  </div>

                  {/* Desktop Search Input */}
                  <div className="relative group flex-1 hidden sm:block">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/30 group-focus-within:text-[#007A55] transition-colors"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search for courses, students, results..."
                        className="w-full pl-11 pr-4 py-2.5 bg-slate-100 dark:bg-white/[0.06] border border-transparent dark:border-white/[0.06] rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:bg-white dark:focus:bg-[#0B1225] focus:border-[#007A55] dark:focus:border-[#007A55] focus:ring-4 focus:ring-[#007A55]/10 outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Right Side Controls */}
                <div className="flex items-center space-x-1 sm:space-x-3 shrink-0 ml-2 sm:ml-8">
                  {/* Mobile Search Toggle Icon */}
                  <button
                      onClick={() => setIsMobileSearchOpen(true)}
                      className="sm:hidden p-2 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-white rounded-xl transition-all"
                      aria-label="Open search"
                  >
                    <Search size={19} />
                  </button>

                  {/* Theme Toggle */}
                  <button
                      onClick={toggleDarkMode}
                      className="p-2 sm:p-2.5 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-white rounded-xl transition-all"
                      aria-label="Toggle theme"
                  >
                    {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
                  </button>

                  {/* Notices */}
                  <button
                      onClick={handleNoticeClick}
                      className="p-2 sm:p-2.5 text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:text-slate-700 dark:hover:text-white rounded-xl relative transition-all group"
                      aria-label="Notices"
                  >
                    <Bell size={19} className="group-hover:rotate-12 transition-transform" />
                    <AnimatePresence>
                      {unreadCount > 0 && (
                          <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-[#09101F] shadow-sm"
                          >
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </motion.span>
                      )}
                    </AnimatePresence>
                  </button>

                  <div className="h-7 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

                  {/* User Avatar & Dropdown */}
                  <div className="flex items-center gap-3 pl-1">
                    <div className="text-right hidden md:block">
                      <p className="text-[13px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-1">
                        {user?.identifier || user?.role || 'GUEST'}
                      </p>
                    </div>

                    <div className="relative group">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/15 text-[#007A55] dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20 shadow-sm cursor-pointer transition group-hover:shadow-md overflow-hidden">
                        {user?.profileImage ? (
                            <img
                                src={
                                  user.profileImage.startsWith('http') || user.profileImage.startsWith('/api')
                                      ? user.profileImage
                                      : `/api/uploads/${user.profileImage}`
                                }
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <UserIcon size={18} />
                        )}
                      </div>

                      {/* Dropdown */}
                      <div className="absolute right-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-1 group-hover:translate-y-0 z-50">
                        <div className="bg-white dark:bg-[#0B1225] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden w-52">
                          <div className="p-3.5 border-b border-slate-100 dark:border-white/5 md:hidden">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30 mt-0.5">
                              {user?.role}
                            </p>
                          </div>

                          <button
                              onClick={handleProfileClick}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors text-slate-600 dark:text-white/70 text-sm font-medium"
                          >
                            <UserIcon size={16} />
                            My Profile
                          </button>
                          <button
                              onClick={handleSettingsClick}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.06] transition-colors text-slate-600 dark:text-white/70 text-sm font-medium"
                          >
                            <Cog size={16} />
                            Account Settings
                          </button>
                          <button
                              onClick={logout}
                              className="w-full flex items-center gap-3 px-4 py-3 border-t border-slate-100 dark:border-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-red-600 dark:text-red-300/80 text-sm font-medium"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
          )}
        </AnimatePresence>
      </header>
  );
};

export default Navbar;