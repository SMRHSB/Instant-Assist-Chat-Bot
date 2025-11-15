import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TutorialState {
  hasCompletedTutorial: boolean;
  currentStep: number;
  setHasCompletedTutorial: (completed: boolean) => void;
  setCurrentStep: (step: number) => void;
  resetTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>()(
  persist(
    (set) => ({
      hasCompletedTutorial: false,
      currentStep: 0,
      setHasCompletedTutorial: (completed) => set({ hasCompletedTutorial: completed }),
      setCurrentStep: (step) => set({ currentStep: step }),
      resetTutorial: () => set({ hasCompletedTutorial: false, currentStep: 0 }),
    }),
    {
      name: 'tutorial-storage',
    }
  )
);