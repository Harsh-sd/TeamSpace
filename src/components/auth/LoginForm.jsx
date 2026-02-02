"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
    const router = useRouter();
    //Initial setup of form using validatioan and default values
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

   async function onSubmit(values) {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
       credentials: "include",
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      // backend validation / auth error
      throw new Error(
        data?.message || "Login failed. Please try again."
      );
    }

    console.log("Login success:", data);

    
   
      // ✅ clear form fields
    form.reset();

    //  navigate to dashboard
    router.push("/dashboard");
   

  } catch (error) {
    console.error("Login error:", error.message);
    alert(error.message);
  }
}

    return (

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
         className="space-y-4"
          > 
          {/* Email */}
           <FormField 
                control={form.control} 
                name="email" 
                render={({ field }) => (
             <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl> 
                   <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
             </FormItem>)} />
        {/* Password */}
          <FormField 
                control={form.control} 
                name="password" 
                render={({ field }) => (
             <FormItem> 
                <FormLabel>Password *</FormLabel> 
                <FormControl>
                   <Input type="password" {...field} /> 
                </FormControl> 
                <FormMessage /> 
           </FormItem>)} /> 

           {/*OnSubmit button*/}
                <Button type="submit" className="w-full"> Login </Button>
                {/* Link to signup */}
        <div className="text-center mt-2">
          <span>Don't have an account? </span>
          <Link href="/signup">
            <Button variant="link" size="sm">
              Create one
            </Button>
          </Link>
        </div>
        </form> 
    </Form>
    );
}