import { create } from "zustand";

const useSigapStore = create((set) => ({
  files: [],
  isLoading: false,
  setFiles: (files) => set({ files }),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  setLoading: (status) => set({ isLoading: status }),
}));

export default useSigapStore;