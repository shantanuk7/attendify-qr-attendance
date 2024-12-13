import Attendance from '@/components/user/Attendance';
import NavbarUser from '@/components/user/NavbarUser';
import React from 'react';

const User = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Navbar */}
      <NavbarUser />

      <div className="container mx-auto mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Attendance</h1>
          <Attendance />
        </div>
      </div>
    </div>
  );
};

export default User;
