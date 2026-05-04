import React, { createContext, useState } from 'react';

export const NavigationContext = createContext();

export default function NavigationProvider({ children }) {
  // Maintain a stack of routes to allow proper back navigation
  const [history, setHistory] = useState([{ name: 'Home', params: {} }]);

  const current = history[history.length - 1];

  // Push a new route onto the stack
  function navigate(name, params) {
    setHistory(prev => [...prev, { name, params: params || {} }]);
  }

  // Replace the entire history with a single route (prevents going back)
  function replace(name, params) {
    setHistory([{ name, params: params || {} }]);
  }

  function goBack() {
    setHistory(prev => {
      if (prev.length <= 1) return [{ name: 'Home', params: {} }];
      const copy = prev.slice(0, prev.length - 1);
      return copy;
    });
  }

  return (
    <NavigationContext.Provider value={{ route: current, navigate, replace, goBack, history }}>
      {children}
    </NavigationContext.Provider>
  );
}
