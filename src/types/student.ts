export type Student = {
  id?: number; // auto-incrémenté par la DB
  firstName: string;
  lastName: string;
  birthDate?: string; // format YYYY-MM-DD
  className?: string;
  createdAt?: string; // auto-généré
};
