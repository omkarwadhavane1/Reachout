export function validateSMTP(config: {
  email: string;
  host: string;
  port: number;
  password: string;
}): { valid: boolean; error?: string } {
  if (!config.email || !config.host || !config.port || !config.password) {
    return { valid: false, error: 'All SMTP fields are required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(config.email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (config.port < 1 || config.port > 65535) {
    return { valid: false, error: 'Invalid port number' };
  }

  return { valid: true };
}