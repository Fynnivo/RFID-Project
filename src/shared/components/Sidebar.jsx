import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  Settings,
  BarChart3,
  Clock,
  LogOut
} from 'lucide-react';
import Logo from '@/assets/logo-iotcampus-transparent.png';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import UserAvatar from '@/features/dashboard/components/Avatar.tsx';
import useAuth from '@/features/auth/hooks/useAuth.js';

const Sidebar = () => {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Attendances', path: '/attendances' },
    { icon: Users, label: 'Users', path: '/users' },
    { icon: Clock, label: 'Schedules', path: '/schedules' },
    { icon: Settings, label: 'Settings', path: '/settings' }
  ];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
    } catch (error) {
      // Optional: handle error
    } finally {
      // Hapus token dari localStorage dan context
      localStorage.removeItem('authToken');
      if (logout) logout();
      window.location.reload();
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white z-50 border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="flex justify-center space-x-4 mt-5 items-center mb-8">
        <img src={Logo} alt="IOTCampus Logo" className="w-12 h-auto" />
        <h1 className="text-orange-500 font-semibold text-xl">IoT Campus</h1>
      </div>

      {/* Navigation */}
      <nav className="px-4 flex-grow">
        <ul>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-orange-50 text-orange-600 font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Information Section */}
      <div className="px-4 py-3 border-t border-gray-200 mt-auto flex items-center justify-between cursor-pointer">
        <UserAvatar
          name={user?.fullName || user?.name || 'User'}
          avatarUrl={user?.avatar || ''}
          role={user?.role}
        />
        <Dialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
          <DialogTrigger asChild>
            <button
              onClick={() => setOpenLogoutDialog(true)}
              className="text-gray-600 hover:text-orange-500 cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </DialogTrigger>
          <DialogContent
            className="sm:max-w-md"
          >
            <DialogHeader>
              <DialogTitle>Keluar dari akun?</DialogTitle>
              <DialogDescription>
                Apakah kamu yakin ingin logout? Semua sesi akan diakhiri.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                className="cursor-pointer"
                variant="ghost"
                onClick={() => setOpenLogoutDialog(false)}
              >
                Batal
              </Button>
              <Button
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Ya, Logout
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Sidebar;