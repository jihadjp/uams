import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { motion } from 'framer-motion';
import { useSidebarStore } from '../store/sidebarStore';

const FacultyLayout = () => {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Sidebar role="FACULTY" />
      <Navbar />

      <main className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-[88px]' : 'lg:ml-72'} p-8`}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="min-h-[calc(100vh-160px)] flex flex-col justify-between"
        >
          <Outlet />
          <Footer />
        </motion.div>
      </main>
    </div>
  );
};

export default FacultyLayout;
