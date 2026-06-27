import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiBookOpen, FiLayers, FiUsers, FiAward, FiEdit3,
  FiImage, FiInbox, FiMessageSquare, FiSettings, FiLogOut,
  FiMenu, FiX, FiGrid, FiUserCheck,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const sidebarLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid size={18} /> },
  { path: '/admin/home', label: 'Home Management', icon: <FiHome size={18} /> },
  { path: '/admin/courses', label: 'Courses', icon: <FiBookOpen size={18} /> },
  { path: '/admin/facilities', label: 'Facilities', icon: <FiLayers size={18} /> },
  { path: '/admin/trainers', label: 'Trainers', icon: <FiUserCheck size={18} /> },
  { path: '/admin/students', label: 'Students', icon: <FiUsers size={18} /> },
  { path: '/admin/medals', label: 'Medal Records', icon: <FiAward size={18} /> },
  { path: '/admin/blogs', label: 'Blogs', icon: <FiEdit3 size={18} /> },
  { path: '/admin/gallery', label: 'Gallery', icon: <FiImage size={18} /> },
  { path: '/admin/admissions', label: 'Admissions', icon: <FiInbox size={18} /> },
  { path: '/admin/messages', label: 'Messages', icon: <FiMessageSquare size={18} /> },
  { path: '/admin/settings', label: 'Settings', icon: <FiSettings size={18} /> },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, adminEmail } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex flex-col w-64 bg-navy text-white fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-white/10">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-saffron rounded-lg flex items-center justify-center font-bold text-sm">
              PP
            </div>
            <div>
              <h2 className="font-bold text-sm">PPMA Admin</h2>
              <p className="text-xs text-gray-400 truncate">{adminEmail}</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'bg-royal-blue text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors mb-1"
          >
            <FiHome size={18} /> View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-navy text-white p-4 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-saffron rounded-lg flex items-center justify-center font-bold text-xs">
            PP
          </div>
          <span className="font-bold text-sm">PPMA Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween' }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-navy text-white z-40 flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <span className="font-bold">PPMA Admin</span>
                <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
                  <FiX size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === link.path
                        ? 'bg-royal-blue text-white'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-3 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut size={18} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
