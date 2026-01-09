import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { customToast as toast } from '@/shared/utils/lib/toast'; // Gunakan custom toast utility
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";

const Header = ({titles}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast.success(`Mencari: ${searchQuery}`, {
        position: 'top-center',
        duration: 2000
      });
      // Implementasi logika pencarian disini
    } else {
      toast.error('Masukkan kata pencarian', {
        position: 'top-center',
        duration: 2000
      });
    }
  };

  const [notifications, setNotifications] = useState([
    { id: 1, message: "Absen hari ini berhasil dicatat" },
    { id: 2, message: "Jadwal kelas baru telah ditambahkan" },
    { id: 3, message: "Token sesi Anda hampir habis" },
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success('Notifikasi ditandai sudah dibaca', {
      position: 'bottom-right',
      duration: 1500
    });
  };

  return (
    <header className="px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <h1 className="text-2xl font-semibold text-orange-500 flex-shrink-0">{titles}</h1>

        {/* Center: Search Bar */}
        <div className="flex-grow flex justify-center px-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-background rounded-md border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 w-full text-sm"
            />
          </form>
        </div>

        {/* Right: Notification Bell */}
        <div className="flex-shrink-0 relative">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="p-2 text-muted-foreground hover:bg-accent rounded-md transition-colors relative"
                aria-label="Notifications"
              >
                <Bell size={20} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h4 className="font-medium">Notifikasi</h4>
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Tidak ada notifikasi
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {notifications.map((notif) => (
                    <li
                      key={notif.id}
                      className="p-3 hover:bg-accent transition-colors cursor-pointer flex justify-between items-start"
                      onClick={() => markAsRead(notif.id)}
                    >
                      <span className="text-sm">{notif.message}</span>
                      <button 
                        className="text-muted-foreground hover:text-foreground text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notif.id);
                        }}
                      >
                        Tandai dibaca
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default Header;