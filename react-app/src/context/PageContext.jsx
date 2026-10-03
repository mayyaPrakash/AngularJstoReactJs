import { createContext, useContext, useState, useCallback } from 'react';

const PageContext = createContext();

export function PageProvider({ children }) {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const setPage = useCallback((t, d) => {
    setTitle(t);
    setDescription(d);
  }, []);

  return (
    <PageContext.Provider value={{ title, description, loading, setPage, setLoading }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) throw new Error('usePage must be used within PageProvider');
  return ctx;
}
