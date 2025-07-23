import { Label } from "@radix-ui/react-label";
import { Input } from ".././Input";
import { FunctionComponent } from "react";
// import * as React from "react";

type FormInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  id: string;
  label: string;
  isError?: boolean;
  errorMessage?: string | undefined;
  controller?: object;
  isRequired?: boolean;
  helper?: React.ReactNode | React.ReactNode[];
};

export const ContactNumberInput: FunctionComponent<FormInputProps> = ({
  id,
  label,
  controller,
  errorMessage,
  isError,
  isRequired,
  helper,
  ...props
}) => {
  return (
    <div className="col-span-2 flex flex-col items-start gap-0">
      <Label htmlFor={id} className="text-left text-sm font-medium text-gray-700">
        <div
          className={`flex w-fit gap-1 rounded py-0 text-sm font-medium tracking-wide ${
            isError
              ? "text-red-600 group-hover:text-red-600"
              : "group-focus-within:text-primary group-hover:text-primary"
          }`}
        >
          {label}
          {isRequired && <span className="text-red-700">*</span>}
          {helper}
        </div>
      </Label>

      {/* Input wrapper with prefix */}
      <div className="flex w-full gap-2">
        <Input
          {...props}
          {...controller}
          id={id}
          type="tel"
          inputMode="numeric"
          className={`w-full text-sm leading-none font-normal ${
            isError
              ? "dark:bg-destructive ring-offset-background border-red-400 bg-white text-red-600 focus-visible:ring-1 focus-visible:ring-red-600 focus-visible:outline-none dark:text-white"
              : "border-input focus-visible:ring-ring ring-offset-background bg-white text-gray-700 focus-visible:ring-2 focus-visible:outline-none dark:bg-gray-700 dark:text-white"
          }`}
        />
      </div>

      {isError && <div className="mt-1 px-3 text-xs text-red-500">{errorMessage?.toString()}</div>}
    </div>
  );
};
