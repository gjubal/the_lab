import { type Dispatch, type SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { type FormProps } from "./FormRoot";
import { CloseSvgButton } from "../../pages/files/groups";

interface FormFooterProps {
  isOpenAddModal?: boolean;
  setIsOpenAddModal?: Dispatch<SetStateAction<boolean>>;
  isOpenEditModal?: boolean;
  setIsOpenEditModal?: Dispatch<SetStateAction<boolean>>;
}

export function FormFooter({
  isOpenAddModal,
  setIsOpenAddModal,
  isOpenEditModal,
  setIsOpenEditModal,
}: FormFooterProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext<FormProps>();

  return (
    <>
      <div className="flex w-full items-center justify-start">
        <button
          type="submit"
          className="rounded bg-cyan-500 px-8 py-2 text-sm text-white transition duration-150 ease-in-out hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Save
        </button>
        <button
          type="button"
          onClick={() =>
            (setIsOpenAddModal && setIsOpenAddModal(false)) ||
            (setIsOpenEditModal && setIsOpenEditModal(false))
          }
          className="ml-3 rounded border  bg-gray-100 px-8 py-2 text-sm text-gray-600 transition duration-150 ease-in-out hover:border-gray-400 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>

      <CloseSvgButton
        isOpenAddModal={isOpenAddModal}
        setIsOpenAddModal={setIsOpenAddModal}
        isOpenEditModal={isOpenEditModal}
        setIsOpenEditModal={setIsOpenEditModal}
      />
    </>
  );
}
