/**
 * InboxLayout Component
 * Provides the responsive split-pane shell: EmailList on the left, EmailViewer on the right.
 * Handles the selected message state and reset navigation.
 */
import React, { useState } from 'react';
import { Inbox, ArrowLeft } from 'lucide-react';
import EmailList from './EmailList.jsx';
import EmailViewer from './EmailViewer.jsx';

const InboxLayout = ({ login, domain, onReset }) => {
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onReset}
            className="flex items-center rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            title="Back to landing page"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              <Inbox size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                {login}@{domain}
              </h2>
              <p className="text-xs text-slate-500">Auto-refreshing every 6s</p>
            </div>
          </div>
        </div>
      </header>

      {/* Split Pane Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Pane: Email List */}
        <aside className="w-full border-r border-slate-200 md:w-96 lg:w-[28rem]">
          <EmailList
            login={login}
            domain={domain}
            selectedMessageId={selectedMessageId}
            onSelectMessage={setSelectedMessageId}
          />
        </aside>

        {/* Right Pane: Email Viewer */}
        <section className="hidden flex-1 bg-slate-50 md:block">
          <EmailViewer
            login={login}
            domain={domain}
            messageId={selectedMessageId}
          />
        </section>
      </main>

      {/* Mobile Viewer Modal/Overlay could be implemented here */}
    </div>
  );
};

export default InboxLayout;