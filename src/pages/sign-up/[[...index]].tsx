import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <SignUp
        path="/sign-up"
        routing="path"
        signInUrl="/sign-in"
        afterSignUpUrl="/dashboard"
      />
      ;
    </main>
  );
};

export default SignUpPage;
