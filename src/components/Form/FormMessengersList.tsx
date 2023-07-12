import { type Messenger } from "@prisma/client";
import { type Dispatch, type SetStateAction, useState, useEffect } from "react";
import { api } from "../../utils/api";
import { LoadingSpinner } from "../Loading";
import { useFormContext } from "react-hook-form";
import { type FormProps } from "./FormRoot";

interface FormMessengersListProps {
  id?: string;
}

export function FormMessengersList({ id }: FormMessengersListProps) {
  const [selectedMessengers, setSelectedMessengers] = useState<Messenger[]>([]);
  const [initialLoad, setInitialLoad] = useState(true);

  const {
    data: messengers,
    isLoading: isLoadingMessengers,
    isError,
  } = api.messengers.getAll.useQuery();

  const { setValue } = useFormContext<FormProps>();

  const { data: group } = api.groups.getGroupById.useQuery({ id: id ?? "" });

  useEffect(() => {
    const messengersIds = selectedMessengers.map((sm) => sm.id);
    setValue("messengersIds", messengersIds);
    console.log(selectedMessengers.map((m) => m.username));
  }, [selectedMessengers, setValue]);

  useEffect(() => {
    if (group && initialLoad) {
      setSelectedMessengers(group.messengers);
      setInitialLoad(false);
    }
  }, [group, id, initialLoad, selectedMessengers, setValue]);

  return (
    <>
      <label className="text-sm font-bold leading-tight tracking-normal text-gray-800">
        Messengers
      </label>

      <div className="container mx-auto mb-6 mt-6 flex h-full max-h-96 w-full flex-col items-center justify-center overflow-y-auto rounded-lg shadow">
        <ul className="divide flex flex-col divide-y">
          {isLoadingMessengers && <LoadingSpinner size={30} />}
          {isError && (
            <p className="mb-2 mt-2 text-red-500">
              ⚠ Error retrieving messengers
            </p>
          )}
          {messengers?.map((messenger) => (
            <MessengerItem
              key={messenger.id}
              messenger={messenger}
              allMessengers={messengers}
              selectedMessengers={selectedMessengers}
              setSelectedMessengers={setSelectedMessengers}
            />
          ))}
        </ul>
      </div>
    </>
  );
}

const MessengerItem = (props: {
  messenger: Messenger;
  allMessengers: Messenger[];
  selectedMessengers: Messenger[];
  setSelectedMessengers: Dispatch<SetStateAction<Messenger[]>>;
}) => {
  const isChecked = props.selectedMessengers.find(
    (sm) => sm.id === props.messenger.id
  );

  const toggleChecked = () => {
    const messengerClicked = props.allMessengers.find(
      (m) => m.id === props.messenger.id
    );

    if (messengerClicked) {
      if (
        !props.selectedMessengers.find((sm) => sm.id === messengerClicked.id)
      ) {
        props.setSelectedMessengers((prevSelectedMessengers) => [
          ...prevSelectedMessengers,
          messengerClicked,
        ]);
      } else {
        props.setSelectedMessengers((prevSelectedMessengers) =>
          prevSelectedMessengers.filter((sm) => sm.id !== messengerClicked.id)
        );
      }
    }
  };

  return (
    <li className="w-96">
      <div className="flex select-none items-center justify-between p-4">
        <div className="mr-16">
          <div className="font-medium">{props.messenger.username}</div>
        </div>
        <input
          type="checkbox"
          name={props.messenger.id}
          id={props.messenger.id}
          checked={!!isChecked}
          onChange={toggleChecked}
        />
      </div>
    </li>
  );
};
