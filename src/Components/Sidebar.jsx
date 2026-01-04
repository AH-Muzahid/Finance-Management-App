import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaHome, FaPlus, FaList, FaChartBar, FaUser, FaTimes, FaSignOutAlt, FaCog } from 'react-icons/fa';
import useUser from '../hooks/useUser';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/firebase.init';
import toast from 'react-hot-toast';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const [user] = useUser();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        toast.success('Logged out successfully!');
        navigate('/');
    };

    const mainMenuItems = [
        { name: 'Home', path: '/dashboard', icon: <FaHome /> },
        { name: 'My Transactions', path: '/dashboard/my-transactions', icon: <FaList /> },

        { name: 'Add Transaction', path: '/dashboard/add-transaction', icon: <FaPlus /> },
    ];

    const accountItems = [
        { name: 'Profile', path: '/dashboard/profile', icon: <FaUser /> },
        // { name: 'Settings', path: '/dashboard/settings', icon: <FaCog /> }, // Placeholder if needed
    ];

    const NavItem = ({ item }) => {
        const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/dashboard/');
        return (
            <Link
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium mb-1 ${isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10'
                    }`}
            >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-white dark:bg-base-200 border-r border-gray-100 dark:border-gray-800 z-50 transition-transform duration-300 w-72 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static`}
            >
                {/* Logo Area */}
                <div className="p-8 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-black tracking-tight flex items-center gap-2 text-gray-900 dark:text-white">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                            F
                        </div>
                        FinEase
                    </Link>
                    <button onClick={toggleSidebar} className="lg:hidden text-gray-500">
                        <FaTimes />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {/* Main Menu */}
                    <div className="mb-8">
                        <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
                        <nav>
                            {mainMenuItems.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                        </nav>
                    </div>

                    {/* Account Management */}
                    <div>
                        <p className="px-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Account Management</p>
                        <nav>
                            {accountItems.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                            >
                                <span className="text-lg"><FaSignOutAlt /></span>
                                <span>Log out</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* User Profile Snippet (Bottom) */}
                {user && (
                    <div className="p-6 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <FaUser className="w-full h-full p-2 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-gray-900 dark:text-white">{user.displayName || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;
