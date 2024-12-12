"use client";

import { useEffect, useState } from "react";
import axios from "axios";
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

type User = {
  username: string;
  email: string;
  password?: string;
};

const User = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [isEditUserOpen, setEditUserOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({ username: "", email: "", password: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get("authToken");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URI}/admin/get-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const token = Cookies.get("authToken");
      await axios.post(`${process.env.NEXT_PUBLIC_API_URI}/admin/create-user`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "User added successfully",
        variant: "default",
      });
      setAddUserOpen(false);
      setFormData({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const token = Cookies.get("authToken");
      await axios.put(`${process.env.NEXT_PUBLIC_API_URI}/admin/update-user/${selectedUser.email}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "User updated successfully",
        variant: "default",
      });
      setEditUserOpen(false);
      setFormData({ username: "", email: "", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async (email: string) => {
    try {
      const token = Cookies.get("authToken");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URI}/admin/delete-user/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "User deleted successfully",
        variant: "default",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setAddUserOpen(true)}>Add User</Button>
      </div>

      <Table className="w-full border">
        <TableCaption>Users List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.email}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({ username: user.username, email: user.email, password: "" });
                    setEditUserOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteUser(user.email)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button onClick={handleAddUser}>Submit</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <Input
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled
            />
            <Input
              placeholder="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Button onClick={handleUpdateUser}>Submit</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default User;
