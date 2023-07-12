import { useFormContext } from "react-hook-form";
import { type FormProps } from "./FormRoot";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

interface FormTextInputProps {
  title: "Account" | "Group";
  id?: string;
}

export function FormTextInput({ title, id }: FormTextInputProps) {
  const [initialLoad, setInitialLoad] = useState(true);
  const {
    register,
    formState: { isSubmitting, errors },
    setValue,
  } = useFormContext<FormProps>();

  const { data: groupData } = api.groups.getGroupById.useQuery({
    id: id ?? "",
  });
  useEffect(() => {
    if (groupData && initialLoad) {
      setValue("name", groupData.name);
      setInitialLoad(false);
    }
  }, [groupData, initialLoad, setValue]);

  return (
    <>
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        {title} name
      </label>
      <input
        className="mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-cyan-700 focus:outline-none"
        placeholder="Sample group"
        {...register("name")}
        disabled={isSubmitting}
      />
      {errors.name && (
        <p className="mb-2 mt-2 text-red-500">⚠ {errors.name?.message}</p>
      )}
    </>
  );
}
