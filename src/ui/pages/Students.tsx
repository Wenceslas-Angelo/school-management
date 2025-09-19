import React, { useState, useEffect, useMemo } from "react";
import Table from "../components/Table";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "../../types/student";
import type { Class } from "../../types/class";
import StudentForm from "../components/StudentForm";
import Modal from "../components/Modal";
import { CrudActions } from "../components/CrudActions";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ErrorMessage } from "../components/ErrorMessage";
import { useStudents } from "../hooks/useStudents";
import { FaPlus } from "react-icons/fa";

const Students = () => {
  const { data: students, loading, error, create, update, remove, load } = useStudents();
  
  const [classes, setClasses] = useState<Class[]>([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  useEffect(() => {
    window.api.classes.getAll().then(setClasses);
  }, []);

  // Optimisation: Map des classes pour éviter le find() dans le render
  const classMap = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach(cls => {
      const label = cls.section ? `${cls.name} ${cls.section}` : cls.name;
      map.set(cls.id!, label);
    });
    return map;
  }, [classes]);

  const columns: ColumnDef<Student>[] = useMemo(() => [
    { accessorKey: "id", header: "ID" },
    { 
      accessorFn: (row) => `${row.firstName} ${row.lastName}`, 
      header: "Name" 
    },
    { 
      accessorFn: (row) => classMap.get(row.classId!) || "-", 
      header: "Class" 
    },
    { accessorKey: "birthDate", header: "Birth Date" },
    { accessorKey: "sex", header: "Sex" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CrudActions 
          item={row.original}
          onEdit={setEditStudent}
          onDelete={setDeleteStudent}
        />
      ),
    },
  ], [classMap]);

  const handleAdd = async (student: Student) => {
    try {
      await create(student);
      setAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add student:', error);
    }
  };

  const handleUpdate = async (student: Student) => {
    try {
      await update(student);
      setEditStudent(null);
    } catch (error) {
      console.error('Failed to update student:', error);
    }
  };

  const handleDelete = async () => {
    if (deleteStudent?.id) {
      try {
        await remove(deleteStudent.id);
        setDeleteStudent(null);
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  if (loading && students.length === 0) {
    return <LoadingSpinner size="lg" />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={load} />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 flex justify-between items-center">
        Students
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
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
          onSubmit={handleAdd}
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
            onSubmit={handleUpdate}
            onCancel={() => setEditStudent(null)}
          />
        )}
      </Modal>

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        isOpen={!!deleteStudent}
        title="Confirm Delete"
        message={`Are you sure you want to delete ${deleteStudent?.firstName} ${deleteStudent?.lastName}?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteStudent(null)}
        variant="danger"
      />
    </div>
  );
};

export default Students;