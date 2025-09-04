import React, { useState } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "../../types/student";
import StudentForm from "../components/StudentForm";
import Modal from "../components/Modal";
import { useStudents } from "../hooks/useStudents";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Students = () => {
  const { students, reload, add, update, remove } = useStudents();

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  const columns: ColumnDef<Student>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorFn: (row) => `${row.firstName} ${row.lastName}`, header: "Name" },
    { accessorKey: "className", header: "Class" },
    { accessorKey: "birthDate", header: "Birth Date" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => setEditStudent(row.original)}
            className="p-2 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => setDeleteStudent(row.original)}
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
        Students
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaPlus /> Add Student
        </button>
      </h1>

      <Table data={students} columns={columns} />

      {/* MODAL AJOUT */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Student"
      >
        <StudentForm
          onSubmit={async (student) => {
            await add(student);
            setAddModalOpen(false);
            reload();
          }}
          onCancel={() => setAddModalOpen(false)}
        />
      </Modal>

      {/* MODAL EDIT */}
      <Modal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        title="Edit Student"
      >
        {editStudent && (
          <StudentForm
            student={editStudent}
            onSubmit={async (student) => {
              await update(student);
              setEditStudent(null);
              reload();
            }}
            onCancel={() => setEditStudent(null)}
          />
        )}
      </Modal>

      {/* MODAL SUPPRESSION */}
      <Modal
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        title="Confirm Delete"
      >
        <p>
          Are you sure you want to delete {deleteStudent?.firstName}{" "}
          {deleteStudent?.lastName}?
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setDeleteStudent(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (deleteStudent?.id) {
                await remove(deleteStudent.id);
                setDeleteStudent(null);
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

export default Students;
