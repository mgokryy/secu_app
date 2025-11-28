export function isPasswordStrong(password) {
  const minLength = 12;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const types = [hasLower, hasUpper, hasDigit, hasSpecial].filter(Boolean).length;
  return password.length >= minLength && types >= 3;
}
