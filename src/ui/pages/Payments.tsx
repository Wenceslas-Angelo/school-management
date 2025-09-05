import React, { useState } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { PaymentExtended } from "../../types/payment";
import PaymentForm from "../components/PaymentForm";
import Modal from "../components/Modal";
import { usePayments } from "../hooks/usePayments";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Payments = () => {
  const { payments, reload, add, update, remove } = usePayments();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editPayment, setEditPayment] = useState<PaymentExtended | null>(null);
  const [deletePayment, setDeletePayment] = useState<PaymentExtended | null>(
    null
  );

  const columns: ColumnDef<PaymentExtended>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "studentName", header: "Student" },
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
        <div className="flex gap-2">
          <button
            onClick={() => setEditPayment(row.original)}
            className="p-2 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setDeletePayment(row.original)}
            className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

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

      {/* MODAL AJOUT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Payment"
      >
        <PaymentForm
          onSubmit={async (payment) => {
            await add(payment);
            setAddModalOpen(false);
            reload();
          }}
          onCancel={() => setAddModalOpen(false)}
        />
      </Modal>

      {/* MODAL EDIT */}
      <Modal
        isOpen={!!editPayment}
        onClose={() => setEditPayment(null)}
        title="Edit Payment"
      >
        {editPayment && (
          <PaymentForm
            payment={editPayment}
            onSubmit={async (payment) => {
              await update(payment);
              setEditPayment(null);
              reload();
            }}
            onCancel={() => setEditPayment(null)}
          />
        )}
      </Modal>

      {/* MODAL SUPPRESSION */}
      <Modal
        isOpen={!!deletePayment}
        onClose={() => setDeletePayment(null)}
        title="Confirm Delete"
      >
        <p>
          Are you sure you want to delete payment of {deletePayment?.amount} Ar
          for {deletePayment?.studentName} ({deletePayment?.className})?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setDeletePayment(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (deletePayment?.id) {
                await remove(deletePayment.id);
                setDeletePayment(null);
                reload();
              }
            }}
            className="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Payments;
