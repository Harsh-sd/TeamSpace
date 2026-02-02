"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/validators/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();
    //Initial setup of form using validatioan and default values
    const form = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            email: "",
            password: "",
            name:"",
            confirmPassword: "",
        },
    });

  async function onSubmit(values) {
  try {
    // Make POST request to API
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    // Try to parse JSON safely
    let data;
    try {
      data = await res.json();
    } catch (err) {
      // If response is HTML (like 404), show a clear error
      throw new Error(
        "Unexpected response from server. Check API route."
      );
    }

    // Handle backend errors
    if (!res.ok) {
      throw new Error(data?.message || "Signup failed. Please try again.");
    }

    console.log("Signup success:", data);

    // Redirect user to login page after signup
    router.push("/login");
  } catch (error) {
    console.error("Signup error:", error.message);
    alert(error.message); // Or show error in UI
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
             </FormItem>
            )} />
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
           </FormItem>
        )} /> 
           {/* name */}
          <FormField 
                control={form.control} 
                
                name="name" 
                render={({ field }) => (
             <FormItem> 
                <FormLabel>Name *</FormLabel> 
                <FormControl>
                   <Input type="text" {...field} /> 
                </FormControl> 
                <FormMessage /> 
           </FormItem>)} /> 
           {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password *</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Re-enter password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
           {/*OnSubmit button*/}
                <Button type="submit" className="w-full"> Signup </Button>
        </form> 
    </Form>);
}