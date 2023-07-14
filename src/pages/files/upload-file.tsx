import { type NextPage } from "next/types";
import Sidebar from "../../components/Sidebar";
import NavTabCollection from "../../components/NavTabCollection";
import { UserButton } from "@clerk/nextjs";
import { api } from "../../utils/api";
import { LoadingSpinner } from "../../components/Loading";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const UploadFile: NextPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto mt-12 px-16">
        <nav className="flex justify-between">
          <div className="mr-2 flex justify-start gap-12">
            <h1 className="mb-6 text-3xl font-bold">Bulk Upload</h1>
            <NavTabCollection currentTabName="Bulk upload messengers" />
          </div>

          <UserButton afterSignOutUrl="/sign-in" showName />
        </nav>

        <UploadFileSection />
      </div>
    </div>
  );
};

export const bulkUploadMessengersFormSchema = z.object({
  fileList: z
    .custom<FileList>()
    .refine(
      (value) => value.length === 1,
      "A file is required to bulk upload messengers"
    ),
  groupId: z.string(),
});

type BulkUploadMessengersFormProps = z.infer<
  typeof bulkUploadMessengersFormSchema
>;

const UploadFileSection = () => {
  const {
    register,
    formState: { isSubmitting, errors },
    handleSubmit,
    watch,
  } = useForm<BulkUploadMessengersFormProps>({
    resolver: zodResolver(bulkUploadMessengersFormSchema),
  });
  const uploadedFileList = watch("fileList");
  const [selectedFileContent, setSelectedFileContent] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        setSelectedFileContent(content);
      };

      reader.readAsText(file);
    }
  };

  const { data: groups, isLoading } = api.groups.getAll.useQuery();
  const { mutate: bulkCreate } = api.messengers.bulkCreate.useMutation({
    onSuccess: () => console.log("success saving messengers"),
    onError: () => console.log("error saving messengers"),
  });

  const onSubmit: SubmitHandler<BulkUploadMessengersFormProps> = (data) => {
    bulkCreate({
      groupId: data.groupId,
      fileContent: selectedFileContent,
    });
  };

  return (
    <div className="flex items-center justify-center p-12">
      <div className="mx-auto w-full max-w-[550px] bg-white">
        <form className="px-9 py-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              Upload .csv file
            </label>

            <div className="mb-8">
              <input
                type="file"
                id="file"
                className="sr-only"
                {...register("fileList")}
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className="relative flex min-h-[200px] items-center justify-center rounded-md border border-dashed border-[#e0e0e0] p-12 text-center"
              >
                <div>
                  {/* <span className="mb-2 block text-xl font-semibold text-[#07074D]">
                    Drop files here
                  </span>
                  <span className="mb-2 block text-base font-medium text-[#6B7280]">
                    Or
                  </span> */}
                  <span className="inline-flex rounded border border-[#e0e0e0] px-7 py-2 text-base font-medium text-[#07074D] hover:cursor-pointer">
                    Browse
                  </span>
                </div>
              </label>
            </div>
            {errors.fileList && (
              <p className="mb-2 mt-2 text-red-500">
                ⚠ {errors.fileList.message?.toString()}
              </p>
            )}

            <div className="mx-auto mt-4 flex max-w-2xl justify-center">
              <p className="mb-2 block cursor-pointer text-sm font-medium text-gray-900 dark:text-gray-400">
                Download template
              </p>
            </div>

            {uploadedFileList && uploadedFileList[0] && (
              <div>
                <p className="text-zinc-400">
                  File uploaded: {uploadedFileList[0].name}
                </p>
              </div>
            )}
            <div className="mx-auto mt-4 max-w-2xl">
              <label
                htmlFor="year"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400"
              >
                Group attribution
              </label>
              {isLoading && (
                <div className="p-4">
                  <LoadingSpinner size={30} />
                </div>
              )}
              {groups && (
                <select
                  id="year"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting}
                  {...register("groupId")}
                >
                  {groups?.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="hover:shadow-form w-full rounded-md bg-cyan-500 px-8 py-3 text-center text-base font-semibold text-white outline-none"
            >
              Send file
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadFile;
