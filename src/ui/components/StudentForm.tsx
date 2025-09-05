import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormInput from "./FormInput";
import type { Student } from "../../types/student";
import type { Class } from "../../types/class";

type StudentFormProps = {
  student?: Student;
  onSubmit: (student: Student) => void;
  onCancel?: () => void;
};

const StudentForm = ({ student, onSubmit, onCancel }: StudentFormProps) => {
  const {
    register,
    handleSubmit,
    // setValue,
    formState: { errors },
  } = useForm<Student>({
    defaultValues: student || {},
  });

  const [classes, setClasses] = useState<Class[]>([]);

  // Charger les classes pour le select
  useEffect(() => {
    window.api.classes.getAll().then(setClasses);
  }, []);

  const submitHandler: SubmitHandler<Student> = (data) => {
    onSubmit({
      ...student, // garde id & createdAt si existant
      ...data,
      birthDate: data.birthDate || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <FormInput
        label="First Name"
        name="firstName"
        register={register}
        required
        errors={errors}
      />
      <FormInput
        label="Last Name"
        name="lastName"
        register={register}
        required
        errors={errors}
      />
      <FormInput
        label="Birth Date"
        name="birthDate"
        type="date"
        register={register}
        errors={errors}
      />
      <FormInput
        label="Sex"
        name="sex"
        type="select"
        register={register}
        required
        errors={errors}
        options={[
          { value: "M", label: "Male" },
          { value: "F", label: "Female" },
        ]}
      />
      <FormInput
        label="Class"
        name="classId"
        type="select"
        register={register}
        required
        errors={errors}
        options={classes.map((cls) => ({
          value: cls.id.toString(),
          label: cls.section ? `${cls.name} ${cls.section}` : cls.name,
        }))}
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
          {student ? "Update" : "Add"} Student
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
