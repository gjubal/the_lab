import type { NextPage } from "next";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useCallback,
} from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";
import NavTabCollection from "../../components/NavTabCollection";
import { BsPersonPlus } from "react-icons/bs";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { LoadingPage, LoadingSpinner } from "../../components/Loading";
import { type Messenger } from "@prisma/client";
import { Form } from "../../components/Form";

export type Modal = {
  title: "Account" | "Group";
  type: "individual" | "group";
};

type AddModalProps = Modal & {
  isOpenAddModal: boolean;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
};

type EditModalProps = Modal & {
  id: string;
  isOpenEditModal: boolean;
  setIsOpenEditModal: Dispatch<SetStateAction<boolean>>;
};

const Groups: NextPage = () => {
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

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

        <GroupTable setIsOpenAddModal={setIsOpenAddModal} />

        {isOpenAddModal && (
          <AddModal
            title="Group"
            type="group"
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
          />
        )}
      </div>
    </div>
  );
};

const GroupTable = ({
  setIsOpenAddModal,
}: {
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data: groups, isLoading } = api.groups.getAll.useQuery({
    includeMessengers: true,
  });

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
            <div className="min-w-full divide-y divide-gray-200">
              <header className="bg-gray-50">
                <section>
                  <div className="group px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <div className="flex items-center justify-between">
                      <p className="w-[165px]">Group name</p>
                      <p>Date added</p>
                      <p># of accounts</p>
                      <button
                        type="button"
                        className="text-cyan-500"
                        onClick={() => setIsOpenAddModal(true)}
                      >
                        <BsPersonPlus size={30} />
                      </button>
                    </div>
                  </div>
                </section>
              </header>
              <ul className="flex flex-col divide-y divide-gray-200 bg-white">
                {groups?.map((group) => (
                  <GroupCell
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    dateCreated={formatDateToString(group.createdAt)}
                    messengers={group.messengers}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GroupCell = (props: {
  id: string;
  name: string;
  dateCreated: string;
  messengers?: Messenger[];
}) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  return (
    <>
      <div className="mr-2 whitespace-nowrap px-6 py-4" role="cell">
        <div className="flex justify-between">
          <p className="w-[140px]">{props.name}</p>
          <p className="mr-2 flex w-[100px] justify-center">
            {props.dateCreated}
          </p>
          <div className="mr-4 flex w-[40px] justify-center">
            {props.messengers?.length ?? <LoadingSpinner />}
          </div>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setIsOpenEditModal(true)}
              className="text-gray-500"
            >
              <FiEdit />
            </button>
            <button
              type="button"
              onClick={() => setIsOpenDeleteModal(true)}
              className="text-red-500"
            >
              <FiTrash />
            </button>
          </div>
        </div>
      </div>

      {isOpenEditModal && (
        <EditModal
          id={props.id}
          title="Group"
          type="group"
          isOpenEditModal={isOpenEditModal}
          setIsOpenEditModal={setIsOpenEditModal}
        />
      )}
      {isOpenDeleteModal && (
        <DeleteModal
          id={props.id}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
        />
      )}
    </>
  );
};

const AddModal = ({ isOpenAddModal, setIsOpenAddModal }: AddModalProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gray-700 bg-opacity-50 py-12 transition duration-150 ease-in-out">
      <div role="alert" className="mx-auto mt-8 w-11/12 max-w-lg md:w-2/3">
        <div className="relative rounded border border-gray-400 bg-white px-5 py-8 shadow-md md:px-10">
          {isOpenAddModal && (
            <Form.Root type="add" setIsOpenAddModal={setIsOpenAddModal}>
              <Form.Header title="Group" />
              <Form.TextInput title="Group" />
              <Form.MessengersList />
              <Form.Footer
                isOpenAddModal={isOpenAddModal}
                setIsOpenAddModal={setIsOpenAddModal}
              />
            </Form.Root>
          )}
        </div>
      </div>
    </div>
  );
};

const EditModal = ({
  id,
  isOpenEditModal,
  setIsOpenEditModal,
}: EditModalProps) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-gray-700 bg-opacity-50 py-12 transition duration-150 ease-in-out">
      <div role="alert" className="mx-auto mt-8 w-11/12 max-w-lg md:w-2/3">
        <div className="relative rounded border border-gray-400 bg-white px-5 py-8 shadow-md md:px-10">
          {isOpenEditModal && (
            <Form.Root
              type="edit"
              id={id}
              setIsOpenEditModal={setIsOpenEditModal}
            >
              <Form.Header title="Group" />
              <Form.TextInput title="Group" id={id} />
              <Form.MessengersList id={id} />
              <Form.Footer
                isOpenEditModal={isOpenEditModal}
                setIsOpenEditModal={setIsOpenEditModal}
              />
            </Form.Root>
          )}
        </div>
      </div>
    </div>
  );
};

export const CloseSvgButton = (props: {
  isOpenAddModal?: boolean;
  isOpenEditModal?: boolean;
  setIsOpenAddModal?: Dispatch<SetStateAction<boolean>>;
  setIsOpenEditModal?: Dispatch<SetStateAction<boolean>>;
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

const DeleteModal = (props: {
  id: string;
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const ctx = api.useContext();

  const { mutate } = api.groups.delete.useMutation({
    onSuccess: () => {
      void ctx.groups.getAll.invalidate();
    },
    onError: () => {
      console.log("error deleting group");
    },
  });
  const onDeleteGroup = useCallback(
    (id: string) => {
      mutate({
        id,
      });
      props.setIsOpenDeleteModal(false);
    },
    [mutate, props]
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-slate-800 bg-opacity-50">
      <div className="rounded-md bg-white px-16 py-8 text-center">
        <h1 className="mb-4 text-xl font-bold text-slate-500">
          Are you sure you want to delete the file?
        </h1>
        <button
          type="button"
          onClick={() => props.setIsOpenDeleteModal(false)}
          className="text-md rounded-md bg-red-500 px-4 py-2 text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onDeleteGroup(props.id)}
          className="text-md ml-2 rounded-md bg-cyan-500 px-7 py-2 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Groups;
