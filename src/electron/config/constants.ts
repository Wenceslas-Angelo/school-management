export const TABLE_NAMES = {
  CLASSES: 'classes',
  STUDENTS: 'students', 
  PAYMENTS: 'payments'
} as const;

export const SQL_QUERIES = {
  // Classes
  CREATE_CLASS_TABLE: `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.CLASSES} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      section TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(name, section)
    )`,
  
  // Students  
  CREATE_STUDENT_TABLE: `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.STUDENTS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      birthDate TEXT,
      sex TEXT CHECK(sex IN ('M', 'F')),
      classId INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(classId) REFERENCES ${TABLE_NAMES.CLASSES}(id) ON DELETE SET NULL
    )`,

  // Payments
  CREATE_PAYMENT_TABLE: `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAMES.PAYMENTS} (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      amount REAL NOT NULL CHECK(amount > 0),
      date TEXT NOT NULL,
      months TEXT NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(studentId) REFERENCES ${TABLE_NAMES.STUDENTS}(id) ON DELETE CASCADE
    )`,

  // Indexes pour performance
  CREATE_INDEXES: [
    `CREATE INDEX IF NOT EXISTS idx_students_class ON ${TABLE_NAMES.STUDENTS}(classId)`,
    `CREATE INDEX IF NOT EXISTS idx_students_name ON ${TABLE_NAMES.STUDENTS}(lastName, firstName)`,
    `CREATE INDEX IF NOT EXISTS idx_payments_student ON ${TABLE_NAMES.PAYMENTS}(studentId)`,
    `CREATE INDEX IF NOT EXISTS idx_payments_date ON ${TABLE_NAMES.PAYMENTS}(date)`
  ]
} as const;
