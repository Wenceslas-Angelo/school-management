import React, { useState, useMemo } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentExtended } from "../../types/payment";
import PaymentForm from "../components/PaymentForm";
import Modal from "../components/Modal";
import { usePayments } from "../hooks/usePayments";
import { CrudActions } from "../components/CrudActions";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { FaPlus } from "react-icons/fa";

const Payments = () => {
  const { data: payments, loading, error, create, update, remove, load } = usePayments();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<PaymentExtended | null>(null);
  const [deletePayment, setDeletePayment] = useState<PaymentExtended | null>(null);

  const columns: ColumnDef<PaymentExtended>[] = useMemo(
    () => [
      { accessorKey: "paymentId", header: "ID" },
      { accessorKey: "firstName", header: "Student" },
      { accessorKey: "className", header: "Class" },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ getValue }) => `${getValue<number>()} Ar`,
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString(),
      },
      { accessorKey: "months", header: "Months Paid" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <CrudActions
            item={row.original}
            onEdit={setEditPayment}
            onDelete={setDeletePayment}
          />
        ),
      },
    ],
    []
  );

  const handleAdd = async (payment: PaymentExtended) => {
    try {
      await create(payment);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add payment:", error);
    }
  };

  const handleUpdate = async (payment: PaymentExtended) => {
    try {
      await update(payment);
      setEditPayment(null);
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  const handleDelete = async () => {
    if (deletePayment?.id) {
      try {
        await remove(deletePayment.id);
        setDeletePayment(null);
      } catch (error) {
        console.error("Failed to delete payment:", error);
      }
    }
  };

  if (loading && payments.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={load} />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 flex justify-between items-center">
        Payments
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          <FaPlus /> Add Payment
        </button>
      </h1>

      <Table data={payments} columns={columns} />

      {/* ADD MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Payment"
      >
        <PaymentForm
          onSubmit={handleAdd}
          onCancel={() => setAddModalOpen(false)}
        />
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={!!editPayment}
        onClose={() => setEditPayment(null)}
        title="Edit Payment"
      >
        {editPayment && (
          <PaymentForm
            payment={editPayment}
            onSubmit={handleUpdate}
            onCancel={() => setEditPayment(null)}
          />
        )}
      </Modal>

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        isOpen={!!deletePayment}
        title="Confirm Delete"
        message={`Are you sure you want to delete payment of ${deletePayment?.amount} Ar for ${deletePayment?.firstName} (${deletePayment?.className})?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletePayment(null)}
        variant="danger"
      />
    </div>
  );
};

export default Payments;
