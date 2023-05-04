import type { NextPage } from "next";
import { type Dispatch, type SetStateAction, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { TiFolderDelete } from "react-icons/ti";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { AiFillWarning } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import NavTabCollection from "../../components/NavTabCollection";
import { BsPersonPlus } from "react-icons/bs";
import { UserButton } from "@clerk/nextjs";

type Modal = {
  title: "Account" | "Group";
  type: "individual" | "group";
};

type ModalProps = Modal & {
  isOpenAddModal: boolean;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
};

const Messengers: NextPage = () => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenAddModal, setIsOpenAddModal] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-12 px-16">
        <nav className="flex justify-between">
          <div className="mr-2 flex justify-start gap-12">
            <h1 className="mb-6 text-3xl font-bold">Messengers</h1>
            <NavTabCollection currentTabName="Messengers" />
          </div>

          <UserButton afterSignOutUrl="/sign-in" showName />
        </nav>

        <MessengerTable
          setIsOpenAddModal={setIsOpenAddModal}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
        />

        {isOpenAddModal && (
          <AddModal
            title="Account"
            type="individual"
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
          />
        )}
        {isOpenDeleteModal && (
          <DeleteModal setIsOpenDeleteModal={setIsOpenDeleteModal} />
        )}
      </div>
    </div>
  );
};

const MessengerTable = ({
  setIsOpenDeleteModal,
  setIsOpenAddModal,
}: {
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
}) => {
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
                      <p>Account name</p>
                      <p>Date added</p>
                      <p>Status</p>
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
                  </div>
                </section>
              </header>
              <ul className="flex flex-col divide-y divide-gray-200 bg-white">
                <AccountCell
                  name="sampleaccount1"
                  dateAdded="2021-08-01"
                  status="Active"
                  setIsOpenDeleteModal={setIsOpenDeleteModal}
                />
                <AccountCell
                  name="taterealwrld"
                  dateAdded="2021-08-02"
                  status="Compromised"
                  setIsOpenDeleteModal={setIsOpenDeleteModal}
                />
                <AccountCell
                  name="oraoraora"
                  dateAdded="2021-08-03"
                  status="Inactive"
                  setIsOpenDeleteModal={setIsOpenDeleteModal}
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountCell = (props: {
  name: string;
  dateAdded: string;
  status: "Active" | "Compromised" | "Inactive";
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <li className="mr-2 whitespace-nowrap px-6 py-4" role="cell">
      <div className="flex justify-between">
        <p className="w-[150px]">{props.name}</p>
        <p className="w-[120px]">{props.dateAdded}</p>
        <div className="flex w-[140px] items-center gap-2">
          <p className="">{props.status}</p>
          {props.status === "Active" && (
            <IoMdCheckmarkCircleOutline size={20} color="green" />
          )}
          {props.status === "Compromised" && (
            <AiFillWarning size={20} color="orange" />
          )}
          {props.status === "Inactive" && <IoMdClose size={20} color="red" />}
        </div>
        <button
          type="button"
          onClick={() => props.setIsOpenDeleteModal(true)}
          className="text-red-500"
        >
          <FiTrash />
        </button>
      </div>
    </li>
  );
};

const AddModal = ({
  title,
  type,
  isOpenAddModal,
  setIsOpenAddModal,
}: ModalProps) => {
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
        {props.modal.title} username
      </label>
      <input
        className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
        placeholder="sampleaccount1"
        // {...register("name")}
      />
      {/* {errors.name && (
        <p className="mb-2 mt-2 text-red-500">⚠ {errors.name?.message}</p>
      )} */}
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {props.modal.title} password
      </label>

      <div className="relative mb-5 mt-2">
        <input
          className="mb-8 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
          placeholder="********"
        />
      </div>
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
        setOpenAddModal={props.setIsOpenAddModal}
        modal={props.modal}
        setModal={props.setModal}
      />
    </form>
  );
};

const CloseSvgButton = (props: {
  isOpenAddModal: boolean;
  setOpenAddModal: Dispatch<SetStateAction<boolean>>;
  modal: Modal;
  setModal: Dispatch<SetStateAction<Modal>>;
}) => {
  return (
    <button
      className="absolute right-0 top-0 mr-5 mt-4 cursor-pointer rounded text-gray-400 transition duration-150 ease-in-out hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600"
      aria-label="close modal"
      role="button"
      onClick={() => props.setOpenAddModal(false)}
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

export default Messengers;
