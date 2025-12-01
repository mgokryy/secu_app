export function validatePassword(password) {
  const errors = [];

  if (password.length < 12) {
    errors.push("Le mot de passe doit contenir au moins 12 caractères.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre minuscule.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins une lettre majuscule.");
  }
  if (!/\d/.test(password)) {

    errors.push("Le mot de passe doit contenir au moins un chiffre.");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Le mot de passe doit contenir au moins un caractère spécial.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
