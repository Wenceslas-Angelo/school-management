import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormInput from "./FormInput";
import type { Class } from "../../types/class";

type ClassFormProps = {
  classItem?: Class;
  onSubmit: (classItem: Class) => void;
  onCancel?: () => void;
};

const ClassForm = ({ classItem, onSubmit, onCancel }: ClassFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Class>({
    defaultValues: classItem || {},
  });

  const submitHandler: SubmitHandler<Class> = (data) => {
    onSubmit({
      ...classItem, // garde id si existant
      ...data,
      name: data.name?.trim(),
      section: data.section || null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <FormInput
        label="Class Name"
        name="name"
        type="text"
        register={register}
        required
        errors={errors}
      />

      <FormInput
        label="Section"
        name="section"
        type="select"
        register={register}
        errors={errors}
        options={[
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "", label: "None" }, // pour collège
        ]}
      />

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          {classItem ? "Update" : "Add"} Class
        </button>
      </div>
    </form>
  );
};

export default ClassForm;
