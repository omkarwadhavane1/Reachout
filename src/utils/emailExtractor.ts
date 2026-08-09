export function extractEmails(input: string): string[] {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = input.match(emailRegex) || [];
  
  // Remove duplicates and normalize
  const uniqueEmails = Array.from(new Set(emails.map(e => e.toLowerCase().trim())));
  
  return uniqueEmails;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}