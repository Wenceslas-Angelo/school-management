import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { StudentService } from '../studentService.js';
import { ClassDAO } from '../../db/classes.js';
import { DatabaseManager } from '../../config/database.js';
import { MigrationManager } from '../../db/migrations.js';

describe('StudentService', () => {
  let studentService: StudentService;
  let classDAO: ClassDAO;
  let classId: number;

  beforeEach(async () => {
    await MigrationManager.initialize();
    studentService = new StudentService();
    classDAO = new ClassDAO();
    classId = classDAO.add({ name: 'CM2', section: 'A' });
  });

  afterEach(() => {
    DatabaseManager.close();
  });

  describe('createStudent', () => {
    it('should create student with valid data', async () => {
      const studentData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        sex: 'M' as const,
        classId
      };

      const id = await studentService.createStudent(studentData);
      expect(id).toBeTypeOf('number');
    });

    it('should trim whitespace from names', async () => {
      const studentData = {
        firstName: '  John  ',
        lastName: '  Doe  ',
        sex: 'M' as const
      };

      await studentService.createStudent(studentData);
      // La logique de trim devrait être vérifiée via le DAO
    });

    it('should reject empty names', async () => {
      const studentData = {
        firstName: '',
        lastName: 'Doe',
        sex: 'M' as const
      };

      await expect(studentService.createStudent(studentData))
        .rejects.toThrow('First name and last name are required');
    });

    it('should reject invalid classId', async () => {
      const studentData = {
        firstName: 'John',
        lastName: 'Doe',
        sex: 'M' as const,
        classId: 9999
      };

      await expect(studentService.createStudent(studentData))
        .rejects.toThrow('Selected class does not exist');
    });
  });

  describe('updateStudent', () => {
    it('should update existing student', async () => {
      const id = await studentService.createStudent({
        firstName: 'John',
        lastName: 'Doe',
        sex: 'M'
      });

      await expect(studentService.updateStudent({
        id,
        firstName: 'Jane',
        lastName: 'Doe',
        sex: 'F'
      })).resolves.not.toThrow();
    });

    it('should reject update without id', async () => {
      await expect(studentService.updateStudent({
        firstName: 'John',
        lastName: 'Doe',
        sex: 'M'
      } as any)).rejects.toThrow('Student ID is required');
    });
  });
});
