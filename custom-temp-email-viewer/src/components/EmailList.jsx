/**
 * EmailList Component
 * Displays the list of messages in the left pane.
 * Implements auto-polling via useEffect to fetch new emails every 6 seconds.
 */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mail, MailOpen, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { getMessages } from '../services/emailApi.js';

const POLL_INTERVAL_MS = 6000;

const EmailList = ({ login, domain, selectedMessageId, onSelectMessage }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Track IDs we've already seen to highlight new arrivals
  const seenIdsRef = useRef(new Set());

  /**
   * Fetches messages and merges them into state without causing scroll jumps.
   * New messages are prepended; existing ones retain their array position.
   */
  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const data = await getMessages(login, domain);
      const incoming = Array.isArray(data) ? data : [];

      setMessages((prev) => {
        // Create a map of existing messages by ID for O(1) lookup
        const existingMap = new Map(prev.map((m) => [m.id, m]));
        const merged = [];

        // Process incoming messages: new ones first, then existing ones in stable order
        incoming.forEach((msg) => {
          if (!existingMap.has(msg.id)) {
            // Brand new message
            merged.push({ ...msg, isNew: !seenIdsRef.current.has(msg.id) });
          } else {
            // Existing message: preserve read state and remove 'new' flag
            const existing = existingMap.get(msg.id);
            merged.push({ ...existing, ...msg, isNew: false });
          }
          seenIdsRef.current.add(msg.id);
        });

        return merged;
      });

      setLastFetched(new Date());
    } catch (err) {
      setError('Failed to fetch messages. Retrying...');
      console.error('[EmailList] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [login, domain]);

  // Initial fetch + polling interval
  useEffect(() => {
    fetchMessages(); // immediate first fetch

    const intervalId = setInterval(() => {
      fetchMessages();
    }, POLL_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [fetchMessages]);

  /**
   * Formats an ISO-like date string into a readable time.
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* List Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Inbox
        </h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock size={12} />
          {lastFetched ? `Updated ${lastFetched.toLocaleTimeString()}` : '—'}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 text-xs text-red-700">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <MailOpen size={40} className="mb-3 opacity-50" />
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">New emails will appear automatically</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {messages.map((msg) => {
              const isSelected = msg.id === selectedMessageId;
              const isUnread = msg.isNew;

              return (
                <li key={msg.id}>
                  <button
                    onClick={() => onSelectMessage(msg.id)}
                    className={`flex w-full flex-col gap-1 px-4 py-3 text-left transition ${
                      isSelected
                        ? 'bg-primary-50 ring-1 ring-inset ring-primary-200'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`truncate text-sm font-medium ${
                          isUnread ? 'text-slate-900' : 'text-slate-600'
                        }`}
                      >
                        {msg.from || 'Unknown Sender'}
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {formatDate(msg.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isUnread && (
                        <span className="inline-block h-2 w-2 rounded-full bg-primary-500" />
                      )}
                      <span
                        className={`truncate text-xs ${
                          isUnread ? 'font-semibold text-slate-800' : 'text-slate-500'
                        }`}
                      >
                        {msg.subject || '(No Subject)'}
                      </span>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmailList;