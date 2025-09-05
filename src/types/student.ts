export type Student = {
  id?: number;              // auto-incrémenté par la DB
  firstName: string;
  lastName: string;
  birthDate?: string;       // format YYYY-MM-DD
  sex: "M" | "F";
  classId?: number;         // référence à Class.id
  createdAt?: string;       // auto-généré par la DB
};
