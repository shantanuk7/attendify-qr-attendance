"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Session {
  _id: string;
  name: string;
  description: string;
  createdBy: { username: string; email: string };
  createdAt: string;
}

const SessionTable = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No auth token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI!}/admin/get-sessions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setSessions(response.data.sessions);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (sessions.length === 0) {
    return <div>No Sessions Available</div>;
  }

  return (
    <Table className="w-full border">
      <TableCaption>Sessions Details</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created By</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session._id}>
            <TableCell>{session._id}</TableCell>
            <TableCell>{session.name}</TableCell>
            <TableCell>{session.description || "No Description"}</TableCell>
            <TableCell>
              {session.createdBy.username} ({session.createdBy.email})
            </TableCell>
            <TableCell>{new Date(session.createdAt).toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SessionTable;
