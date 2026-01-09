import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Button } from '@/shared/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { ScheduleUserService } from '@/features/attendance/services/scheduleUserService'

export const AssignUserDialog = ({
  open,
  onOpenChange,
  onAssign,
  scheduleId,
  assignedUserIds = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const fetchAvailableUsers = async (query) => {
    setLoading(true);
    try {
      const result = await ScheduleUserService.getAvailableUsers(
        scheduleId,
        query
      );
      if (result.success) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      fetchAvailableUsers(searchQuery);
    }, 300);

    setDebounceTimer(timer);

    return () => clearTimeout(timer);
  }, [searchQuery, scheduleId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User to Schedule</DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by username, email, or RFID..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              {searchQuery
                ? 'No matching users found'
                : 'Start typing to search for users'}
            </p>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent"
                >
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-sm text-muted-foreground">
                      {user.email}
                    </div>
                    {user.rfidCard && (
                      <div className="text-xs text-muted-foreground">
                        RFID: {user.rfidCard}
                      </div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      onAssign(user.id);
                      onOpenChange(false);
                    }}
                  >
                    Assign
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
