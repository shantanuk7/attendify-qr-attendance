"use client";
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
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface Session {
  _id: string;
  createdBy: { username: string; email: string };
  createdAt: string;
  groupId: { name: string } | null;
}

interface Attendee {
  _id: string;
  username: string;
  email: string;
}

const SessionTable = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Attendee[] | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          `${process.env.NEXT_PUBLIC_API_URI!}/session/get-sessions`,
          {
            headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
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

  const handleSessionClick = async (sessionId: string) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found.");
        return;
      }
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URI!}/attendance/${sessionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
        
      );
      setSelectedSession(response.data.attendances);
      console.log(selectedSession)
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  if (loading) {
    return <div>Loading sessions...</div>;
  }

  if (sessions.length === 0) {
    return <div>No Sessions Available</div>;
  }

  return (
    <div>
      <Table className="w-full border">
        <TableCaption>Sessions Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session._id}>
              <TableCell>
                <Button onClick={() => handleSessionClick(session._id)}>
                  {session._id}
                </Button>
              </TableCell>
              <TableCell>
                {session.createdBy.username} ({session.createdBy.email})
              </TableCell>
              <TableCell>
                {session.groupId ? session.groupId.name : "No group"}
              </TableCell>
              <TableCell>
                {new Date(session.createdAt).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attendees</DialogTitle>
              <DialogDescription>
                {selectedSession && selectedSession.length > 0
                  ? "List of attendees for the session:"
                  : "No attendance records found."}
              </DialogDescription>
            </DialogHeader>
            {selectedSession && (
              <div>
                {selectedSession.map((attendee ,idx) => (
                  <div key={attendee._id}>
                    {idx+1 + ") "} {attendee.username} ({attendee.email})
                  </div>
                ))}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SessionTable;
