'use client';

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/select';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const GroupAttendanceChart = () => {
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]); // Stores groups fetched from the backend
  const [groupId, setGroupId] = useState<string>(''); // Stores selected group ID
  const [error, setError] = useState<string>(''); // For handling errors

  // Fetch available groups
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found.');
          return;
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI!}/admin/get-groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroups(response.data); // Set groups into state
      } catch (error) {
        console.error('Error fetching groups:', error);
        setError('Failed to load groups.');
      }
    };

    fetchGroups();
  }, []);

  // Fetch attendance data when a group is selected
  useEffect(() => {
    if (!groupId) return;

    const fetchGroupAttendance = async () => {
      try {
        const token = Cookies.get('authToken');
        if (!token) {
          console.error('No auth token found.');
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI!}/attendance/group-wise-data/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = response.data.groupAttendance;

        if (data.length === 0) {
          setError('No data found for this group.');
          setAttendanceData(null); // Reset attendance data if no data is found
          return;
        }

        const labels = data.map((item: any) => item.groupName);
        const attendanceCounts = data.map((item: any) => item.attendanceCount);

        setAttendanceData({
          labels,
          datasets: [
            {
              label: 'Attendance Count',
              data: attendanceCounts,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
        setError(''); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching group attendance data:', error);
        setError('Failed to load attendance data.');
      }
    };

    fetchGroupAttendance();
  }, [groupId]);

  return (
    <div>
      <h1>Group-wise Attendance Overview</h1>

      {/* Select Dropdown for Group ID */}
      <Select value={groupId} onValueChange={setGroupId}>
        <SelectTrigger className="mb-2 w-full p-2 border rounded">
          <SelectValue placeholder="Select Group" />
        </SelectTrigger>
        <SelectContent>
          {groups.map((group) => (
            <SelectItem key={group._id} value={group._id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Show error message if available */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Render the Bar chart if data is available */}
      {attendanceData ? (
        <Bar data={attendanceData} />
      ) : (
        groupId && !error && <div>Loading attendance data...</div> // Show loading message when data is being fetched
      )}
    </div>
  );
};

export default GroupAttendanceChart;
