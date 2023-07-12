import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, type Dispatch, type SetStateAction } from "react";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";

interface FormRootProps {
  children: ReactNode;
  type: "add" | "edit";
  id?: string;
  setIsOpenAddModal?: Dispatch<SetStateAction<boolean>>;
  setIsOpenEditModal?: Dispatch<SetStateAction<boolean>>;
}

export const formSchema = z.object({
  name: z.string().min(4).max(20),
  messengersIds: z.array(z.string()),
});

export type FormProps = z.infer<typeof formSchema>;
type AddFormProps = FormProps;
type EditFormProps = FormProps & { id: string };

type ConditionalFormProps<T extends "add" | "edit"> = T extends "add"
  ? AddFormProps
  : EditFormProps;

export function FormRoot({
  children,
  type,
  id,
  setIsOpenAddModal,
  setIsOpenEditModal,
}: FormRootProps) {
  const methods = useForm<ConditionalFormProps<typeof type>>({
    resolver: zodResolver(formSchema),
  });
  const onAddSubmit: SubmitHandler<AddFormProps> = (data) => create(data);
  const onEditSubmit: SubmitHandler<FormProps> = (data) => {
    if (id) {
      update({
        id,
        name: data.name,
        messengersIds: data.messengersIds,
      });
    }
  };

  const ctx = api.useContext();
  const { mutate: create } = api.groups.create.useMutation({
    onSuccess: () => {
      void ctx.groups.getAll.invalidate();
      setIsOpenAddModal && setIsOpenAddModal(false);
    },
    onError: () => console.log("error adding group"),
  });
  const { mutate: update } = api.groups.update.useMutation({
    onSuccess: () => {
      void ctx.groups.getAll.invalidate();
      void ctx.groups.getGroupById.refetch({ id: id ?? "" });
      setIsOpenEditModal && setIsOpenEditModal(false);
    },
    onError: () => console.log("error updating group"),
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          type === "add" ? onAddSubmit : onEditSubmit
        )}
      >
        {children}
      </form>
    </FormProvider>
  );
}
