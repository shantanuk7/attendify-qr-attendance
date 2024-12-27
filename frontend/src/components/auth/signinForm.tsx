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
import { LoginSchema } from "@/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useToast } from "@/hooks/use-toast";
const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URI!}/auth/signin`, data,{
        headers:{
          "Content-Type":"application/json"
        }
      });
      const { token, role } = response.data;
      console.log(token, role);
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Authentication token missing. Please try again.",
          variant: "destructive",
        });
        return;
      }
  
      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "Strict" });
  
      if (role === "admin") {
        router.push("/admin");
      } else if (role === "user") {
        console.log("Pushing to /user");
        
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
  
        if (status === 401) {
          toast({
            title: "Invalid Credentials",
            description: data.message || "Invalid credentials. Please try again.",
            variant: "destructive",
          });
        } else if (status === 500) {
          toast({
            title: "Server Error",
            description: data.message || "Server error. Please try again later.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unknown Error",
            description: data.message || "An unknown error occurred. Please try again.",
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
      console.log("done login");
      
      setLoading(false);
    }
  };

  const { pending } = useFormStatus();
  return (
    <CardWrapper
      label="Login to your account"
      title="Login"
      backButtonHref="/auth/signup"
      backButtonLabel="Don't have an account? SignUp here."
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
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignInForm;
