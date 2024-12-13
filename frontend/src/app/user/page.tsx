'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

const User = () => {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const markAttendance = useCallback(
    async (sessionData: string) => {
      setLoading(true);
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          toast({
            title: 'Authentication token not found.',
            variant: 'destructive',
          });
          return;
        }

        const session = JSON.parse(sessionData);

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URI!}/attendance/mark`,
          {
            sessionId: session.sessionId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: 'Attendance marked successfully!',
          description: `Expiry Time: ${response.data.expiryTime}`,
        });
      } catch (error: any) {
        console.error('Error marking attendance:', error);
        toast({
          title: 'Failed to mark attendance.',
          description: error.response?.data?.error || error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const handleScanSuccess = useCallback(
    async (decodedText: string) => {
      if (decodedText) {
        setScannedData(decodedText);
        await markAttendance(decodedText);
      }
    },
    [markAttendance]
  );

  useEffect(() => {
    if (scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        scannerRef.current.id,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(
        handleScanSuccess,
        (error) => console.warn('QR Code scanning error:', error)
      );

      return () => {
        scanner.clear();
      };
    }
  }, [handleScanSuccess]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h1 className="text-2xl font-bold">Mark Attendance</h1>
      <div
        ref={scannerRef}
        id="reader"
        className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-4"
      />
      <div className="mt-4">
        {loading ? (
          <p className="text-center">Scanning and marking attendance...</p>
        ) : (
          <p className="text-center">
            {scannedData ? `Scanned Data: ${scannedData}` : 'Scan a QR code to mark attendance'}
          </p>
        )}
      </div>
    </div>
  );
};

export default User;
