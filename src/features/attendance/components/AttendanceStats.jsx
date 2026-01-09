import { Card } from '@/shared/components/ui/card';

export const AttendanceStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      <Card className="p-4">
        <div className="text-2xl font-bold text-primary">{stats.totalAssigned}</div>
        <div className="text-sm text-muted-foreground">Total Assigned</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-primary">{stats.totalScanned}</div>
        <div className="text-sm text-muted-foreground">Scanned</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-primary">{stats.totalNotScanned}</div>
        <div className="text-sm text-muted-foreground">Not Scanned</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-primary">{stats.totalPresent}</div>
        <div className="text-sm text-muted-foreground">Present</div>
      </Card>
      <Card className="p-4">
        <div className="text-2xl font-bold text-primary">{stats.totalLate}</div>
        <div className="text-sm text-muted-foreground">Late</div>
      </Card>
    </div>
  );
};