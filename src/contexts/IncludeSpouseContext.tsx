"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface IncludeSpouseContextProps {
  includeSpouse: boolean;
  toggleIncludeSpouse: () => void;
}

const IncludeSpouseContext = createContext<IncludeSpouseContextProps>({
  includeSpouse: true,
  toggleIncludeSpouse: () => {},
});

export const useIncludeSpouse = () => useContext(IncludeSpouseContext);

export const IncludeSpouseProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [includeSpouse, setIncludeSpouse] = useState(true);

  // load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("includeSpouse");
    if (stored !== null) {
      setIncludeSpouse(JSON.parse(stored));
    }
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem("includeSpouse", JSON.stringify(includeSpouse));
  }, [includeSpouse]);

  const toggleIncludeSpouse = () => {
    setIncludeSpouse((prev) => !prev);
  };

  return (
    <IncludeSpouseContext.Provider
      value={{ includeSpouse, toggleIncludeSpouse }}
    >
      {children}
    </IncludeSpouseContext.Provider>
  );
};
