import { useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import { toast } from 'react-hot-toast';
import useAuth from '@/features/auth/hooks/useAuth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Alert, AlertDescription } from '@/shared/components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/components/ui/card';
import { Label } from '@/shared/components/ui/label';
import { Input } from '@/shared/components/ui/input';
import { Separator } from '@/shared/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/ui/alert-dialog';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/shared/components/ui/select';
import { Badge } from '@/shared/components/ui/badge';
import { Search, Filter, PlusCircle, RefreshCw } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useDocumentTitle } from '@/shared/hooks/useDocumentTitle';
import Layout from '@/shared/components/Layout';

const User = () => {
  useDocumentTitle('IoT - Users Management');
  const { users, loading, error, createUser, updateUser, deleteUser, fetchUsers } = useUsers();
  const { user: currentUser } = useAuth();

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Selected user for edit/view/delete
  const [selectedUser, setSelectedUser] = useState(null);

  // Loading states
  const [submitLoading, setSubmitLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Handle create user
  const handleCreateUser = async (userData) => {
    setSubmitLoading(true);
    try {
      await createUser(userData);
      setShowCreateModal(false);
      toast.success('User created successfully');
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Failed to create user');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle update user
  const handleUpdateUser = async (userData) => {
    setSubmitLoading(true);
    try {
      await updateUser(selectedUser.id, userData);
      setShowEditModal(false);
      setSelectedUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.message || 'Failed to update user');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    setSubmitLoading(true);
    try {
      await deleteUser(selectedUser.id);
      setShowDeleteDialog(false);
      setSelectedUser(null);
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Refresh users
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUsers();
      toast.success('Users refreshed');
    } catch (error) {
      console.error('Failed to refresh users:', error);
      toast.error('Failed to refresh users');
    } finally {
      setRefreshing(false);
    }
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'inactive' && !user.isActive);

    const matchesTab = activeTab === 'all' ||
      (activeTab === 'active' && user.isActive) ||
      (activeTab === 'inactive' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus && matchesTab;
  });

  // Table action handlers
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  // Available roles (you can fetch these from your API if dynamic)
  const roles = ['ADMIN', 'MAIN_TEAM', 'CADET', 'MEMBER'];

  return (
    <Layout title={"User Manajemen"}>
        <main className="p-6 space-y-6">
          {/* Header with actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah User
              </Button>
            </div>
          </div>

          {/* Filters and search */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>{roleFilter === 'all' ? 'All Roles' : roleFilter}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>
                          {statusFilter === 'all' ? 'All Status' : 
                           statusFilter === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Status tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Semua User</TabsTrigger>
              <TabsTrigger value="active">Aktif</TabsTrigger>
              <TabsTrigger value="inactive">Tidak Aktif</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Users table */}
          <Card>
            <CardContent className="p-0">
              <UserTable
                users={filteredUsers}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                loading={loading}
                currentUserId={currentUser?.id}
              />
            </CardContent>
          </Card>

          {/* Create User Modal */}
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Buat User Baru</DialogTitle>
                <DialogDescription>
                  Tambahkan User Baru
                </DialogDescription>
              </DialogHeader>
              <UserForm
                onSubmit={handleCreateUser}
                onCancel={() => setShowCreateModal(false)}
                loading={submitLoading}
                roles={roles}
              />
            </DialogContent>
          </Dialog>

          {/* Edit User Modal */}
          <Dialog open={showEditModal} onOpenChange={(open) => {
            if (!open) {
              setShowEditModal(false);
              setSelectedUser(null);
            }
          }}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Buat perubahan di user
                </DialogDescription>
              </DialogHeader>
              <UserForm
                user={selectedUser}
                onSubmit={handleUpdateUser}
                onCancel={() => {
                  setShowEditModal(false);
                  setSelectedUser(null);
                }}
                loading={submitLoading}
                roles={roles}
                isEditing
              />
            </DialogContent>
          </Dialog>

          {/* View User Modal */}
          <Dialog open={showViewModal} onOpenChange={(open) => {
            if (!open) {
              setShowViewModal(false);
              setSelectedUser(null);
            }
          }}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Lihat informasi lengkap tentang user
                </DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries({
                      'Username': selectedUser.username,
                      'Full Name': selectedUser.fullName,
                      'Email': selectedUser.email,
                      'RFID Card': selectedUser.rfidCard || 'N/A',
                      'Role': (
                        <Badge variant={selectedUser.role === 'MEMBER' ? 'destructive' : 'default'}>
                          {selectedUser.role}
                        </Badge>
                      ),
                      'Status': (
                        <Badge variant={selectedUser.isActive ? 'default' : 'secondary'}>
                          {selectedUser.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      ),
                      'Created At': format(new Date(selectedUser.createdAt), 'PPpp'),
                      'Updated At': format(new Date(selectedUser.updatedAt), 'PPpp'),
                    }).map(([label, value]) => (
                      <div key={label} className="space-y-1">
                        <Label className="text-muted-foreground">{label}</Label>
                        <div className="text-sm font-medium">
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowViewModal(false);
                        setSelectedUser(null);
                      }}
                    >
                      Tutup
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={showDeleteDialog}
            onOpenChange={(open) => {
              if (!open) {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Kamu beneran yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Aksi ini tidak bisa dikembalikan. Dan akan menghapus permanen{" "}
                  <span className="font-semibold">{selectedUser?.fullName}</span> semua datanya.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={submitLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  disabled={submitLoading}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {submitLoading ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
        </Layout >
  );
};

export default User;