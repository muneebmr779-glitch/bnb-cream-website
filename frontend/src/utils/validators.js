export const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const isValidPhone = (value) => /^[\d\s()+-]{7,20}$/.test(value);

export const minLength = (value, len) => (value || '').trim().length >= len;

export const required = (value) => value !== undefined && value !== null && `${value}`.trim() !== '';

export const isFutureDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

export const isValidYear = (value) => {
  const year = Number(value);
  return Number.isInteger(year) && year >= 1950 && year <= new Date().getFullYear() + 1;
};
