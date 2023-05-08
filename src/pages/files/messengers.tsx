import type { NextPage } from "next";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { FiTrash } from "react-icons/fi";
import { IoMdCheckmarkCircleOutline, IoMdClose } from "react-icons/io";
import { AiFillWarning } from "react-icons/ai";
import Sidebar from "../../components/Sidebar";
import NavTabCollection from "../../components/NavTabCollection";
import { BsPersonPlus } from "react-icons/bs";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { LoadingPage, LoadingSpinner } from "../../components/Loading";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type MessengerGroup } from "@prisma/client";

type Modal = {
  title: "Account" | "Group";
  type: "individual" | "group";
};

type ModalProps = Modal & {
  isOpenAddModal: boolean;
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
};

const Messengers: NextPage = () => {
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

        <MessengerTable setIsOpenAddModal={setIsOpenAddModal} />

        {isOpenAddModal && (
          <AddModal
            title="Account"
            type="individual"
            isOpenAddModal={isOpenAddModal}
            setIsOpenAddModal={setIsOpenAddModal}
          />
        )}
      </div>
    </div>
  );
};

const MessengerTable = ({
  setIsOpenAddModal,
}: {
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const { data, isLoading } = api.messengers.getAll.useQuery();

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
                      <p>Account name</p>
                      <p>Date added</p>
                      <p>Status</p>
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
                {data?.map((messenger) => (
                  <AccountCell
                    key={messenger.id}
                    id={messenger.id}
                    name={messenger.username}
                    dateAdded={formatDateToString(messenger.createdAt)}
                    status={messenger.status}
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

const AccountCell = (props: {
  id: string;
  name: string;
  dateAdded: string;
  status: string;
}) => {
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  return (
    <>
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
            onClick={() => setIsOpenDeleteModal(true)}
            className="text-red-500"
          >
            <FiTrash />
          </button>
        </div>
      </li>

      {isOpenDeleteModal && (
        <DeleteModal
          id={props.id}
          setIsOpenDeleteModal={setIsOpenDeleteModal}
        />
      )}
    </>
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

const addFormSchema = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 5 characters long" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
  addToGroup: z.boolean(),
  groupName: z.string().optional(),
});

type AddFormProps = z.infer<typeof addFormSchema>;

const AddForm = (props: {
  setIsOpenAddModal: Dispatch<SetStateAction<boolean>>;
  modal: Modal;
  setModal: Dispatch<SetStateAction<Modal>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<AddFormProps>({
    resolver: zodResolver(addFormSchema),
  });
  const [addToGroup, setAddToGroup] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    data: groups,
    isLoading: isLoadingGroups,
    isError: isGetGroupsError,
  } = api.groups.getAll.useQuery();

  const ctx = api.useContext();

  const { mutate } = api.messengers.create.useMutation({
    onSuccess: () => {
      void ctx.messengers.getAll.invalidate();
    },
    onError: () => console.log("error adding messenger"),
  });

  const [selectedGroup, setSelectedGroup] = useState<MessengerGroup | null>(
    null
  );

  const onSubmit: SubmitHandler<AddFormProps> = (data) => mutate(data);

  useEffect(() => {
    if (addToGroup && selectedGroup) {
      setValue("groupName", selectedGroup.name);
    }

    if (!addToGroup) {
      setSelectedGroup(null);
      setValue("groupName", undefined);
    }
  }, [addToGroup, selectedGroup, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1 className="font-lg mb-8 font-bold leading-tight tracking-normal text-gray-800">
        Enter {props.modal.title} Details
      </h1>
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {props.modal.title} username
      </label>
      <input
        className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
        placeholder="sampleaccount1"
        {...register("username")}
        disabled={isSubmitting}
      />
      {errors.username && (
        <p className="mb-2 mt-2 text-red-500">⚠ {errors.username?.message}</p>
      )}
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {props.modal.title} password
      </label>

      <div className="mb-5 mt-2">
        <input
          className="mb-8 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
          placeholder="********"
          type="password"
          {...register("password")}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="mb-2 mt-2 text-red-500">⚠ {errors.password?.message}</p>
        )}
      </div>

      <div className="flex-start mb-5 mt-2 flex items-center gap-2">
        <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
          Add to group?
        </label>

        <div className="flex w-16 items-center justify-center">
          <div className="relative mr-2 inline-block w-10 select-none align-middle">
            <input
              id="addToGroup"
              type="checkbox"
              className="absolute right-4 block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 bg-white outline-none duration-200 ease-in checked:right-0 checked:bg-blue-500 focus:outline-none"
              checked={addToGroup}
              {...register("addToGroup")}
              onChange={(e) => setAddToGroup(e.target.checked)}
              disabled={isSubmitting}
            />
            <label
              htmlFor="addToGroup"
              className="block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300"
            ></label>
          </div>
        </div>
      </div>

      {addToGroup && (
        <div className="mb-5 mt-2 w-full">
          <div className="relative mt-1">
            <button
              type="button"
              className="relative w-full cursor-default rounded-md bg-white py-3 pl-3 pr-10 text-left shadow-lg focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 sm:text-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="flex items-center">
                <span className="ml-3 block truncate">
                  {selectedGroup ? selectedGroup.name : "Select group"}
                </span>
              </span>
            </button>
            {isLoadingGroups ? <DropdownLoadingSpinner /> : <DropdownArrow />}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
                <ul
                  tabIndex={-1}
                  role="listbox"
                  aria-labelledby="listbox-label"
                  aria-activedescendant="listbox-item-3"
                  className="max-h-56 overflow-auto rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                >
                  {groups?.map((group, idx) => (
                    <GroupListItem
                      key={group.id}
                      index={idx}
                      currentGroup={group}
                      selectedGroup={selectedGroup}
                      setSelectedGroup={setSelectedGroup}
                      setIsOpenDropdown={setIsDropdownOpen}
                    />
                  ))}
                  {isGetGroupsError && (
                    <p className="mb-2 mt-2 text-red-500">
                      ⚠ Error retrieving groups
                    </p>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-start">
        <button
          type="submit"
          className="rounded bg-cyan-500 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => props.setIsOpenAddModal(false)}
          className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      <CloseSvgButton setOpenAddModal={props.setIsOpenAddModal} />
    </form>
  );
};

const GroupListItem = (props: {
  index: number;
  currentGroup: MessengerGroup;
  selectedGroup: MessengerGroup | null;
  setSelectedGroup: Dispatch<SetStateAction<MessengerGroup | null>>;
  setIsOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const isSelectedGroup = useMemo(
    () => props.currentGroup.id === props.selectedGroup?.id,
    [props.currentGroup.id, props.selectedGroup?.id]
  );

  return (
    <li
      id={`listbox-item-${props.index}`}
      role="option"
      aria-selected={isSelectedGroup ? "true" : "false"}
      className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-cyan-500 hover:text-white"
      onClick={() => {
        props.setSelectedGroup(props.currentGroup);
        props.setIsOpenDropdown(false);
      }}
    >
      <div className="flex items-center">
        <span className="ml-3 block truncate font-normal">
          {props.currentGroup.name}
        </span>
      </div>

      {isSelectedGroup && <SelectedArrow />}
    </li>
  );
};

const SelectedArrow = () => {
  return (
    <span className="absolute inset-y-0 right-0 flex items-center pr-4">
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        ></path>
      </svg>
    </span>
  );
};

const CloseSvgButton = (props: {
  setOpenAddModal: Dispatch<SetStateAction<boolean>>;
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

const DeleteModal = (props: {
  id: string;
  setIsOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const ctx = api.useContext();

  const { mutate } = api.messengers.deleteById.useMutation({
    onSuccess: () => {
      void ctx.messengers.getAll.invalidate();
    },
    onError: () => {
      console.log("Error deleting messenger");
    },
  });
  const onDeleteMessenger = useCallback(
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
          onClick={() => onDeleteMessenger(props.id)}
          className="text-md ml-2 rounded-md bg-cyan-500 px-7 py-2 text-white"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

const DropdownArrow = () => {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
      <svg
        className="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
          clipRule="evenodd"
        ></path>
      </svg>
    </span>
  );
};

const DropdownLoadingSpinner = () => {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
      <LoadingSpinner size={24} />
    </span>
  );
};

export default Messengers;
