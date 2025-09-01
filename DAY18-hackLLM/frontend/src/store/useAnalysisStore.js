import { create } from 'zustand';


export const useAnalysisStore = create(set => ({
    loading: false,
    result: null,
    setLoading: loading => set({ loading }),
    setResult: result => set({ result })
}));