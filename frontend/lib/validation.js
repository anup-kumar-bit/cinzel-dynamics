export const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? '').trim())

export const looksLikePhone = (value) => {
  const digits = String(value ?? '').replace(/[^\d]/g, '')
  return digits.length >= 7 && digits.length <= 15
}

export const validateEmail = (value) => {
  const v = String(value ?? '').trim()
  if (!v) return 'Email is required.'
  if (!looksLikeEmail(v)) return 'Enter a valid email address.'
  return null
}

export const validatePhone = (value) => {
  const v = String(value ?? '').trim()
  if (!v) return 'Phone number is required.'
  if (!looksLikePhone(v)) return 'Enter a valid phone number (7-15 digits).'
  return null
}
