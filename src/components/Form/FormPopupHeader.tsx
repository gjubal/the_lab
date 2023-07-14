interface FormPopupHeaderProps {
  title: "Account" | "Group";
}

export function FormPopupHeader({ title }: FormPopupHeaderProps) {
  return (
    <h1 className="font-lg mb-8 font-bold leading-tight tracking-normal text-gray-800">
      Enter {title} Details
    </h1>
  );
}
