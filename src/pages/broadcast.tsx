import type { NextPage } from "next";
import Sidebar from "../components/Sidebar";

const Broadcast: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-12 px-16">
        <nav className="mb-6 flex flex-col items-center justify-between sm:flex-row">
          <h1 className="mb-3 text-3xl font-bold md:mb-0">Broadcast</h1>
        </nav>

        <BroadcastMediaSection />
      </div>
    </div>
  );
};

const BroadcastMediaSection = () => {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <form className="px-9 py-6" method="POST">
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              Upload media file
            </label>

            <div className="mb-8">
              <input type="file" name="file" id="file" className="sr-only" />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                    Drop file here
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">
                    Or
                  </span>
                  <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D]">
                    Browse
                  </span>
                </div>
              </label>
            </div>

            <div className="mx-auto mt-4 max-w-2xl">
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Group selection
              </label>
              <select
                id="year"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="2022" selected>
                  Sample group 1
                </option>
                <option value="2023">Sample group 2</option>
              </select>
            </div>
          </div>

          <div>
            <button className="hover:shadow-form w-full rounded-md bg-cyan-500 px-8 py-3 text-center text-base font-semibold text-white outline-none">
              Send file
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Broadcast;
