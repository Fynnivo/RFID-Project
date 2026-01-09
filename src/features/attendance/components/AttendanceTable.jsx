import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Pencil, Trash2, Save, X, UserPlus, Loader2 } from 'lucide-react';
import { ManualAttendanceDialog } from '@/shared/components/ManualAttendanceDialog';
import { format } from 'date-fns';

export const AttendanceTable = ({
  data,
  loading,
  editId,
  editStatus,
  editNotes,
  setEditStatus,
  setEditNotes,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onCreateManual,
  onRemoveAssignment,
}) => {
  const statusVariants = {
    PRESENT: 'success',
    LATE: 'warning',
    ABSENT: 'destructive',
    EXCUSED: 'secondary',
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not scanned yet';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>RFID Card</TableHead>
          <TableHead>Assigned At</TableHead>
          <TableHead>Scan Time</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="min-w-[200px]">Notes</TableHead>
          <TableHead className="text-center w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Loading attendance data...
              </div>
            </TableCell>
          </TableRow>
        ) : !data?.attendance?.length ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
              No users assigned to this schedule
            </TableCell>
          </TableRow>
        ) : (
          data.attendance.map((item) => (
            <TableRow
              key={`${item.userId}-${item.assignedAt}`}
              className={!item.hasScanned ? 'bg-yellow-50/50' : ''}
            >
              <TableCell>
                <div className="font-medium">{item.userName}</div>
                <div className="text-sm text-muted-foreground">ID: {item.userId}</div>
              </TableCell>
              <TableCell className="text-sm">{item.userEmail}</TableCell>
              <TableCell>
                {item.rfidCard ? (
                  <Badge variant="outline" className="font-mono">
                    {item.rfidCard}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">No RFID</span>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {formatDateTime(item.assignedAt)}
              </TableCell>
              <TableCell className="text-sm">
                {item.attendance?.scanTime ? (
                  formatDateTime(item.attendance.scanTime)
                ) : (
                  <span className="text-muted-foreground italic">Waiting for scan</span>
                )}
              </TableCell>
              <TableCell>
                {item.attendance && editId === item.attendance.id ? (
                  <Select
                    value={editStatus}
                    onValueChange={setEditStatus}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRESENT">Present</SelectItem>
                      <SelectItem value="LATE">Late</SelectItem>
                      <SelectItem value="ABSENT">Absent</SelectItem>
                      <SelectItem value="EXCUSED">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                ) : item.attendance?.status ? (
                  <Badge variant={statusVariants[item.attendance.status]}>
                    {item.attendance.status}
                    {item.attendance.isLate && ' (Late)'}
                  </Badge>
                ) : (
                  <Badge variant="outline">Not scanned</Badge>
                )}
              </TableCell>
              <TableCell>
                {item.attendance && editId === item.attendance.id ? (
                  <Textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Enter notes..."
                    className="min-h-[80px]"
                  />
                ) : (
                  <div className="text-sm text-muted-foreground max-w-[200px] line-clamp-3">
                    {item.attendance?.notes || (
                      <span className="italic">No notes</span>
                    )}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  {item.attendance && editId === item.attendance.id ? (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={onCancel}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={() => onSave(item.attendance.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      {!item.attendance && (
                        <ManualAttendanceDialog
                          user={item}
                          onSave={(status, notes) =>
                            onCreateManual(item.userId, status, notes)
                          }
                        >
                          <Button variant="outline" size="icon">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </ManualAttendanceDialog>
                      )}
                      {item.attendance && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(item.attendance)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {item.attendance && (
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => onDelete(item.attendance.id, data.selectedDate)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveAssignment(data.schedule.id, item.userId)}
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};