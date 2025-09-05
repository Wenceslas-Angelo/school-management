export type Payment = {
  id?: number;          // auto-incrémenté
  studentId: number;    // FK vers Student.id
  amount: number;       // montant total payé pour les mois
  date: string;         // format YYYY-MM-DD
  months: string;       // ex: "2025-09,2025-10"
  description?: string; // info optionnelle
};

export type PaymentExtended = Payment & {
  studentName: string;
  className?: string;
};
