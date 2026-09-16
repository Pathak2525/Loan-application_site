import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const STEPS = [
  'loanType',
  'personalDetails',
  'contactDetails',
  'addressDetails',
  'employmentDetails',
  'loanDetails',
  'documents',
  'verification',
  'signature',
  'review',
];

export const STEP_LABELS = {
  loanType: 'Loan type',
  personalDetails: 'Personal details',
  contactDetails: 'Contact details',
  addressDetails: 'Address',
  employmentDetails: 'Employment & income',
  loanDetails: 'Loan details',
  documents: 'Documents',
  verification: 'Identity verification',
  signature: 'E-signature',
  review: 'Review & submit',
};

const initialState = {
  currentStepIndex: 0,
  furthestStepIndex: 0,
  data: {
    loanType: {},
    personalDetails: {},
    contactDetails: {},
    addressDetails: {},
    employmentDetails: {},
    loanDetails: {},
    documents: {},
    verification: {},
    signature: {},
  },
  submitted: false,
  applicationId: null,
  lastSavedAt: null,
};

export const useLoanStore = create(
  persist(
    (set, get) => ({
      ...initialState,


      setStepData: (stepKey, values) =>
        set((state) => ({
          data: { ...state.data, [stepKey]: { ...state.data[stepKey], ...values } },
          lastSavedAt: new Date().toISOString(),
        })),

      goToStep: (index) =>
        set((state) => ({
          currentStepIndex: index,
          furthestStepIndex: Math.max(state.furthestStepIndex, index),
        })),

      goNext: () =>
        set((state) => {
          const next = Math.min(state.currentStepIndex + 1, STEPS.length - 1);
          return { currentStepIndex: next, furthestStepIndex: Math.max(state.furthestStepIndex, next) };
        }),

      goBack: () =>
        set((state) => ({ currentStepIndex: Math.max(state.currentStepIndex - 1, 0) })),

      markSubmitted: () =>
        set(() => ({
          submitted: true,
          applicationId: 'LN-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        })),

      resetApplication: () => set(() => ({ ...initialState, data: { ...initialState.data } })),

      hasDraft: () => {
        const state = get();
        return state.currentStepIndex > 0 && !state.submitted;
      },
    }),
    {
      name: 'loan-application-draft', // localStorage key -> powers auto-save + resume
      partialize: (state) => ({
        currentStepIndex: state.currentStepIndex,
        furthestStepIndex: state.furthestStepIndex,
        data: state.data,
        submitted: state.submitted,
        applicationId: state.applicationId,
        lastSavedAt: state.lastSavedAt,
      }),
    }
  )
);
