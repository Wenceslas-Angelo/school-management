import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

type CrudActionsProps<T> = {
  item: T;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
};

export function CrudActions<T>({ item, onEdit, onDelete }: CrudActionsProps<T>) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onEdit(item)}
        className="p-2 bg-yellow-400 rounded hover:bg-yellow-500 text-white transition-colors"
        title="Edit"
      >
        <FaEdit />
      </button>
      <button
        onClick={() => onDelete(item)}
        className="p-2 bg-red-500 rounded hover:bg-red-600 text-white transition-colors"
        title="Delete"
      >
        <FaTrash />
      </button>
    </div>
  );
}