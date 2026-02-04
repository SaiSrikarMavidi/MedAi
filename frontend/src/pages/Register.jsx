import AuthLayout from "../components/ui/AuthLayout";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Register() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-sm text-gray-400">
            Join MediAI for AI-powered healthcare.
          </p>
        </div>

        <div className="space-y-4">
          <Input placeholder="Full Name" />
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          <Input type="password" placeholder="Confirm Password" />
        </div>

        <Button className="w-full">Create Account</Button>

        <p className="text-sm text-gray-400 text-center">
          Already have an account?
          <a href="/login" className="ml-1 text-primary font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}