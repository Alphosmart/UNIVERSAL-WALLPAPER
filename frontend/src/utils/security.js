// Security Configuration for Universal Wallpaper
// This file contains security-related configurations and utilities

// Content Security Policy configuration
export const CSP_CONFIG = {
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for React inline scripts
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://js.stripe.com",
    "https://checkout.stripe.com"
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and inline styles
    "https://fonts.googleapis.com"
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  connectSrc: [
    "'self'",
    "https://api.stripe.com",
    "https://www.google-analytics.com"
  ],
  frameSrc: [
    "'self'",
    "https://js.stripe.com",
    "https://hooks.stripe.com"
  ],
  objectSrc: ["'none'"],
  upgradeInsecureRequests: true
};

// Security headers configuration
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Input sanitization utilities
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

// Email validation with security considerations
export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

// Password strength validation
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    maxLength: password.length <= 128
  };
  
  const strength = Object.values(requirements).filter(Boolean).length;
  
  return {
    isValid: strength >= 5, // At least 5 out of 6 requirements
    strength: strength,
    requirements: requirements
  };
};

// Rate limiting configuration
export const RATE_LIMITS = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  passwordReset: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  api: { maxRequests: 100, windowMs: 60 * 1000 } // 100 requests per minute
};

// Security audit configuration
export const SECURITY_AUDIT = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxUploadSize: 50 * 1024 * 1024, // 50MB total
  blockedUserAgents: [
    'bot', 'crawler', 'spider', 'scraper'
  ]
};

// HTTPS enforcement utility
export const enforceHTTPS = () => {
  if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && 
      !window.location.hostname.includes('localhost')) {
    window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
  }
};

// Secure cookie configuration
export const COOKIE_CONFIG = {
  secure: true, // Only send over HTTPS
  httpOnly: true, // Not accessible via JavaScript
  sameSite: 'strict', // CSRF protection
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
};

const SecurityConfig = {
  CSP_CONFIG,
  SECURITY_HEADERS,
  sanitizeInput,
  validateEmail,
  validatePassword,
  RATE_LIMITS,
  SECURITY_AUDIT,
  enforceHTTPS,
  COOKIE_CONFIG
};

export default SecurityConfig;