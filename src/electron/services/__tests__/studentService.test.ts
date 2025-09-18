import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StudentService } from '../studentService.js';
import type { StudentDAO } from '../../db/students.js';
import type { ClassDAO } from '../../db/classes.js';

describe('StudentService', () => {
  let studentService: StudentService;
  let studentDAO: StudentDAO;
  let classDAO: ClassDAO;

  beforeEach(() => {
    // Mock simple des DAO
    studentDAO = {
      add: vi.fn().mockReturnValue(123),
      getById: vi.fn((id: number) => id === 123 ? { id: 123, firstName: 'John', lastName: 'Doe', sex: 'M' } : null),
      update: vi.fn().mockReturnValue(1),
      delete: vi.fn().mockReturnValue(1),
      getWithClassInfo: vi.fn().mockReturnValue([
        { id: 123, firstName: 'John', lastName: 'Doe', sex: 'M', classId: 1, className: 'CM2' }
      ])
    } as any;

    classDAO = {
      getById: vi.fn((id: number) => id === 1 ? { id: 1, name: 'CM2', section: 'A' } : null)
    } as any;

    studentService = new StudentService(studentDAO, classDAO);
  });

  describe('createStudent', () => {
    it('should throw if first or last name is empty', () => {
      expect(() => studentService.createStudent({ firstName: '', lastName: 'Doe', sex: 'M' })).toThrow('First name and last name are required');
      expect(() => studentService.createStudent({ firstName: 'John', lastName: '', sex: 'M' })).toThrow('First name and last name are required');
    });

    it('should throw if class does not exist', () => {
      expect(() => studentService.createStudent({ firstName: 'John', lastName: 'Doe', sex: 'M', classId: 999 }))
        .toThrow('Selected class does not exist');
    });

    it('should create student with valid data', () => {
      const id = studentService.createStudent({ firstName: ' John ', lastName: ' Doe ', sex: 'M', classId: 1 });
      expect(id).toBe(123);
      expect(studentDAO.add).toHaveBeenCalled();
    });
  });

  describe('updateStudent', () => {
    it('should throw if id is missing', () => {
      expect(() => studentService.updateStudent({ firstName: 'John', lastName: 'Doe', sex: 'M' } as any))
        .toThrow('Student ID is required for update');
    });

    it('should throw if student does not exist', () => {
      (studentDAO.getById as any).mockReturnValueOnce(null);
      expect(() => studentService.updateStudent({ id: 999, firstName: 'John', lastName: 'Doe', sex: 'M' }))
        .toThrow('Student not found');
    });

    it('should update existing student', () => {
      expect(() => studentService.updateStudent({ id: 123, firstName: 'Jane', lastName: 'Doe', sex: 'F' }))
        .not.toThrow();
      expect(studentDAO.update).toHaveBeenCalled();
    });
  });

  describe('deleteStudent', () => {
    it('should throw if student does not exist', () => {
      (studentDAO.delete as any).mockReturnValueOnce(0);
      expect(() => studentService.deleteStudent(999)).toThrow('Student not found or could not be deleted');
    });

    it('should delete existing student', () => {
      expect(() => studentService.deleteStudent(123)).not.toThrow();
      expect(studentDAO.delete).toHaveBeenCalledWith(123);
    });
  });

  describe('getStudentWithDetails', () => {
    it('should return student with class info', () => {
      const student = studentService.getStudentWithDetails(123);
      expect(student).not.toBeNull();
      expect(student?.className).toBe('CM2');
    });

    it('should return null if student not found', () => {
      (studentDAO.getWithClassInfo as any).mockReturnValueOnce([]);
      const student = studentService.getStudentWithDetails(999);
      expect(student).toBeNull();
    });
  });
});
