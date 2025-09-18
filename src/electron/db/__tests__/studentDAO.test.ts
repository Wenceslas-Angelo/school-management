import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StudentDAO } from '../students.js';
import { ClassDAO } from '../classes.js';
import { DatabaseManager } from '../../config/database.js';
import { MigrationManager } from '../migrations.js';

describe('StudentDAO', () => {
  let studentDAO: StudentDAO;
  let classDAO: ClassDAO;
  let classId: number;

  beforeEach(async () => {
    await MigrationManager.initialize();
    studentDAO = new StudentDAO();
    classDAO = new ClassDAO();
    classId = classDAO.add({ name: 'CM2', section: 'A' });
  });

  afterEach(() => {
    DatabaseManager.close();
  });

  describe('add', () => {
    it('should create a new student', () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        birthDate: '2010-05-15',
        sex: 'M' as const,
        classId
      };

      const id = studentDAO.add(studentData);
      expect(id).toBeTypeOf('number');
      expect(id).toBeGreaterThan(0);
    });

    it('should create student without optional fields', () => {
      const studentData = {
        firstName: 'Jane',
        lastName: 'Smith',
        sex: 'F' as const
      };

      const id = studentDAO.add(studentData);
      const student = studentDAO.getById(id);

      expect(student?.firstName).toBe('Jane');
      expect(student?.classId).toBeUndefined();
    });
  });

  describe('search', () => {
    beforeEach(() => {
      studentDAO.add({ firstName: 'John', lastName: 'Doe', sex: 'M' });
      studentDAO.add({ firstName: 'Jane', lastName: 'Smith', sex: 'F' });
      studentDAO.add({ firstName: 'Bob', lastName: 'Johnson', sex: 'M' });
    });

    it('should search by first name', () => {
      const results = studentDAO.search('John');
      expect(results).toHaveLength(2); // John Doe + Bob Johnson
    });

    it('should search by last name', () => {
      const results = studentDAO.search('Doe');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('John');
    });

    it('should search by full name', () => {
      const results = studentDAO.search('Jane Smith');
      expect(results).toHaveLength(1);
      expect(results[0].firstName).toBe('Jane');
    });

    it('should be case insensitive', () => {
      const results = studentDAO.search('john');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getByClassId', () => {
    it('should return students from specific class', () => {
      const otherClassId = classDAO.add({ name: 'CE2', section: 'B' });

      studentDAO.add({ firstName: 'John', lastName: 'Doe', sex: 'M', classId });
      studentDAO.add({ firstName: 'Jane', lastName: 'Smith', sex: 'F', classId: otherClassId });

      const students = studentDAO.getByClassId(classId);
      expect(students).toHaveLength(1);
      expect(students[0].firstName).toBe('John');
    });
  });
});
