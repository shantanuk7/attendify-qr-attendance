"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Scan from '@/components/user/Scan';

const NavbarUser = () => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const router = useRouter();

  // Logout Functionality
  const handleLogout = () => {
    // Remove authToken from cookies
    Cookies.remove('authToken');
    
    // Redirect to login or home page after logout
    router.push('/auth/signin');
  };

  return (
    <nav className="flex justify-between items-center px-4 py-2 gap-3 shadow-md">
      {/* Attendify on the left */}
      <div className="flex-shrink-0 text-xl font-semibold">
        Attendify
      </div>

      {/* Navbar Items */}
      <div className="flex items-center space-x-4 ml-auto">
        {/* Scan Button */}
        <Button
          className="flex items-center"
          onClick={() => setIsScanModalOpen(true)} // Open Scan Modal
        >
          Scan
        </Button>


        {/* Logout Button */}
        <Button
          className="text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
        {/* Profile Picture */}
        <Avatar className="border-solid border-gray-900 p-1 rounded-full">
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
      </div>

      {/* Scan Modal */}
      {isScanModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="mb-4 text-xl font-semibold">Scan QR Code</h4>
            <Scan />  {/* Scan Component */}
            <div className="mt-4 flex justify-between items-center">
              <Button onClick={() => setIsScanModalOpen(false)} variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarUser;
