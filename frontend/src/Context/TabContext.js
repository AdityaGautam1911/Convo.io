import React, { createContext, useContext, useState } from "react";

// Create a context
const TabContext = createContext();

// Create a provider component
export const TabProvider = ({ children }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <TabContext.Provider value={{ tabIndex, setTabIndex }}>
      {children}
    </TabContext.Provider>
  );
};

// Create a custom hook to use the TabContext
export const useTab = () => useContext(TabContext);
