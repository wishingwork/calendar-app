// app/tabs/ModalContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext({
  modalVisible: () => {},
  setModalVisible: (_: boolean) => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
