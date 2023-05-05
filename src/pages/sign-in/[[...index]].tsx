import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8">
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </main>
  );
};

export default SignInPage;
