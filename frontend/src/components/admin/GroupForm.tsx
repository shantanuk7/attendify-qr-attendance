"use client";

import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required."),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

const GroupForm = () => {
  const { toast } = useToast();
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (values: GroupFormValues) => {
    try {
      const token = Cookies.get("authToken");
      if (!token) {
        toast({
          title: "Authorization Error",
          description: "Please log in to create a group.",
          variant: "destructive",
        });
        return;
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI!}/admin/create-group`,
        values,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: "Group created successfully!",
        description: "Your new group has been added.",
        variant: "default",
      });

      form.reset();
    } catch (error: any) {
      console.error("Error creating group:", error);
      toast({
        title: "Failed to create group!",
        description:
          error.response?.data?.error || "There was an issue while creating the group.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 border rounded-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter group name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter group description (optional)"
                  {...field}
                  className="w-full p-2 border rounded-md"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Create Group
        </Button>
      </form>
    </Form>
  );
};

export default GroupForm;
