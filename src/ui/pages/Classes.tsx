import React, { useState } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Class } from "../../types/class";
import ClassForm from "../components/ClassForm";
import Modal from "../components/Modal";
import { useClasses } from "../hooks/useClasses";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Classes = () => {
  const { classes, reload, add, update, remove } = useClasses();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [deleteClass, setDeleteClass] = useState<Class | null>(null);

  const columns: ColumnDef<Class>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Class Name" },
    { accessorKey: "section", header: "Section" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditClass(row.original)}
            className="p-2 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setDeleteClass(row.original)}
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
        Classes
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaPlus /> Add Class
        </button>
      </h1>

      <Table data={classes} columns={columns} />

      {/* MODAL AJOUT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Class"
      >
        <ClassForm
          onSubmit={async (classItem) => {
            await add(classItem);
            setAddModalOpen(false);
            reload();
          }}
          onCancel={() => setAddModalOpen(false)}
        />
      </Modal>

      {/* MODAL EDIT */}
      <Modal
        isOpen={!!editClass}
        onClose={() => setEditClass(null)}
        title="Edit Class"
      >
        {editClass && (
          <ClassForm
            classItem={editClass}
            onSubmit={async (classItem) => {
              await update(classItem);
              setEditClass(null);
              reload();
            }}
            onCancel={() => setEditClass(null)}
          />
        )}
      </Modal>

      {/* MODAL SUPPRESSION */}
      <Modal
        isOpen={!!deleteClass}
        onClose={() => setDeleteClass(null)}
        title="Confirm Delete"
      >
        <p>
          Are you sure you want to delete the class {deleteClass?.name}{" "}
          {deleteClass?.section ? `(${deleteClass.section})` : ""}?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setDeleteClass(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (deleteClass?.id) {
                await remove(deleteClass.id);
                setDeleteClass(null);
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

export default Classes;
