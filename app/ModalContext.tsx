// app/tabs/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, TouchableOpacity } from 'react-native'
import { StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

// Change modalContent to ReactNode
const ModalContext = createContext({
  modalVisible: false,
  setModalVisible: (_: boolean) => {},
  setModalContent: (_: ReactNode) => {},
  modalContent: null as ReactNode,
});

function AppModal() {
  const { modalVisible, setModalVisible, modalContent } = useModal();

  return (
    <Modal
      visible={!!modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.2)",
          justifyContent: "center",
          alignItems: "center",
        }}
        activeOpacity={1}
        onPressOut={() => setModalVisible(false)}
      >
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: 24,
          minWidth: 220,
          alignItems: "center",
          elevation: 4,
        }}>
          {/* Render the provided modalContent */}
          {modalContent}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode>(null);

  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible, setModalContent, modalContent }}>
      {children}
      <AppModal />
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
export default ModalContext;

const styles = StyleSheet.create({
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
    backgroundColor: colors.accent,
  },  
  logoutText: {
    color: colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

