import { useState, useCallback } from 'react';
import type { AsyncState, FormState } from '../../types/common';

type CrudOperations<T> = {
  getAll: () => Promise<T[]>;
  add: (item: Omit<T, 'id'>) => Promise<number>;
  update: (item: T) => Promise<number>;
  delete: (id: number) => Promise<number>;
};

export function useCrud<T extends { id?: number }>(
  operations: CrudOperations<T>,
  initialData: T[] = []
) {
  const [state, setState] = useState<AsyncState<T[]>>({
    data: initialData,
    loading: false,
    error: null,
  });
  const [formState, setFormState] = useState<FormState>('idle');

  const load = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await operations.getAll();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }));
    }
  }, [operations]);

  const create = useCallback(async (item: Omit<T, 'id'>) => {
    setFormState('submitting');
    try {
      const id = await operations.add(item);
      const newItem = { ...item, id } as T;
      setState(prev => ({ 
        ...prev, 
        data: [...prev.data, newItem] 
      }));
      setFormState('success');
      return id;
    } catch (error) {
      setFormState('error');
      throw error;
    }
  }, [operations]);

  const update = useCallback(async (item: T) => {
    setFormState('submitting');
    try {
      await operations.update(item);
      setState(prev => ({
        ...prev,
        data: prev.data.map(i => i.id === item.id ? item : i)
      }));
      setFormState('success');
    } catch (error) {
      setFormState('error');
      throw error;
    }
  }, [operations]);

  const remove = useCallback(async (id: number) => {
    try {
      await operations.delete(id);
      setState(prev => ({
        ...prev,
        data: prev.data.filter(i => i.id !== id)
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      }));
      throw error;
    }
  }, [operations]);

  const resetFormState = useCallback(() => {
    setFormState('idle');
  }, []);

  return {
    ...state,
    formState,
    load,
    create,
    update,
    remove,
    resetFormState,
  };
}