import React, { createContext, useContext, useState } from "react";

interface AddressOption {
  formatted: string;
  geometry: {
    lat: number;
    lng: number;
  }
}

interface AddressContextProps {
  address: AddressOption | null;
  setAddress: (address: AddressOption | null) => void;
}

const AddressContext = createContext<AddressContextProps>({
  address: null,
  setAddress: () => {},
});

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<AddressOption | null>(null);
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