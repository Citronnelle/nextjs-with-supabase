import { unsubscribe } from "diagnostics_channel";

export const createClient = jest.fn(() => ({
  auth: {
    getSession: jest.fn(() => Promise.resolve({ data: null, error: null })),
    onAuthStateChange: jest.fn(() => ({
      data: { subscription: { unsubscribe: jest.fn() } },
    })),
  },
}));
