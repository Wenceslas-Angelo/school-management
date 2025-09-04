import React from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import FormInput from "./FormInput";
import type { PaymentExtended } from "../../types/payment";

type PaymentFormProps = {
  payment?: PaymentExtended;
  onSubmit: (payment: PaymentExtended) => void;
  onCancel?: () => void;
};

const PaymentForm = ({ payment, onSubmit, onCancel }: PaymentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentExtended>({
    defaultValues: payment || { date: new Date().toISOString().slice(0, 10) },
  });

  const submitHandler: SubmitHandler<PaymentExtended> = (data) => {
    onSubmit({
      ...payment,
      ...data,
      amount: Number(data.amount), // cast montant
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <FormInput
        label="Student ID"
        name="studentId"
        type="number"
        register={register}
        required
        errors={errors}
      />
      <FormInput
        label="Amount"
        name="amount"
        type="number"
        register={register}
        required
        errors={errors}
      />
      <FormInput
        label="Date"
        name="date"
        type="date"
        register={register}
        required
        errors={errors}
      />
      <FormInput
        label="Status"
        name="status"
        type="select"
        options={[
          { value: "paid", label: "Paid" },
          { value: "pending", label: "Pending" },
          { value: "late", label: "Late" },
        ]}
        register={register}
        errors={errors}
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
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
        >
          {payment ? "Update" : "Add"} Payment
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;
