export type Payment = {
  id?: number;
  studentId: number;
  amount: number;
  date: string;
  months: string;
  description?: string;
};

export type PaymentExtended = Payment & {
  firstName: string; // FIX: était studentName
  lastName: string;  // NOUVEAU
  className?: string;
  classSection?: string;
  studentName?: string; // Computed property
};