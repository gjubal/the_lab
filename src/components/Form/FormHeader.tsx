interface FormHeaderProps {
  title: "Account" | "Group";
}

export function FormHeader({ title }: FormHeaderProps) {
  return (
    <h1 className="font-lg mb-8 font-bold leading-tight tracking-normal text-gray-800">
      Enter {title} Details
    </h1>
  );
}
