import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Sun, Moon, LogOut, User as UserIcon, Menu, Cog } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { useSidebarStore } from '../../store/sidebarStore';
import { useNoticeStore } from '../../store/noticeStore';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isCollapsed, toggleCollapsed, toggleMobile } = useSidebarStore();
  const { unreadCount, fetchUnreadCount } = useNoticeStore();
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains('dark'));

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
    fetchUnreadCount();

    // Polling for new notices every 60 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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

  return (
    <header className={`h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-30 px-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-72'}`}>
      <div className="flex items-center flex-1 max-w-xl">
        <button
          onClick={() => {
            if (window.innerWidth < 1024) toggleMobile();
            else toggleCollapsed();
          }}
          className="mr-6 p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          <Menu size={20} />
        </button>
        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search for courses, students, results..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800/50 border-none rounded-xl focus:ring-2 focus:ring-primary-500/20 outline-none transition-all dark:text-white text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-5 ml-8">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          onClick={handleNoticeClick}
          className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl relative transition-all group"
        >
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 shadow-sm"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <div className="h-8 w-px bg-gray-200 dark:bg-gray-800 mx-1"></div>

        <div className="flex items-center space-x-4 pl-1">
          <div className="text-right hidden md:block">
            <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-1 tracking-tight">
               {user?.role === 'STUDENT' ? '242-15-211' : user?.role}
            </p>
          </div>

          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-primary-600">
              <UserIcon size={20} />
            </div>

            {/* Dropdown Placeholder */}
            <div className="absolute right-0 top-full pt-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-200 translate-y-2 group-hover:translate-y-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden w-48">
                <button
                  onClick={handleProfileClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <UserIcon size={18} />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
                <button
                  onClick={handleSettingsClick}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-gray-700 dark:text-gray-300"
                >
                  <Cog size={18} />
                  <span className="text-sm font-medium">Account Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 border-t border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
