import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";
import ChartImage from "../../public/fc3noor2.png";
import Image from "next/image";
import { ProfileTile, ActionTile } from ".";
import { UserButton } from "@clerk/nextjs";

const Dashboard: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-12 px-16">
        <nav className="mb-6 flex items-center justify-between sm:flex-row">
          <h1 className="mb-3 text-3xl font-bold md:mb-0">Dashboard</h1>

          <UserButton afterSignOutUrl="/sign-in" showName />
        </nav>

        <MainFromAlvaro />
      </div>
    </div>
  );
};

const MainFromAlvaro = () => (
  <main className="mt-8 flex min-h-screen flex-col items-center">
    <header className="flex gap-4">
      <ProfileTile />
      <ActionTile />
    </header>
    <section className="mt-6 flex w-full max-w-2xl flex-col gap-3">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-thin text-gray-900">Engagement Chart</h1>
        <p className="text-md font-thin text-gray-400">day/week/month/year</p>
      </header>
      <ChartCard />
    </section>
  </main>
);

const Card = (props: { title: string; value: string; subtitle?: string }) => {
  return (
    <div className="w-full rounded-lg bg-white px-4 py-5 shadow">
      <div className="truncate text-sm font-medium text-gray-500">
        {props.subtitle ? (
          <p>
            {props.title}: {props.subtitle}
          </p>
        ) : (
          <p>{props.title}</p>
        )}
      </div>
      <div className="mt-1 text-3xl font-semibold text-gray-900">
        {props.value}
      </div>
    </div>
  );
};

const ChartCard = () => {
  return (
    <div className="w-full rounded-lg bg-white px-4 py-5 shadow lg:col-span-4">
      {/* <div className="text-sm font-medium text-gray-500 truncate">Chart</div> */}
      <Image
        src={ChartImage}
        alt="Chart"
        className="mt-1 text-3xl font-semibold text-gray-900"
        width={900}
        height={500}
      />
    </div>
  );
};

const CategoryTable = () => {
  return (
    <div className="mb-6 mt-4 flex flex-col">
      <div className="-mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    <div className="flex items-center justify-between">
                      <p>Category</p>
                      <p>Total spent</p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="flex flex-col divide-y divide-gray-200 bg-white">
                <CategoryCell name="Eating Out" value={366.9} />
                <CategoryCell name="Gas" value={150.07} />
                <CategoryCell name="Groceries" value={223.82} />
                <CategoryCell name="Living" value={1881.25} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryCell = (props: { name: string; value: number }) => {
  return (
    <td className="whitespace-nowrap px-6 py-4" role="cell">
      <div className="flex justify-between">
        <p>{props.name}</p>
        <p>${props.value}</p>
      </div>
    </td>
  );
};

export default Dashboard;
