export type Payment = {
  id?: number; // auto-incrémenté
  studentId: number; // FK vers Student.id
  amount: number;
  date: string; // format YYYY-MM-DD
  status?: "paid" | "pending" | "late"; // suivi écolage
};

export type PaymentExtended = Payment & {
  studentName: string;
  className?: string;
};
