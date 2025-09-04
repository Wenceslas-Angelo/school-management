import React from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

type Option = { value: string; label: string };

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  errors?: FieldErrors;
  options?: Option[]; // si c’est un select
};

const FormInput = ({
  label,
  name,
  type = "text",
  register,
  required,
  errors,
  options,
}: FormInputProps) => {
  const error = errors && errors[name];

  return (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      {type === "select" && options ? (
        <select
          {...register(name, { required })}
          className={`mt-1 block w-full border rounded p-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <option value="">-- Select --</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          {...register(name, { required })}
          className={`mt-1 block w-full border rounded p-2 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}
      {error && (
        <p className="text-red-500 text-xs mt-1">This field is required</p>
      )}
    </div>
  );
};

export default FormInput;
