// Allowed real email providers — extend as needed
const ALLOWED_DOMAINS = new Set([
  'gmail.com', 'googlemail.com',
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de',
  'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'proton.me',
  'zoho.com',
  'aol.com',
  'mail.com',
  'gmx.com', 'gmx.net',
  'tutanota.com',
  'fastmail.com',
  'hey.com',
  // Common educational / org
  'edu', // checked as suffix
]);

function isValidEmailDomain(email) {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2) return false;
  const domain = parts[1];
  if (ALLOWED_DOMAINS.has(domain)) return true;
  // Allow .edu and .ac.* domains
  if (domain.endsWith('.edu') || domain.includes('.ac.')) return true;
  // Allow known org/company domains with proper TLDs (at least one dot, no suspicious patterns)
  const tld = domain.split('.').pop();
  const validTlds = ['com', 'org', 'net', 'edu', 'gov', 'io', 'co', 'uk', 'in', 'de', 'fr', 'au'];
  if (!validTlds.includes(tld)) return false;
  // Block obviously fake domains (single word + tld with no known provider)
  // Allow if domain has at least 4 chars before tld
  const domainWithoutTld = domain.slice(0, domain.lastIndexOf('.'));
  if (domainWithoutTld.length < 3) return false;
  return true;
}

module.exports = { isValidEmailDomain };
