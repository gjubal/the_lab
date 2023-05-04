import { type NextPage } from "next";
import Head from "next/head";
import ProfilePicture from "../../public/pp.png";
import Image from "next/image";
import { FiPlusCircle } from "react-icons/fi";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";

const Home: NextPage = () => {
  const { isSignedIn } = useAuth();
  return (
    <>
      <Head>
        <title>The Lab</title>
        <meta name="description" content="Project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center gap-16">
        <h1 className="text-5xl font-thin">the lab</h1>

        {isSignedIn ? (
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-zinc-800 hover:bg-white/20"
            href="/dashboard"
          >
            <h3 className="text-2xl font-bold">Go to /dashboard</h3>
          </Link>
        ) : (
          <div className="flex gap-4">
            <SignInButton />
            <SignUpButton />
          </div>
        )}
      </main>
    </>
  );
};

export const ProfileTile = () => (
  <div className="flex flex-col gap-4 rounded-md bg-zinc-200 p-6 shadow-sm">
    <div className="flex items-center gap-6 px-2 py-4">
      <Image
        src={ProfilePicture}
        alt="Profile picture"
        width={96}
        height={96}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="truncate text-sm font-medium text-gray-500">
          master account
        </p>
        <p className="text-3xl font-semibold text-gray-900">gjubal</p>
      </div>
    </div>
    <div className="flex flex-col gap-1 rounded-md bg-gray-300 px-4 py-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">live sub-accounts</p>
        <p className="text-xl font-semibold text-gray-900">500</p>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">posts per account</p>
        <p className="text-xl font-semibold text-gray-900">107</p>
      </div>
    </div>
  </div>
);

export const ActionTile = () => (
  <div className="flex items-center justify-center gap-4 rounded-md bg-zinc-200 p-6 shadow-sm">
    <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-gray-300 p-6">
      <p className="text-md font-thin text-gray-900">Upload media</p>
      <FiPlusCircle size={48} className="text-gray-500" />
    </div>
    <div className="flex flex-col items-center justify-center gap-4 rounded-md bg-gray-300 p-6">
      <p className="text-md font-thin text-gray-900">Add sub account</p>
      <FiPlusCircle size={48} className="text-gray-500" />
    </div>
  </div>
);

export default Home;
