'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import QRCode from 'react-qr-code'; // QR Code Generator
import Cookies from 'js-cookie';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupId, setGroupId] = useState('');
  const [expiryTime, setExpiryTime] = useState('');
  const {toast} = useToast()
  const handleCreateSession = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      if (!token) {
        toast({
          title: 'Authentication token not found.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI!}/session/create-session`,
        {
          expiryTime: new Date(expiryTime).toISOString(),
          groupId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const session = response.data.session;
      if (session) {
        // Serialize the session object for QR code
        setQrCode(JSON.stringify(session));
        toast({
          title: 'Session created successfully!',
        });
      } else {
        throw new Error('Session data is invalid.');
      }
  
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Failed to create session.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQRCode = () => {
    setQrCode(null);
    setIsModalOpen(false);
  };

  return (
    <nav className="flex justify-end items-center px-4 py-2 gap-3 shadow-md">
      <div className="flex items-center space-x-4">
        {/* Create Session button */}
        <Button
          className="hidden sm:flex items-center"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          <Plus className="mr-2" /> {loading ? 'Creating...' : 'Create Session'}
        </Button>
        <Button
          className="flex sm:hidden rounded-full"
          onClick={() => setIsModalOpen(true)}
          disabled={loading}
        >
          <Plus />
        </Button>
      </div>

      <div>
        {/* Profile Picture */}
        <Avatar className="border-2 border-gray-900 p-1 rounded-full">
          <AvatarImage src="/profile.jpg" alt="Profile Picture" />
          <AvatarFallback>AN</AvatarFallback>
        </Avatar>
      </div>

      {/* Create Session Modal using ShadCN Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
  {/* DialogTrigger is now used directly as a button */}


  <DialogContent>
    <DialogHeader>
      <DialogTitle>Create Session</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {/* Form to enter groupId and expiryTime */}
      <Input
        type="text"
        placeholder="Group ID"
        value={groupId}
        onChange={(e) => setGroupId(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <Input
        type="datetime-local"
        value={expiryTime}
        onChange={(e) => setExpiryTime(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
    </div>

    <DialogFooter>
      <Button onClick={handleCreateSession}>Submit</Button>
      <Button onClick={() => setIsModalOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      {/* QR Code Modal */}
      {qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h4 className="mb-4 text-xl font-semibold">Session QR Code</h4>
            <QRCode value={qrCode} size={150} />
            <div className="mt-4 flex justify-between items-center">
              <Button onClick={handleDeleteQRCode}>Delete QR Code</Button>
              <Button onClick={() => setIsModalOpen(false)} variant="secondary">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
