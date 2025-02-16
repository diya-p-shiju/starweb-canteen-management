import React, { useState, useEffect } from 'react';
import { Coffee, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  items: { label: string; link: string }[];
  onLabelClick: (label: string) => void;
}

interface UserDetails {
  name: string;
  email: string;
  role: string;
  userCategory?: string;
  credits?: string;
}

const Navbar: React.FC<NavbarProps> = ({ items, onLabelClick }) => {
  const [selected, setSelected] = useState('Menu');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  useEffect(() => {
    // Get user details from localStorage
    const details: UserDetails = {
      name: localStorage.getItem('name') || '',
      email: localStorage.getItem('email') || '',
      role: localStorage.getItem('role') || '',
      userCategory: localStorage.getItem('userCategory') || '',
      credits: localStorage.getItem('credits') || ''
    };
    setUserDetails(details);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <>
      {/* Mobile Menu Button - Only visible on small screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-white shadow-md"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-600" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navbar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        fixed lg:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 
        flex flex-col transition-transform duration-300 ease-in-out z-40
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="rounded-lg bg-teal-500 p-1">
              <Coffee className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold">CAFETERIA CONNECT</span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="py-4 flex flex-col flex-1">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                setSelected(item.label);
                onLabelClick(item.label);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center px-4 py-2 mx-2 rounded-lg transition-colors duration-200
                ${selected === item.label
                  ? 'bg-teal-50 text-teal-600'
                  : 'text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                }`}
            >
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}

          {/* User Details Card */}
          <div className="mt-auto px-4 mb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {userDetails?.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userDetails?.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Role</span>
                  <span className="text-xs font-medium text-gray-900 capitalize">
                    {userDetails?.role}
                  </span>
                </div>
                
                {userDetails?.userCategory && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Category</span>
                    <span className="text-xs font-medium text-gray-900 capitalize">
                      {userDetails.userCategory.replace('_', ' ')}
                    </span>
                  </div>
                )}
                
                {userDetails?.credits && (
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Credits</span>
                    <span className="text-xs font-medium text-gray-900">
                      ₹{userDetails.credits}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center justify-center w-full px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors duration-200"
            >
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;