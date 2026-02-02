import SignupForm from "@/components/auth/SignupForm";

export default function signupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md rounded-lg border p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-semibold">
          Signup
        </h1>
<SignupForm/>
     
      </div>
    </div>
  );
}
