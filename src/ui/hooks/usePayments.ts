import { useEffect } from "react";
import { useCrud } from "./useCrud";
import type { PaymentExtended } from "../../types/payment";

export function usePayments() {
  const operations = {
    getAll: () => window.api.payments.getAllWithStudentInfo(),
    add: (payment: Omit<PaymentExtended, 'id'>) => 
      window.api.payments.add(payment as any),
    update: (payment: PaymentExtended) => 
      window.api.payments.update(payment as any),
    delete: (id: number) => window.api.payments.delete(id),
  };

  const crud = useCrud<PaymentExtended>(operations);

  useEffect(() => {
    crud.load();
  }, [crud.load]);

  return {
    ...crud,
    payments: crud.data, // alias pour compatibilité
  };
}