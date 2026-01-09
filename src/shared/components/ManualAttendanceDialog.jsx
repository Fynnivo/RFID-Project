import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { useState } from 'react';
import { UserPlus } from 'lucide-react';

export const ManualAttendanceDialog = ({ user: tableUser, onSave }) => {
  const [status, setStatus] = useState('PRESENT');
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    onSave(status, notes); 
    setOpen(false);
    setNotes('');
    setStatus('PRESENT');
  };

  const handleCancel = () => {
    setOpen(false);
    setNotes(''); 
    setStatus('PRESENT');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) {
         setNotes('');
         setStatus('PRESENT');
      }
    }}>
      <DialogTrigger asChild>
        {/* Tambahkan onClick untuk mereset state jika perlu, 
            meskipun DialogTrigger biasanya handle open/close dengan baik */}
        <Button size="sm" variant="default">
          <UserPlus className="mr-2 h-4 w-4" />
          Manual
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Manual Attendance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 3. Gunakan `tableUser` dari props untuk menampilkan info pengguna yang dipilih */}
          <div>
            <Label>User</Label>
            {/* Tambahkan pengecekan jika tableUser ada */}
            {tableUser ? (
              <>
                <p className="font-medium">{tableUser.userName}</p>
                <p className="text-sm text-muted-foreground">{tableUser.userEmail}</p>
                <p className="text-xs text-muted-foreground">ID: {tableUser.userId}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">User information not available.</p>
            )}
          </div>
          
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRESENT">PRESENT</SelectItem>
                <SelectItem value="LATE">LATE</SelectItem>
                <SelectItem value="ABSENT">ABSENT</SelectItem>
                <SelectItem value="EXCUSED">EXCUSED</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter attendance notes..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate}
              disabled={!tableUser} // Disable jika tidak ada user
            >
              Create Attendance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
