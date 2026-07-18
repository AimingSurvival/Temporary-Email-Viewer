/**
 * Email API Service
 * A clean, promise-based wrapper around the 1secmail public API.
 * All methods use native fetch and return parsed JSON.
 */

const BASE_URL = 'https://www.1secmail.com/api/v1/';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - Query string to append to BASE_URL
 * @returns {Promise<any>}
 */
const apiFetch = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetches the list of supported 1secmail domains.
 * @returns {Promise<string[]>} Array of domain strings (e.g., ["1secmail.com", "1secmail.org"])
 */
export const getDomainList = () => {
  return apiFetch('?action=getDomainList');
};

/**
 * Retrieves the message list for a specific mailbox.
 * @param {string} login - The username/local part of the email
 * @param {string} domain - The domain part of the email
 * @returns {Promise<Array<{id: number, from: string, subject: string, date: string}>>}
 */
export const getMessages = (login, domain) => {
  return apiFetch(`?action=getMessages&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}`);
};

/**
 * Reads the full content of a specific email message.
 * @param {string} login - Mailbox username
 * @param {string} domain - Mailbox domain
 * @param {number} id - Message ID
 * @returns {Promise<{id: number, from: string, subject: string, date: string, body: string, textBody: string, htmlBody: string, attachments: Array}>}
 */
export const readMessage = (login, domain, id) => {
  return apiFetch(
    `?action=readMessage&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${id}`
  );
};

/**
 * Constructs a download URL for an email attachment.
 * @param {string} login
 * @param {string} domain
 * @param {number} id
 * @param {string} filename
 * @returns {string} Direct download URL
 */
export const getAttachmentUrl = (login, domain, id, filename) => {
  return `${BASE_URL}?action=downloadAttachment&login=${encodeURIComponent(login)}&domain=${encodeURIComponent(domain)}&id=${id}&file=${encodeURIComponent(filename)}`;
};