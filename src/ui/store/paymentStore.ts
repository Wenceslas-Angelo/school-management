import { create } from "zustand";
import type { PaymentExtended } from "../../types/payment";

type PaymentState = {
  payments: PaymentExtended[];
  setPayments: (payments: PaymentExtended[]) => void;
  addPayment: (payment: PaymentExtended) => void;
  updatePayment: (payment: PaymentExtended) => void;
  deletePayment: (id: number) => void;
};

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  updatePayment: (payment) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === payment.id ? payment : p)),
    })),
  deletePayment: (id) =>
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),
}));
