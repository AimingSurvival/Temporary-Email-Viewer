/**
 * EmailViewer Component
 * Renders the content of a selected email in the right pane.
 * Safely sanitizes HTML bodies using DOMPurify to prevent XSS.
 */
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { FileText, AlertTriangle, Paperclip, Download, Loader2 } from 'lucide-react';
import { readMessage, getAttachmentUrl } from '../services/emailApi.js';

const EmailViewer = ({ login, domain, messageId }) => {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('html'); // 'html' | 'text'

  // Fetch full message details when selection changes
  useEffect(() => {
    if (!messageId) {
      setMessage(null);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(null);
    setActiveTab('html');

    readMessage(login, domain, messageId)
      .then((data) => {
        if (isMounted) {
          setMessage(data);
          // Default to text if no HTML available
          if (!data.htmlBody && data.textBody) {
            setActiveTab('text');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Unable to load message content.');
          console.error('[EmailViewer] Read error:', err);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [login, domain, messageId]);

  // Empty state
  if (!messageId) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-slate-400">
        <FileText size={48} className="mb-4 opacity-40" />
        <p className="text-sm font-medium">Select an email to read</p>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary-600" />
      </div>
    );
  }

  // Error state
  if (error || !message) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-red-500">
        <AlertTriangle size={40} className="mb-3" />
        <p className="text-sm font-medium">{error || 'Message not found'}</p>
      </div>
    );
  }

  /**
   * Sanitizes raw HTML email body to strip scripts and dangerous tags.
   * DOMPurify runs entirely in the browser.
   */
  const sanitizedHtml = message.htmlBody
    ? DOMPurify.sanitize(message.htmlBody, {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: [
          'p', 'br', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'strong', 'b', 'em', 'i', 'u', 'strike', 'a', 'img', 'table',
          'thead', 'tbody', 'tr', 'td', 'th', 'ul', 'ol', 'li', 'blockquote',
          'pre', 'code', 'hr', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
          'href', 'title', 'src', 'alt', 'width', 'height', 'style',
          'class', 'target', 'colspan', 'rowspan', 'border', 'cellpadding',
          'cellspacing'
        ],
        // Force all links to open in new tabs safely
        ADD_ATTR: ['target'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
      })
    : null;

  return (
    <div className="flex h-full flex-col">
      {/* Message Header */}
      <div className="border-b border-slate-200 bg-white px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {message.subject || '(No Subject)'}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
          <div>
            <span className="font-medium text-slate-900">From: </span>
            {message.from}
          </div>
          <div>
            <span className="font-medium text-slate-900">Date: </span>
            {new Date(message.date).toLocaleString()}
          </div>
        </div>

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {message.attachments.map((att) => (
              <a
                key={att.filename}
                href={getAttachmentUrl(login, domain, message.id, att.filename)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-primary-700"
              >
                <Paperclip size={14} />
                {att.filename}
                <Download size={12} />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Tab Switcher (HTML / Text) */}
      {(message.htmlBody && message.textBody) && (
        <div className="flex border-b border-slate-200 bg-slate-50 px-6">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'html'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 text-sm font-medium transition ${
              activeTab === 'text'
                ? 'border-b-2 border-primary-600 text-primary-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Plain Text
          </button>
        </div>
      )}

      {/* Message Body */}
      <div className="flex-1 overflow-y-auto bg-white p-6">
        {activeTab === 'html' && sanitizedHtml ? (
          <div
            className="prose prose-slate max-w-none"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800">
            {message.textBody || message.body || 'No content available.'}
          </pre>
        )}
      </div>
    </div>
  );
};

export default EmailViewer;