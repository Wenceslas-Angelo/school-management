import { useEffect, useCallback } from "react";
import { usePaymentStore } from "../store/paymentStore";
// import { paymentsApi } from "../mocks/paymentsApi";
import type { PaymentExtended } from "../../types/payment";

export function usePayments() {
  const { payments, setPayments, addPayment, updatePayment, deletePayment } =
    usePaymentStore();

  const reload = useCallback(async () => {
    const data = await window.api.payments.getAll();
    setPayments(data);
  }, [setPayments]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    payments,
    reload,
    add: async (payment: PaymentExtended) => {
      const id = await window.api.payments.add(payment);
      addPayment({ ...payment, id });
    },
    update: async (payment: PaymentExtended) => {
      await window.api.payments.update(payment);
      updatePayment(payment);
    },
    remove: async (id: number) => {
      await window.api.payments.delete(id);
      deletePayment(id);
    },
  };
}
