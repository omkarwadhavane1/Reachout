export function generateCoverLetterPrompt(
  resumeText: string,
  mode: 'JD_BASED' | 'ROLE_BASED',
  input: string,
  resumeDriveLink?: string
): string {
  const basePrompt = `
You are a professional career advisor. Generate a personalized cover letter email.

**Resume:**
${resumeText}

${mode === 'JD_BASED' ? `**Job Description:**\n${input}` : `**Target Role:**\n${input}`}

${resumeDriveLink ? `**Resume Drive Link:** ${resumeDriveLink}` : ''}

**Instructions:**
1. Generate a professional email subject line (max 10 words)
2. Write a concise, impressive cover letter (3-4 short paragraphs)
3. Highlight relevant skills and projects from the resume
4. Match the tone to the ${mode === 'JD_BASED' ? 'job description' : 'role'}
5. If company name is found in JD, mention it. Otherwise use "Hiring Team"
6. Use a professional yet friendly tone
7. End with a clear call to action

**Output Format (JSON only):**
{
  "subject": "Your subject line here",
  "body": "Dear Hiring Manager,\\n\\nYour cover letter body here..."
}

Do not include any markdown, code blocks, or extra text. Return only valid JSON.`;

  return basePrompt;
}