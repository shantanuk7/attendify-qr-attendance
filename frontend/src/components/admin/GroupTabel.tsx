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
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: { username: string; email: string };
  members: string[];
}

interface User {
  _id: string;
  username: string;
  email: string;
}

const GroupTable = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No auth token found.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI!}/admin/get-groups`,
          {
            headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
        );
        setGroups(response.data);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const token = Cookies.get("authToken");
        if (!token) {
          console.error("No auth token found.");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URI!}/admin/get-users`,
          {
            headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
        );
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGroups();
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, users]);

  const handleAddUser = async () => {
    if (!selectedGroupId || !selectedUserId) {
      toast({
        title: "Group ID and User ID are required",
        variant: "destructive",
      });

      return;
    }
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        console.error("No auth token found.");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI!}/admin/add-user-to-group`,
        { groupId: selectedGroupId, userId: selectedUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': '69420'
          } },
      );
      toast({ title: response.data.message, variant: "default" });
      setModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error("Error adding user to group:", error);
      toast({ title: "Failed to add user to group.", variant: "destructive" });
    }
  };

  if (loading) {
    return <div>Loading groups...</div>;
  }

  if (groups.length === 0) {
    return <div>No Groups Available</div>;
  }

  return (
    <>
      <Table className="w-full border">
        <TableCaption>Groups Details</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Add Users</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group._id}>
              <TableCell>{group._id}</TableCell>
              <TableCell>{group.name}</TableCell>
              <TableCell>{group.description || "No Description"}</TableCell>
              <TableCell>
                {group.createdBy.username} ({group.createdBy.email})
              </TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setSelectedGroupId(group._id);
                    setModalOpen(true);
                  }}
                >
                  Add Users
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User to Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Search Users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="max-h-40 overflow-y-auto border p-2">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-2 cursor-pointer ${
                    selectedUserId === user._id ? "bg-blue-200" : ""
                  }`}
                  onClick={() => setSelectedUserId(user._id)}
                >
                  {user.username} ({user.email})
                </div>
              ))}
            </div>
            <Button onClick={handleAddUser}>Add User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GroupTable;
