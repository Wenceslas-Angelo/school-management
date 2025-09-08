import React, { useState } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import AsyncSelect from "react-select/async";
import type { PaymentExtended } from "../../types/payment";
import type { Student } from "../../types/student";

type Option = { value: number; label: string };

type PaymentFormProps = {
  payment?: PaymentExtended;
  onSubmit: (payment: PaymentExtended) => void;
  onCancel?: () => void;
};

const PaymentForm = ({ payment, onSubmit, onCancel }: PaymentFormProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Option | null>(
    payment
      ? {
          value: payment.studentId,
          label: payment.studentName || String(payment.studentId),
        }
      : null
  );
  const {
    register,
    handleSubmit,
    control,
    // setValue,
    formState: { errors },
  } = useForm<PaymentExtended>({
    defaultValues: payment || {
      date: new Date().toISOString().slice(0, 10) as string,
    },
  });

  // Chargement asynchrone des étudiants
  const loadOptions = async (inputValue: string): Promise<Option[]> => {
    if (!inputValue || inputValue.length < 2) return [];
    const results: Student[] = await window.api.students.search(
      inputValue.trim()
    );
    return results.map((s) => ({
      value: s.id as number,
      label: `${s.firstName} ${s.lastName}`,
    }));
  };

  // const defaultStudentOption = useMemo<Option | null>(() => {
  //   if (!payment) return null;
  //   return {
  //     value: payment.studentId,
  //     label: payment.studentName || String(payment.studentId),
  //   };
  // }, [payment]);

  const submitHandler: SubmitHandler<PaymentExtended> = (data) => {
    onSubmit({
      ...payment,
      ...data,
      amount: Number(data.amount),
      months: data.months?.trim() || "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      {/* Student AsyncSelect */}
      <div>
        <label className="block text-sm font-medium mb-1">Student</label>
        <Controller
          control={control}
          name="studentId"
          rules={{ required: true }}
          defaultValue={payment?.studentId || 0}
          render={({ field }) => (
            <AsyncSelect
              cacheOptions
              defaultOptions={false}
              loadOptions={loadOptions}
              value={selectedStudent}
              onChange={(opt) => {
                const v = opt ? (opt as Option).value : 0;
                setSelectedStudent(opt as Option | null); // <-- update UI
                field.onChange(v); // <-- update RHF
              }}
              isClearable
              placeholder="Search student (min 2 chars)..."
            />
          )}
        />
        {errors.studentId && (
          <p className="text-red-500 text-sm mt-1">Student is required</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium mb-1">Amount</label>
        <input
          type="number"
          {...register("amount", { required: true })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">Amount is required</p>
        )}
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          {...register("date", { required: true })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.date && (
          <p className="text-red-500 text-sm mt-1">Date is required</p>
        )}
      </div>

      {/* Months */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Months (ex: 2025-09,2025-10)
        </label>
        <input
          type="text"
          {...register("months", { required: true })}
          className="w-full border rounded px-2 py-1"
        />
        {errors.months && (
          <p className="text-red-500 text-sm mt-1">Months is required</p>
        )}
      </div>

      {/* Buttons */}
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
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          {payment ? "Update" : "Add"} Payment
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
