// app/providers.tsx
"use client";

import { AuthWrapper } from "@/components/AuthWrapper";
import ScrollToTop from "@/components/shared/ScrollToTop";
import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { persistor, store } from "../redux/store";

export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster richColors position="top-center" />
        <AuthWrapper>
          {children}
          <ScrollToTop />
        </AuthWrapper>
      </PersistGate>
    </Provider>
  );
}
