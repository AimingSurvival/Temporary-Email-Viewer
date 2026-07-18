/**
 * LandingPage Component
 * Provides the initial UI for entering a temporary email address.
 * Validates input and fetches supported domains from the 1secmail API.
 */
import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import { getDomainList } from '../services/emailApi.js';

const LandingPage = ({ onMailboxSet }) => {
  const [login, setLogin] = useState('');
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch supported domains on mount
  useEffect(() => {
    let isMounted = true;
    getDomainList()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setDomains(data);
          setDomain(data[0] || '');
        }
      })
      .catch(() => {
        // Fallback domains if API fails
        if (isMounted) {
          const fallback = ['1secmail.com', '1secmail.org', '1secmail.net'];
          setDomains(fallback);
          setDomain(fallback[0]);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Validates the username and triggers the parent callback.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedLogin = login.trim().toLowerCase();
    if (!trimmedLogin) {
      setError('Please enter a username.');
      return;
    }
    if (!/^[a-z0-9._-]+$/.test(trimmedLogin)) {
      setError('Username contains invalid characters.');
      return;
    }

    setLoading(true);
    // Simulate a brief delay for UX polish
    setTimeout(() => {
      onMailboxSet({ login: trimmedLogin, domain });
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-lg">
            <Mail size={32} />
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
            Temp Email Viewer
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor any pre-existing 1secmail inbox in real-time.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-900/5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-slate-700">
                Username
              </label>
              <div className="mt-1 flex rounded-lg shadow-sm">
                <input
                  type="text"
                  id="login"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="john.doe"
                  className="block w-full rounded-l-lg border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  autoComplete="off"
                />
                <span className="inline-flex items-center border border-l-0 border-slate-300 bg-slate-100 px-3 text-slate-500 sm:text-sm">
                  @
                </span>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="block w-40 rounded-r-lg border-slate-300 bg-slate-50 px-3 py-3 text-slate-900 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !domain}
              className="group flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Opening Inbox...' : 'View Inbox'}
              <ArrowRight
                size={18}
                className="ml-2 transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Zap size={20} />
            </div>
            <span className="mt-2 text-xs font-medium text-slate-600">Live Polling</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Shield size={20} />
            </div>
            <span className="mt-2 text-xs font-medium text-slate-600">HTML Safe</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Globe size={20} />
            </div>
            <span className="mt-2 text-xs font-medium text-slate-600">No API Key</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;