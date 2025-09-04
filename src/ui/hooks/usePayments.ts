import { useEffect, useCallback } from "react";
import { usePaymentStore } from "../store/paymentStore";
import { paymentsApi } from "../mocks/paymentsApi";
import type { PaymentExtended } from "../../types/payment";

export function usePayments() {
  const { payments, setPayments, addPayment, updatePayment, deletePayment } =
    usePaymentStore();

  const reload = useCallback(async () => {
    const data = await paymentsApi.getAll();
    setPayments(data);
  }, [setPayments]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    payments,
    reload,
    add: async (payment: PaymentExtended) => {
      const id = await paymentsApi.add(payment);
      addPayment({ ...payment, id });
    },
    update: async (payment: PaymentExtended) => {
      await paymentsApi.update(payment);
      updatePayment(payment);
    },
    remove: async (id: number) => {
      await paymentsApi.remove(id);
      deletePayment(id);
    },
  };
}
