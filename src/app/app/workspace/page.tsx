'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function WorkspacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mode, setMode] = useState<'JD_BASED' | 'ROLE_BASED'>('JD_BASED');
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [emails, setEmails] = useState('');
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleGenerate = async () => {
    if (!input.trim()) {
      setMessage('Please provide job description or role');
      return;
    }

    setGenerating(true);
    setMessage('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, input }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubject(data.subject);
        setBody(data.body);
        setMessage('Cover letter generated successfully');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Generation failed');
    }

    setGenerating(false);
  };

  const handleSend = async () => {
    if (!emails.trim() || !subject.trim() || !body.trim()) {
      setMessage('Please fill all fields');
      return;
    }

    setSending(true);
    setMessage('');

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails, subject, body, mode, input }),
      });

      const data = await res.json();

      if (res.ok) {
        const sentCount = data.results.filter((r: any) => r.status === 'SENT').length;
        const failedCount = data.results.filter((r: any) => r.status === 'FAILED').length;
        setMessage(`Sent: ${sentCount}, Failed: ${failedCount}`);
        
        // Clear form after successful send
        setEmails('');
        setSubject('');
        setBody('');
        setInput('');
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      setMessage('Send failed');
    }

    setSending(false);
  };

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Workspace</h1>

          {message && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded text-blue-700">
              {message}
            </div>
          )}

          {/* Mode Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Mode</label>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('JD_BASED')}
                className={`px-4 py-2 rounded ${
                  mode === 'JD_BASED'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Job Description Based
              </button>
              <button
                onClick={() => setMode('ROLE_BASED')}
                className={`px-4 py-2 rounded ${
                  mode === 'ROLE_BASED'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Role Based
              </button>
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {mode === 'JD_BASED' ? 'Job Description' : 'Target Role'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === 'JD_BASED'
                  ? 'Paste job description here...'
                  : 'E.g., Full Stack Developer'
              }
              className="w-full px-4 py-2 border rounded h-32"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mb-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {generating ? 'Generating...' : 'Generate Cover Letter'}
          </button>

          {/* Generated Output */}
          {(subject || body) && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Body</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full px-4 py-2 border rounded h-64"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Recruiter Emails (comma-separated)
                </label>
                <textarea
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  placeholder="recruiter1@company.com, recruiter2@company.com"
                  className="w-full px-4 py-2 border rounded h-20"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={sending}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Emails'}
              </button>
            </>
          )}
        </div>
      </div>
      
    </div>
  );
}