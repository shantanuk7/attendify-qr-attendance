"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jwtDecode } from "jwt-decode";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAttendance = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          setError("No auth token found.");
          setLoading(false);
          return;
        }
        const decodedToken = jwtDecode<{ id: string }>(token);
        const userId = decodedToken.id;
        console.log("User ID: ", userId);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI!}/attendance/user/${userId}`,
          {
            headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
        );

        // Set attendanceData to response data or empty array if no sessions
        setAttendanceData(response.data.sessions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attendance:", error);
        setError("Failed to fetch attendance data.");
        setLoading(false);
      }
    };

    fetchUserAttendance();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
<div className="space-y-4">
    <h1 className="text-2xl font-semibold">Your Attendance</h1>

    {attendanceData && attendanceData.length === 0 ? (
      <p>No sessions found for this user.</p>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Group Name</TableHead>
            <TableHead>Session Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.map((session: any) => (
            <TableRow key={session._id}>
              <TableCell>{session._id}</TableCell>
              <TableCell>{session.groupId.name}</TableCell>
              <TableCell>{new Date(session.expiryTime).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )}
  </div>
  );
};

export default Attendance;
