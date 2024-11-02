import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  name: string;
  email: string;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [name, setName] = useState('Matheus Oliveira');
  const [email, setEmail] = useState('matheus.oliveira@gmail.com');

  return (
    <ProfileContext.Provider value={{ name, email, setName, setEmail }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('Error');
  }
  return context;
};
