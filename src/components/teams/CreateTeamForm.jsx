"use client";
import {createTeamSchema} from "@/lib/validators/auth"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";


export default function CreateTeamForm({ onSuccess }){
    const router=useRouter();
const form =useForm({
    resolver:zodResolver(createTeamSchema),
     defaultValues: {
           name: "",
        },
});
async  function onSubmit(values){
     try {
        const res = await fetch("/api/team/create", {
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
        data?.message || "Team not formed. Please try again."
      );
    }
      console.log("Team success:", data);
// ✅ clear form fields
    form.reset();
    onSuccess?.();
    //  navigate to dashboard
    router.push("/dashboard");
     } catch (error) {
        console.error(" error:", error.message);
    alert(error.message);
     }
}
return(
   <Form {...form}>
      <form
      onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                 {/* Team Name */}
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
                      <Button type="submit" className="w-full"> Create Team </Button>


      </form>
   </Form>
);

}
