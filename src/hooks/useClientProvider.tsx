import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Client } from "mycel-client-ts";
import { MycelEnv } from "../types";

interface ClientContextType {
  client: any;
  setEnv: (newEnv: MycelEnv) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export const ClientProvider: React.FC<{ children: ReactNode, mycelEnv: MycelEnv }> = ({ children, mycelEnv }) => {
  const [env, setEnv] = useState<MycelEnv>(mycelEnv);
  const [client, setClient] = useState<any>(new Client(mycelEnv));

  useEffect(() => {
    if (env) {
      setClient(new Client(env));
    }
  }, [env]);

  return (
    <ClientContext.Provider value={{ client, setEnv }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = (): ClientContextType => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
