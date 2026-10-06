import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Admin } from './admin/Admin';
import { App } from './App';
import { StoreProvider } from './store';
import './styles.css';

/** The shop, or the control panel at #admin. */
function Root() {
  const [admin, setAdmin] = useState(() => location.hash === '#admin');
  useEffect(() => {
    const onHash = () => setAdmin(location.hash === '#admin');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return admin ? <Admin /> : <StoreProvider><App /></StoreProvider>;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
