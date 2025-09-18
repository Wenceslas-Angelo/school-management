import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { ClassDAO } from "../classes.js";
import { TestDB } from "./../../test/testDB.js";

describe("ClassDAO", () => {
  let classDAO: ClassDAO;
  let testDB: TestDB;

  beforeEach(async () => {
    testDB = new TestDB();
    await testDB.init(); // migrations en mémoire
    classDAO = new ClassDAO(testDB.db);
  });

  afterEach(() => {
    testDB.close();
  });

  describe("add", () => {
    it("should create a new class", () => {
      const classData = { name: "CM2", section: null };
      const id = classDAO.add(classData);

      expect(id).toBeTypeOf("number");
      expect(id).toBeGreaterThan(0);
    });

    it("should prevent duplicate class+section", () => {
      const classData = { name: "CM2", section: null };
      classDAO.add(classData);

      expect(() => classDAO.add(classData)).toThrow();
    });
  });

  describe("getAll", () => {
    it("should return all classes ordered by name", () => {
      classDAO.add({ name: "CE2", section: "B" });
      classDAO.add({ name: "CM1", section: "A" });
      classDAO.add({ name: "CE2", section: "A" });

      const classes = classDAO.getAll();

      expect(classes).toHaveLength(3);
      expect(classes[0].name).toBe("CE2");
      expect(classes[0].section).toBe("A");
      expect(classes[1].name).toBe("CE2");
      expect(classes[1].section).toBe("B");
    });
  });

  describe("update", () => {
    it("should update existing class", () => {
      const id = classDAO.add({ name: "CM2", section: "A" });
      const changes = classDAO.update({ id, name: "CM2", section: "B" });

      expect(changes).toBe(1);

      const updated = classDAO.getById(id);
      expect(updated?.section).toBe("B");
    });
  });

  describe("delete", () => {
    it("should delete existing class", () => {
      const id = classDAO.add({ name: "CM2", section: "A" });
      const deleted = classDAO.delete(id);

      expect(deleted).toBe(1);
      expect(classDAO.getById(id)).toBeUndefined();
    });
  });

  describe("getWithStudentCount", () => {
    it("should return classes with student count", () => {
      const classId = classDAO.add({ name: "CM2", section: "A" });
      const classes = classDAO.getWithStudentCount();

      expect(classes).toHaveLength(1);
      expect(classes[0].studentCount).toBe(0);
      expect(classes[0].id).toBe(classId);
    });
  });
});
