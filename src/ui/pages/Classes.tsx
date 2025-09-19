import React, { useState, useMemo } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Class } from "../../types/class";
import ClassForm from "../components/ClassForm";
import Modal from "../components/Modal";
import { useClasses } from "../hooks/useClasses";
import { CrudActions } from "../components/CrudActions";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { FaPlus } from "react-icons/fa";

const Classes = () => {
  const { data: classes, loading, error, create, update, remove, load } = useClasses();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editClass, setEditClass] = useState<Class | null>(null);
  const [deleteClass, setDeleteClass] = useState<Class | null>(null);

  const columns: ColumnDef<Class>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Class Name" },
      { accessorKey: "section", header: "Section" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <CrudActions
            item={row.original}
            onEdit={setEditClass}
            onDelete={setDeleteClass}
          />
        ),
      },
    ],
    []
  );

  const handleAdd = async (cls: Class) => {
    try {
      await create(cls);
      setAddModalOpen(false);
    } catch (error) {
      console.error("Failed to add class:", error);
    }
  };

  const handleUpdate = async (cls: Class) => {
    try {
      await update(cls);
      setEditClass(null);
    } catch (error) {
      console.error("Failed to update class:", error);
    }
  };

  const handleDelete = async () => {
    if (deleteClass?.id) {
      try {
        await remove(deleteClass.id);
        setDeleteClass(null);
      } catch (error) {
        console.error("Failed to delete class:", error);
      }
    }
  };

  if (loading && classes.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={load} />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 flex justify-between items-center">
        Classes
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
        <ClassForm onSubmit={handleAdd} onCancel={() => setAddModalOpen(false)} />
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
            onSubmit={handleUpdate}
            onCancel={() => setEditClass(null)}
          />
        )}
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!deleteClass}
        title="Confirm Delete"
        message={`Are you sure you want to delete the class ${deleteClass?.name} ${
          deleteClass?.section ? `(${deleteClass.section})` : ""
        }?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteClass(null)}
        variant="danger"
      />
    </div>
  );
};

export default Classes;
