import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const TABS = [
  {
    id: 1,
    name: "Messengers",
    isCurrent: true,
    href: "/files/messengers",
  },
  {
    id: 2,
    name: "Groups",
    isCurrent: false,
    href: "/files/groups",
  },
  {
    id: 3,
    name: "Bulk upload messengers",
    isCurrent: false,
    href: "/files/upload-file",
  },
];

type TabProps = (typeof TABS)[0];

const NavTabCollection = ({
  currentTabName,
}: {
  currentTabName: "Messengers" | "Groups" | "Bulk upload messengers";
}) => {
  const [tabs, setTabs] = useState<TabProps[]>(TABS);

  const changeTab = useCallback(() => {
    setTabs((tabs) =>
      tabs.map((tab) => ({
        ...tab,
        isCurrent: tab.name === currentTabName,
      }))
    );
  }, [currentTabName]);

  useEffect(() => {
    changeTab();
  }, [changeTab]);

  return (
    <div>
      <ul className="flex cursor-pointer gap-1">
        {tabs.map((tab) => (
          <NavTab key={tab.id} tab={tab} />
        ))}
      </ul>
    </div>
  );
};

const NavTab = ({ tab }: { tab: TabProps }) => {
  return (
    <Link href={tab.href}>
      <li
        className={`rounded-t-lg bg-white px-6 py-2 ${
          tab.isCurrent ? `text-cyan-500` : `text-gray-500`
        }`}
      >
        {tab.name}
      </li>
    </Link>
  );
};

export default NavTabCollection;
