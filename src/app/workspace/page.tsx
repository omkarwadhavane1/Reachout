// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { signOut } from 'next-auth/react';

// export default function WorkspacePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [mode, setMode] = useState<'JD_BASED' | 'ROLE_BASED'>('JD_BASED');
//   const [input, setInput] = useState('');
//   const [subject, setSubject] = useState('');
//   const [body, setBody] = useState('');
//   const [emails, setEmails] = useState('');
//   const [generating, setGenerating] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [message, setMessage] = useState('');

//   useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

//   const handleGenerate = async () => {
//     if (!input.trim()) { setMessage('Provide job description or role'); return; }
//     setGenerating(true); setMessage('');
//     try {
//       const res = await fetch('/api/ai/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mode, input }) });
//       const data = await res.json();
//       if (res.ok) { setSubject(data.subject); setBody(data.body); setMessage('Generated successfully'); } else { setMessage(data.error); }
//     } catch (err) { setMessage('Generation failed'); }
//     setGenerating(false);
//   };

//   const handleSend = async () => {
//     if (!emails.trim() || !subject.trim() || !body.trim()) { setMessage('Fill all fields'); return; }
//     setSending(true); setMessage('');
//     try {
//       const res = await fetch('/api/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ emails, subject, body, mode, input }) });
//       const data = await res.json();
//       if (res.ok) {
//         const sent = data.results.filter((r: any) => r.status === 'SENT').length;
//         const failed = data.results.filter((r: any) => r.status === 'FAILED').length;
//         setMessage(`Sent: ${sent}, Failed: ${failed}`);
//         setEmails(''); setSubject(''); setBody(''); setInput('');
//       } else { setMessage(data.error); }
//     } catch (err) { setMessage('Send failed'); }
//     setSending(false);
//   };

//   if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => signOut({ callbackUrl: '/login' })}
//           className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </div>
//       <div className="max-w-5xl mx-auto px-4">
//         <div className="bg-gray-400 rounded-lg shadow p-6">
//           <h1 className="text-2xl font-bold mb-6">Workspace</h1>
//           {message && <div className="mb-4 p-3 bg-blue-500 border rounded text-blue-700">{message}</div>}
          
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">Mode</label>
//             <div className="flex gap-4 ">
//               <button onClick={() => setMode('JD_BASED')} className={`px-4 py-2  rounded ${mode === 'JD_BASED' ? 'bg-blue-600 text-black ' : 'bg-gray-200 text-black'}`}>Job Description Based</button>
//               <button onClick={() => setMode('ROLE_BASED')} className={`px-4 py-2 rounded ${mode === 'ROLE_BASED' ? 'bg-blue-600 text-black' : 'bg-gray-200 text-black'}`}>Role Based</button>
//             </div>
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">{mode === 'JD_BASED' ? 'Job Description' : 'Target Role'}</label>
//             <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'JD_BASED' ? 'Paste job description...' : 'E.g., Full Stack Developer'} className="w-full px-4 py-2 border rounded h-32" />
//           </div>

//           <button onClick={handleGenerate} disabled={generating} className="mb-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50">{generating ? 'Generating...' : 'Generate Cover Letter'}</button>

//           {(subject || body) && (
//             <>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-2">Subject</label>
//                 <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-2 border rounded" />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-2">Body</label>
//                 <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full px-4 py-2 border rounded h-64" />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-sm font-medium mb-2">Recruiter Emails (comma-separated)</label>
//                 <textarea value={emails} onChange={(e) => setEmails(e.target.value)} placeholder="recruiter1@company.com, recruiter2@company.com" className="w-full px-4 py-2 border rounded h-20" />
//               </div>
//               <button onClick={handleSend} disabled={sending} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{sending ? 'Sending...' : 'Send Emails'}</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import {
  Sparkles, Send, Loader, CheckCircle, AlertCircle, X,
  FileText, Mail, Zap, Edit3
} from 'lucide-react'

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [mode, setMode] = useState<'JD_BASED' | 'ROLE_BASED'>('JD_BASED')
  const [useAI, setUseAI] = useState(true)
  const [input, setInput] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [emails, setEmails] = useState('')
  const [generating, setGenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleGenerate = async () => {
    if (!input.trim()) {
      showMessage('error', 'Please provide job description or role')
      return
    }
    
    setGenerating(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, input })
      })
      const data = await res.json()
      
      if (res.ok) {
        setSubject(data.subject)
        setBody(data.body)
        showMessage('success', 'Cover letter generated successfully!')
      } else {
        showMessage('error', data.error || 'Generation failed')
      }
    } catch (err) {
      showMessage('error', 'Generation failed')
    }
    setGenerating(false)
  }

  const handleSend = async () => {
    if (!emails.trim() || !subject.trim() || !body.trim()) {
      showMessage('error', 'Please fill all fields')
      return
    }
    
    setSending(true)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        emails,
        subject,
        body,
        mode: useAI ? mode : null,
        input: useAI ? input : null,
        isManual: !useAI
      })
      })
      const data = await res.json()
      
      if (res.ok) {
        const sent = data.results.filter((r: any) => r.status === 'SENT').length
        const failed = data.results.filter((r: any) => r.status === 'FAILED').length
        showMessage('success', `Sent: ${sent}, Failed: ${failed}`)
        setEmails('')
        setSubject('')
        setBody('')
        setInput('')
      } else {
        showMessage('error', data.error || 'Send failed')
      }
    } catch (err) {
      showMessage('error', 'Send failed')
    }
    setSending(false)
  }

  if (status === 'loading') {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Workspace</h1>
          <p className="text-slate-600">Generate AI-powered cover letters or compose your own emails</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'success'
              ? 'bg-green-200 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="flex-1">{message.text}</p>
            <button onClick={() => setMessage({ type: '', text: '' })}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* AI Toggle */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                {useAI ? <Sparkles className="w-5 h-5 text-purple-600" /> : <Edit3 className="w-5 h-5 text-blue-600" />}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Composition Mode</h2>
                <p className="text-sm text-slate-600">Choose how you want to create your email</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setUseAI(true)}
              className={`flex-1 px-6 py-4 bg-amber-300 rounded-lg border-2 transition ${
                useAI
                  ? 'border-purple-600 bg-black text-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Sparkles className="w-5 h-5 mx-auto mb-2" />
              <p className="font-semibold">AI-Powered</p>
              <p className="text-xs mt-1 opacity-75">Generate with AI</p>
            </button>
            <button
              onClick={() => {
                setUseAI(false)
                setInput('')
              }}
              className={`flex-1 px-6  bg-amber-300 py-4 rounded-lg border-2 transition ${
                !useAI
                  ? 'border-blue-600 bg-black text-blue-70'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Edit3 className="w-5 h-5 mx-auto mb-2 " />
              <p className="font-semibold">Manual</p>
              <p className="text-xs mt-1 opacity-75">Write your own</p>
            </button>
          </div>
        </div>

        {/* AI Mode Content */}
        {useAI && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI Generation Settings</h2>
                <p className="text-sm text-slate-600">Configure how AI generates your cover letter</p>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Generation Mode</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('JD_BASED')}
                  className={`px-6 py-4 rounded-lg border-2 transition text-left ${
                    mode === 'JD_BASED'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <FileText className="w-5 h-5 mb-2 text-blue-600" />
                  <p className="font-semibold text-slate-900">Job Description Based</p>
                  <p className="text-xs text-slate-600 mt-1">AI analyzes the full JD</p>
                </button>
                <button
                  onClick={() => setMode('ROLE_BASED')}
                  className={`px-6 py-4 rounded-lg border-2 transition text-left ${
                    mode === 'ROLE_BASED'
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Mail className="w-5 h-5 mb-2 text-purple-600" />
                  <p className="font-semibold text-slate-900">Role Based</p>
                  <p className="text-xs text-slate-600 mt-1">Just specify the role</p>
                </button>
              </div>
            </div>

            {/* Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-black mb-2">
                {mode === 'JD_BASED' ? 'Job Description' : 'Target Role'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'JD_BASED'
                    ? 'Paste the complete job description here...'
                    : 'E.g., Senior Full Stack Developer, Product Manager, Data Scientist'
                }
                className="w-full px-4 py-3 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={mode === 'JD_BASED' ? 8 : 2}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || !input.trim()}
              className="w-full bg-black text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Cover Letter
                </>
              )}
            </button>
          </div>
        )}

        {/* Email Composition Section (Shows when AI generated OR manual mode) */}
        {(subject || body || !useAI) && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-green-600">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Email Composition</h2>
                <p className="text-sm text-slate-600">Review and customize your email</p>
              </div>
            </div>

            {/* Subject */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject..."
                className="w-full px-4 py-3 border-3 text-black border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Body */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-900 mb-2">Email Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email body here..."
                className="w-full px-4 py-3 border-5 text-black border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                rows={16}
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: Personalize the message before sending for better results
              </p>
            </div>

            {/* Recruiter Emails */}
            <div className="mb-6 border-t border-slate-200 pt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Recruiter Email Addresses
              </label>
              <textarea
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="recruiter1@company.com, recruiter2@company.com, hr@startup.com"
                className="w-full px-4 py-3 border-4 text-black border-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <p className="text-xs text-slate-500 mt-2">
                Separate multiple emails with commas
              </p>
            </div>


            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending || !emails.trim() || !subject.trim() || !body.trim()}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending Emails...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send Emails
                </>
              )}
            </button>
          </div>
        )}

        {/* Empty State */}
        {!subject && !body && useAI && (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {/* <Sparkles className="w-8 h-8 text-blue-600" /> */}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Generate</h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Enter a job description or role above and click "Generate Cover Letter" to get started
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}