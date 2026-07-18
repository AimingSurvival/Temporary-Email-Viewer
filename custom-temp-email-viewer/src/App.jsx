/**
 * Root Application Component
 * Orchestrates high-level routing between the LandingPage and InboxLayout.
 */
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage.jsx';
import InboxLayout from './components/InboxLayout.jsx';

const App = () => {
  // Global state to track the active mailbox credentials
  const [mailbox, setMailbox] = useState(null);

  /**
   * Handler called when user submits a valid email from the landing page.
   * @param {{ login: string, domain: string }} credentials
   */
  const handleMailboxSet = useCallback((credentials) => {
    setMailbox(credentials);
  }, []);

  /**
   * Allows user to navigate back to the landing page to check another inbox.
   */
  const handleReset = useCallback(() => {
    setMailbox(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {!mailbox ? (
        <LandingPage onMailboxSet={handleMailboxSet} />
      ) : (
        <InboxLayout
          login={mailbox.login}
          domain={mailbox.domain}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;