import type { NextPage } from "next";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useCallback,
} from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { TiFolderDelete } from "react-icons/ti";
import Sidebar from "../../components/Sidebar";
import NavTabCollection from "../../components/NavTabCollection";
import { BsPersonPlus } from "react-icons/bs";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { LoadingPage } from "../../components/Loading";
import { type MessengerGroup } from "@prisma/client";

type Modal = {
  title: "Account" | "Group";
  type: "individual" | "group";
};

type AddModalProps = Modal & {
  isOpenAddModal: boolean;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
};

type EditModalProps = Modal & {
  isOpenEditModal: boolean;
  setIsOpenEditModal: Dispatch<SetStateAction<boolean>>;
};

const Groups: NextPage = () => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-12 px-16">
        <nav className="flex justify-between">
          <div className="mr-2 flex justify-start gap-12">
            <h1 className="mb-6 text-3xl font-bold">Groups</h1>
            <NavTabCollection currentTabName="Groups" />
          </div>

          <UserButton afterSignOutUrl="/sign-in" showName />
        </nav>

        <GroupTable
          setIsOpenDeleteModal={setIsOpenDeleteModal}
          setIsOpenEditModal={setIsOpenEditModal}
          setIsOpenAddModal={setIsOpenAddModal}
        />

        {isOpenAddModal && (
          <AddModal
            title="Group"
            type="group"
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
          />
        )}
        {isOpenEditModal && (
          <EditModal
            title="Group"
            type="group"
            isOpenEditModal={isOpenEditModal}
            setIsOpenEditModal={setIsOpenEditModal}
          />
        )}
        {isOpenDeleteModal && (
          <DeleteModal setIsOpenDeleteModal={setIsOpenDeleteModal} />
        )}
      </div>
    </div>
  );
};

const GroupTable = ({
  setIsOpenAddModal,
  setIsOpenEditModal,
  setIsOpenDeleteModal,
}: {
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenEditModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: groups, isLoading } = api.groups.getAll.useQuery();
  const { data: totalOfGroups } = api.groups.getTotalOfGroups.useQuery();

  const formatDateToString = useCallback((date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${month}-${day}-${year}`;
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <div className="mb-6 mt-8 flex flex-col">
      <div className="mx-auto w-full max-w-5xl">
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
                      <p className="w-[165px]">Group name</p>
                      <p>Date added</p>
                      <p># of accounts</p>
                      <span className="flex gap-3">
                        <button
                          type="button"
                          className="text-cyan-500"
                          onClick={() => setIsOpenAddModal(true)}
                        >
                          <BsPersonPlus size={30} />
                        </button>
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => setIsOpenDeleteModal(true)}
                        >
                          <TiFolderDelete size={30} />
                        </button>
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="flex flex-col divide-y divide-gray-200 bg-white">
                {groups?.map((group: MessengerGroup) => (
                  <GroupCell
                    key={group.id}
                    name={group.name}
                    dateCreated={formatDateToString(group.createdAt)}
                    accountTotal={totalOfGroups ?? -1}
                    setIsOpenEditModal={setIsOpenEditModal}
                    setIsOpenDeleteModal={setIsOpenDeleteModal}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupCell = (props: {
  name: string;
  dateCreated: string;
  accountTotal: number;
  setIsOpenEditModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <td className="mr-2 whitespace-nowrap px-6 py-4" role="cell">
      <div className="flex justify-between">
        <p className="w-[140px]">{props.name}</p>
        <p className="mr-2 flex w-[100px] justify-center">
          {props.dateCreated}
        </p>
        <p className="mr-4 flex w-[40px] justify-center">
          {props.accountTotal}
        </p>
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => props.setIsOpenEditModal(true)}
            className="text-gray-500"
          >
            <FiEdit />
          </button>
          <button
            type="button"
            onClick={() => props.setIsOpenDeleteModal(true)}
            className="text-red-500"
          >
            <FiTrash />
          </button>
        </div>
      </div>
    </td>
  );
};

const AddModal = ({
  title,
  type,
  isOpenAddModal,
  setIsOpenAddModal,
}: AddModalProps) => {
  const [modal, setModal] = useState<Modal>({ title, type });

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gray-700 bg-opacity-50 py-12 transition duration-150 ease-in-out">
      <div role="alert" className="mx-auto mt-8 w-11/12 max-w-lg md:w-2/3">
        <div className="relative rounded border border-gray-400 bg-white px-5 py-8 shadow-md md:px-10">
          {isOpenAddModal && (
            <AddForm
              isOpenAddModal={isOpenAddModal}
              setIsOpenAddModal={setIsOpenAddModal}
              modal={modal}
              setModal={setModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AddForm = (props: {
  isOpenAddModal: boolean;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
  modal: Modal;
  setModal: Dispatch<SetStateAction<Modal>>;
}) => {
  return (
    <form onSubmit={() => console.log("submit")}>
      <h1 className="font-lg mb-8 font-bold leading-tight tracking-normal text-gray-800">
        Enter {props.modal.title} Details
      </h1>
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {props.modal.title} name
      </label>
      <input
        className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
        placeholder="Sample group"
        // {...register("name")}
      />
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        Messengers
      </label>

      <MessengersList />

      <div className="flex w-full items-center justify-start">
        <button
          type="submit"
          className="rounded bg-cyan-500 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => props.setIsOpenAddModal(false)}
          className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>

      <CloseSvgButton
        isOpenAddModal={props.isOpenAddModal}
        setIsOpenAddModal={props.setIsOpenAddModal}
        modal={props.modal}
        setModal={props.setModal}
      />
    </form>
  );
};

const EditForm = (props: {
  isOpenEditModal: boolean;
  setIsOpenEditModal: Dispatch<SetStateAction<boolean>>;
  modal: Modal;
  setModal: Dispatch<SetStateAction<Modal>>;
}) => {
  return (
    <form onSubmit={() => console.log("submit")}>
      <h1 className="font-lg mb-8 font-bold leading-tight tracking-normal text-gray-800">
        Enter {props.modal.title} Details
      </h1>
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {props.modal.title} name
      </label>
      <input
        className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
        placeholder="Sample group"
        // {...register("name")}
      />
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        Messengers
      </label>

      <MessengersList />

      <div className="flex w-full items-center justify-start">
        <button
          type="submit"
          className="rounded bg-cyan-500 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => props.setIsOpenEditModal(false)}
          className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>

      <CloseSvgButton
        isOpenEditModal={props.isOpenEditModal}
        setIsOpenEditModal={props.setIsOpenEditModal}
        modal={props.modal}
        setModal={props.setModal}
      />
    </form>
  );
};

const EditModal = ({
  title,
  type,
  isOpenEditModal,
  setIsOpenEditModal,
}: EditModalProps) => {
  const [modal, setModal] = useState<Modal>({ title, type });

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gray-700 bg-opacity-50 py-12 transition duration-150 ease-in-out">
      <div role="alert" className="mx-auto mt-8 w-11/12 max-w-lg md:w-2/3">
        <div className="relative rounded border border-gray-400 bg-white px-5 py-8 shadow-md md:px-10">
          {isOpenEditModal && (
            <EditForm
              isOpenEditModal={isOpenEditModal}
              setIsOpenEditModal={setIsOpenEditModal}
              modal={modal}
              setModal={setModal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const MessengersList = () => {
  return (
    <div className="container mx-auto mb-6 mt-6 flex h-96 w-full flex-col items-center justify-center overflow-y-auto rounded-lg bg-white shadow dark:bg-gray-800">
      <ul className="divide flex flex-col divide-y">
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
        <MessengerItem />
      </ul>
    </div>
  );
};

const MessengerItem = () => {
  return (
    <li className="w-96">
      <div className="flex select-none items-center justify-between p-4">
        <div className="mr-16">
          <div className="font-medium dark:text-white">Messenger</div>
        </div>
        <input type="checkbox" name="messenger-1" id="1" />
      </div>
    </li>
  );
};

const CloseSvgButton = (props: {
  isOpenAddModal?: boolean;
  isOpenEditModal?: boolean;
  setIsOpenAddModal?: Dispatch<SetStateAction<boolean>>;
  setIsOpenEditModal?: Dispatch<SetStateAction<boolean>>;
  modal: Modal;
  setModal: Dispatch<SetStateAction<Modal>>;
}) => {
  return (
    <button
      className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
      aria-label="close modal"
      role="button"
      onClick={() =>
        (props.isOpenAddModal &&
          props.setIsOpenAddModal &&
          props.setIsOpenAddModal(false)) ||
        (props.isOpenEditModal &&
          props.setIsOpenEditModal &&
          props.setIsOpenEditModal(false))
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-x"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
};

const DeleteModal = ({
  setIsOpenDeleteModal,
}: {
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-slate-800 bg-opacity-50">
      <div className="rounded-md bg-white px-16 py-8 text-center">
        <h1 className="mb-4 text-xl font-bold text-slate-500">
          Are you sure you want to delete the file?
        </h1>
        <button
          type="button"
          onClick={() => setIsOpenDeleteModal(false)}
          className="text-md rounded-md bg-red-500 px-4 py-2 text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => console.log("delete")}
          className="text-md ml-2 rounded-md bg-cyan-500 px-7 py-2 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Groups;
