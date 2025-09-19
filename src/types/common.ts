export type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

export type FormState = 'idle' | 'submitting' | 'success' | 'error';
