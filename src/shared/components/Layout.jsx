import { Toaster } from 'react-hot-toast';
import SessionExpireDialog from '@/shared/components/SessionExpireDialog';
import Sidebar from '@/shared/components/Sidebar.jsx';
import Header from '@/shared/components/Header.jsx';
import useAuth from '@/features/auth/hooks/useAuth';

const Layout = ({ children, title }) => {
    const { logout } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50">
            <SessionExpireDialog logout={logout} />
            <Toaster />
            <Sidebar />
            <div className="ml-64">
                <Header titles={title}/>
                {children}
            </div>
        </div>
    )
}

export default Layout