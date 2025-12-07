import { useCallback, useState } from 'react';
import { AppError, ErrorHandler } from '../utils/ErrorHandler';

export interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: AppError | null;
}

export interface UseApiActions<T> {
    execute: (params?: any) => Promise<T | null>;
    reset: () => void;
    setData: (data: T | null) => void;
}

export type UseApiReturn<T> = UseApiState<T> & UseApiActions<T>;

/**
 * Hook personnalisé pour gérer les appels d'API avec gestion d'erreur centralisée
 */
export function useApi<T>(
    apiCall: (params?: any) => Promise<T>,
    context?: string,
    options?: {
        initialData?: T;
        silent?: boolean; // Si true, n'affiche pas les erreurs à l'utilisateur
    }
): UseApiReturn<T> {
    const [state, setState] = useState<UseApiState<T>>({
        data: options?.initialData || null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (params?: any): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const { data, error } = await ErrorHandler.withErrorHandling(
            () => apiCall(params),
            context,
            options?.silent
        );

        setState(prev => ({
            ...prev,
            data,
            error,
            loading: false
        }));

        return data;
    }, [apiCall, context, options?.silent]);

    const reset = useCallback(() => {
        setState({
            data: options?.initialData || null,
            loading: false,
            error: null,
        });
    }, [options?.initialData]);

    const setData = useCallback((data: T | null) => {
        setState(prev => ({ ...prev, data }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
    };
}

/**
 * Hook spécialisé pour récupérer des données au montage du composant
 */
export function useFetch<T>(
    apiCall: () => Promise<T>,
    context?: string,
    options?: {
        initialData?: T;
        silent?: boolean;
        enabled?: boolean; // Si false, ne déclenche pas l'appel automatiquement
    }
): UseApiReturn<T> {
    const api = useApi(apiCall, context, options);

    // Déclenche l'appel automatiquement si enabled n'est pas explicitement false
    useState(() => {
        if (options?.enabled !== false) {
            api.execute();
        }
    });

    return api;
}

/**
 * Hook pour gérer plusieurs appels d'API simultanés
 */
export function useMultipleApi<T extends Record<string, any>>(
    apiCalls: Record<keyof T, () => Promise<T[keyof T]>>,
    context?: string
) {
    const [state, setState] = useState<{
        data: Partial<T>;
        loading: boolean;
        errors: Record<keyof T, AppError | null>;
    }>({
        data: {} as Partial<T>,
        loading: false,
        errors: {} as Record<keyof T, AppError | null>,
    });

    const executeAll = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true }));

        const results = await Promise.allSettled(
            Object.entries(apiCalls).map(async ([key, apiCall]) => {
                const { data, error } = await ErrorHandler.withErrorHandling(
                    apiCall as () => Promise<any>,
                    `${context} - ${key}`
                );
                return { key, data, error };
            })
        );

        const newData: Partial<T> = {};
        const newErrors: Record<string, AppError | null> = {};

        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                const { key, data, error } = result.value;
                newData[key as keyof T] = data;
                newErrors[key] = error;
            }
        });

        setState({
            data: newData,
            errors: newErrors as Record<keyof T, AppError | null>,
            loading: false,
        });
    }, [apiCalls, context]);

    const execute = useCallback(async (key: keyof T) => {
        setState(prev => ({
            ...prev,
            errors: { ...prev.errors, [key]: null }
        }));

        const { data, error } = await ErrorHandler.withErrorHandling(
            () => apiCalls[key](),
            `${context} - ${String(key)}`
        );

        setState(prev => ({
            ...prev,
            data: { ...prev.data, [key]: data },
            errors: { ...prev.errors, [key]: error },
        }));

        return data;
    }, [apiCalls, context]);

    return {
        ...state,
        executeAll,
        execute,
    };
}
