"use client";

import CardWrapper from "./cardWrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RegisterSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URI!}/auth/signup`,
        data,{
          headers:{
            "Content-Type":"application/json"
          }
        }
      );
      const { token, role } = response.data;

      if (!token) {
        toast({
          title: "Token Error",
          description: "Token not generated. Please contact support.",
          variant: "destructive",
        });
        return;
      }

      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "Strict",
      });

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "user") {
        router.push("/user");
      } else {
        toast({
          title: "Unexpected Role",
          description: "Unexpected role. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (error: any) {

      if (error.response) {
        const { status, data } = error.response;

        console.log(error.response);
        

        if (status === 403) {
          toast({
            title: "Signup Error",
            description:
              data.message || "User already exists. Please try signing in.",
            variant: "destructive",
          });
        } else if (status === 500) {
          toast({
            title: "Server Error",
            description:
              data.message || "Server error. Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unknown Error",
            description:
              data.message || "An unknown error occurred. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        console.log(error);
        
        toast({
          title: "Network Error",
          description: "Please check your internet connection.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      label="Create an account"
      title="Register"
      backButtonHref="/auth/signin"
      backButtonLabel="Already have an account? Sign in here."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@gmail.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Loading..." : "Sign Up"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignUpForm;
