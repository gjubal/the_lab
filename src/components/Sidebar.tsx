import { AiTwotoneExperiment } from "react-icons/ai";
import { FiClipboard } from "react-icons/fi";
import { BiHome } from "react-icons/bi";
import { BsBroadcast } from "react-icons/bs";
import { type ReactElement } from "react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex min-h-screen w-60 flex-col bg-white p-3 shadow">
      <div className="space-y-3">
        <div className="mt-4 flex items-center justify-center gap-2">
          <AiTwotoneExperiment size={30} />
          <h2 className="text-xl font-bold">viral lab</h2>
        </div>
        <div className="flex">
          <ul className="w-full space-y-1 pb-4 pt-2 text-sm">
            <SidebarOption
              title="Home"
              linkHref="/dashboard"
              icon={<BiHome size={26} />}
            />
            <SidebarOption
              title="Broadcast"
              linkHref="/broadcast"
              icon={<BsBroadcast size={26} />}
            />
            <SidebarOption
              title="Messengers"
              linkHref="/files/messengers"
              icon={<FiClipboard size={26} />}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

const SidebarOption = (props: {
  title: string;
  linkHref: string;
  icon: ReactElement;
}) => {
  return (
    <li className="rounded-lg hover:bg-cyan-400">
      <Link
        href={props.linkHref}
        className="flex items-center space-x-3 rounded-md p-2 text-gray-600 hover:text-white"
      >
        {props.icon}
        <span>{props.title}</span>
      </Link>
    </li>
  );
};
