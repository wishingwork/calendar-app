import React, { createContext, useContext, useState } from "react";

interface AddressContextProps {
  address: string;
  setAddress: (address: string) => void;
}

const AddressContext = createContext<AddressContextProps>({
  address: "",
  setAddress: () => {},
});

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string>("");
  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  return useContext(AddressContext);
}

export default AddressProvider;