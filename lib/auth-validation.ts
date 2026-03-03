const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normalizeEmail = (email: string) => email.trim().toLowerCase()

export const isValidEmail = (email: string) => EMAIL_REGEX.test(normalizeEmail(email))
