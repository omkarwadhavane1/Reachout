// 'use client';
// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import 'pdfjs-dist/webpack.mjs';

// export default function ProfilePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [resumeUrl, setResumeUrl] = useState('');
//   const [driveLink, setDriveLink] = useState('');
//   const [smtp, setSmtp] = useState({ email: '', host: '', port: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
  
//   useEffect(() => {
//     // fetch existing profile data to prefill fields
//     (async () => {
//       try {
//         const res = await fetch('/api/profile/me');
//         if (res.ok) {
//           const data = await res.json();
//           if (data.resumePdfUrl) setResumeUrl(data.resumePdfUrl);
//           if (data.resumeDriveLink) setDriveLink(data.resumeDriveLink);
//           if (data.smtpEmail || data.smtpHost || data.smtpPort) {
//             setSmtp({ email: data.smtpEmail || '', host: data.smtpHost || '', port: String(data.smtpPort || ''), password: '' });
//           }
//         }
//       } catch (err) {
//         console.error('profile prefill error', err);
//       }
//     })();
//   }, []);

//   useEffect(() => { if (status === 'unauthenticated') router.push('/login'); }, [status, router]);

//   const handleResumeUpload = async () => {
//     if (!resumeFile) return;
//     // client-side max file size (5MB)
//     const MAX_BYTES = 5 * 1024 * 1024;
//     if (resumeFile.size > MAX_BYTES) {
//       setMessage('File too large. Max 5MB allowed.');
//       return;
//     }

//     setLoading(true); setMessage('');

//     try {
//       // Extract text client-side using pdf.js
//       const pdfjs = await import('pdfjs-dist/webpack.mjs');
//       const arrayBuffer = await resumeFile.arrayBuffer();
//       const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
//       const pdf = await loadingTask.promise;

//       let fullText = '';
//       for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//         const page = await pdf.getPage(pageNum);
//         const textContent = await page.getTextContent();
//         textContent.items.forEach((item: any) => {
//           if ('str' in item) {
//             fullText += item.str + ' ';
//           }
//         });
//         fullText += '\n\n';
//       }
//       const extractedText = fullText.trim();

//       // Prepare form data with file + extracted text
//       const formData = new FormData();
//       formData.append('resume', resumeFile);
//       formData.append('resumeText', extractedText);
      
//       console.log('Extracted resume text:', extractedText);
//       console.log('Text length:', extractedText.length);


//       // Upload to server
//       const res = await fetch('/api/profile/upload-resume', { method: 'POST', body: formData });
//       const data = await res.json();
//       if (res.ok) {
//         setResumeUrl(data.resumePdfUrl);
//         setMessage('Resume uploaded and text saved');
//       } else {
//         setMessage(data.error || 'Upload failed');
//       }
//     } catch (err: any) {
//       console.error('Upload error:', err);
//       setMessage(err?.message || 'Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };


//   const handleDriveLinkSave = async () => {
//     setLoading(true); setMessage('');
//     try {
//       const res = await fetch('/api/profile/drive-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resumeDriveLink: driveLink }) });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage(data.message || 'Updated');
//         setDriveLink(data.resumeDriveLink || '');
//       } else {
//         setMessage(data.error || 'Update failed');
//       }
//     } catch (err: any) { setMessage(err?.message || 'Update failed'); }
//     setLoading(false);
//   };

//   const handleSmtpSave = async () => {
//     setLoading(true); setMessage('');
//     try {
//       const res = await fetch('/api/profile/smtp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ smtpEmail: smtp.email, smtpHost: smtp.host, smtpPort: smtp.port, smtpPassword: smtp.password }) });
//       const data = await res.json();
//       if (res.ok) {
//         setMessage(data.message || 'SMTP saved');
//       } else {
//         setMessage(data.error || 'SMTP failed');
//       }
//     } catch (err: any) { setMessage(err?.message || 'SMTP failed'); }
//     setLoading(false);
//   };

//   if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-gray-500 py-8">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="bg-gray-400 rounded-lg shadow p-6">
//           <h1 className="text-2xl font-bold mb-4">Profile Setup</h1>
//           {message && <div className="mb-4 p-3 bg-blue-50 border rounded text-blue-700">{message}</div>}
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-2">Upload Resume (PDF)</h2>
//             <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} className="mb-2" />
//             <button onClick={handleResumeUpload} disabled={loading || !resumeFile} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Upload</button>
//             {resumeUrl && <p className="mt-2 text-sm text-green-600">Resume uploaded</p>}
//           </div>
// <input
//   type="file"
//   accept="image/*"
//   onChange={(e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('photo', file);

//     fetch('/api/profile/photo', {
//       method: 'POST',
//       body: formData,
//     });
//   }}
// />


//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-2">Resume Drive Link (Optional)</h2>
//             <input type="url" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full px-4 py-2 border rounded mb-2" />
//             <button onClick={handleDriveLinkSave} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Save Link</button>
//           </div>
//           <div className="mb-6">
//             <h2 className="text-lg font-semibold mb-2">SMTP Configuration</h2>
//             <div className="grid grid-cols-2 gap-4">
//               <input type="email" placeholder="SMTP Email" value={smtp.email} onChange={(e) => setSmtp({ ...smtp, email: e.target.value })} className="px-4 py-2 border rounded" />
//               <input type="text" placeholder="SMTP Host" value={smtp.host} onChange={(e) => setSmtp({ ...smtp, host: e.target.value })} className="px-4 py-2 border rounded" />
//               <input type="number" placeholder="Port" value={smtp.port} onChange={(e) => setSmtp({ ...smtp, port: e.target.value })} className="px-4 py-2 border rounded" />
//               <input type="password" placeholder="App Password" value={smtp.password} onChange={(e) => setSmtp({ ...smtp, password: e.target.value })} className="px-4 py-2 border rounded" />
//             </div>
//             <button onClick={handleSmtpSave} disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Save SMTP</button>
//           </div>
//           <div className="flex gap-4">
//             <button onClick={() => router.push('/workspace')} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Go to Workspace</button>
//             <button onClick={() => router.push('/dashboard')} className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700">View Dashboard</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { 
  Upload, CheckCircle, AlertCircle, Loader, 
  FileText, Mail, Key, Link as LinkIcon, User, X, Image as ImageIcon
} from 'lucide-react'
import 'pdfjs-dist/webpack.mjs'
import { signIn } from 'next-auth/react'


export default function ProfilePage() {
 const { data: session, status } = useSession()

  const router = useRouter()
  
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeUrl, setResumeUrl] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [smtp, setSmtp] = useState({ email: '', host: '', port: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  
  // Drag and drop states
  const [resumeDragging, setResumeDragging] = useState(false)
  const [photoDragging, setPhotoDragging] = useState(false)
  // const [photoPreview, setPhotoPreview] = useState('')

  // const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  // const [existingPhoto, setExistingPhoto] = useState<string | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null) // local preview
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null) // DB image
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null) // API result


  
  const resumeInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const displayImage =
  photoPreview || uploadedPhoto || existingPhoto


  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/profile/me')
        if (res.ok) {
          const data = await res.json()
          if (data.resumePdfUrl) setResumeUrl(data.resumePdfUrl)
          if (data.resumeDriveLink) setDriveLink(data.resumeDriveLink)
          if (data.image) setExistingPhoto(data.image)
          if (data.smtpEmail || data.smtpHost || data.smtpPort) {
            setSmtp({ 
              email: data.smtpEmail || '', 
              host: data.smtpHost || '', 
              port: String(data.smtpPort || ''), 
              password: '' 
            })
          }
        }
      } catch (err) {
        console.error('profile prefill error', err)
      }
    })()
  }, [])

  useEffect(() => {
  if (session?.user?.image) {
    setExistingPhoto(session.user.image)
  }
}, [session])

  useEffect(() => { 
    if (status === 'unauthenticated') router.push('/login') 
  }, [status, router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  // Resume drag and drop handlers
  const handleResumeDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setResumeDragging(true)
  }

  const handleResumeDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setResumeDragging(false)
  }

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setResumeDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type === 'application/pdf') {
      setResumeFile(file)
    } else {
      showMessage('error', 'Please drop a PDF file')
    }
  }

  // Photo drag and drop handlers
  const handlePhotoDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setPhotoDragging(true)
  }

  const handlePhotoDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setPhotoDragging(false)
  }

  const handlePhotoDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setPhotoDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      await uploadPhoto(file)
    } else {
      showMessage('error', 'Please drop an image file')
    }
  }

  const uploadPhoto = async (file: File) => {
  // 🔥 cleanup previous preview immediately
  if (photoPreview) {
    URL.revokeObjectURL(photoPreview)
  }

  const localPreview = URL.createObjectURL(file)
  setPhotoPreview(localPreview)

  try {
    const formData = new FormData()
    formData.append('photo', file)

    const res = await fetch('/api/profile/photo', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      const data = await res.json()

      setUploadedPhoto(data.imageUrl)
      setExistingPhoto(data.imageUrl) // ✅ sync DB state
      setPhotoPreview(null)

      router.refresh();

      showMessage('success', 'Profile photo updated')
    } else {
      showMessage('error', 'Failed to upload photo')
    }
  } catch {
    showMessage('error', 'Failed to upload photo')
  }

}


 
  const handleResumeUpload = async () => {
    if (!resumeFile) return
    
    const MAX_BYTES = 5 * 1024 * 1024
    if (resumeFile.size > MAX_BYTES) {
      showMessage('error', 'File too large. Max 5MB allowed.')
      return
    }

    setLoading(true)

    try {
      const pdfjs = await import('pdfjs-dist/webpack.mjs')
      const arrayBuffer = await resumeFile.arrayBuffer()
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise

      let fullText = ''
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        textContent.items.forEach((item: any) => {
          if ('str' in item) {
            fullText += item.str + ' '
          }
        })
        fullText += '\n\n'
      }
      const extractedText = fullText.trim()

      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('resumeText', extractedText)
      
      console.log('Extracted resume text:', extractedText)
      console.log('Text length:', extractedText.length)

      const res = await fetch('/api/profile/upload-resume', { 
        method: 'POST', 
        body: formData 
      })
      const data = await res.json()
      
      if (res.ok) {
        setResumeUrl(data.resumePdfUrl)
        showMessage('success', 'Resume uploaded and text saved')
        setResumeFile(null)
      } else {
        showMessage('error', data.error || 'Upload failed')
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      showMessage('error', err?.message || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  return () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview)
  }
}, [photoPreview])

  const handleDriveLinkSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile/drive-link', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ resumeDriveLink: driveLink }) 
      })
      const data = await res.json()
      
      if (res.ok) {
        showMessage('success', data.message || 'Drive link updated')
        setDriveLink(data.resumeDriveLink || '')
      } else {
        showMessage('error', data.error || 'Update failed')
      }
    } catch (err: any) { 
      showMessage('error', err?.message || 'Update failed')
    }
    setLoading(false)
  }

  const handleSmtpSave = async () => {
    if (
      !smtp.email.trim() ||
      !smtp.host.trim() ||
      !smtp.port.trim() ||
      !smtp.password.trim()
    ) {
      showMessage('error', 'All SMTP fields are required')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/profile/smtp', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ 
          smtpEmail: smtp.email, 
          smtpHost: smtp.host, 
          smtpPort: smtp.port, 
          smtpPassword: smtp.password 
        }) 
      })
      const data = await res.json()
      
      if (res.ok) {
        showMessage('success', data.message || 'SMTP configuration saved')
        setSmtp({ ...smtp, password: '' })
      } else {
        showMessage('error', data.error || 'SMTP save failed')
      }
    } catch (err: any) { 
      showMessage('error', err?.message || 'SMTP save failed')
    }
    setLoading(false)
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
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Setup</h1>
          <p className="text-slate-600">Configure your resume, SMTP settings, and profile information</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Photo Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center text-purple-600">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-semibold text-slate-900">Profile Photo</h2>
              </div>

              <div
                onDragOver={handlePhotoDragOver}
                onDragLeave={handlePhotoDragLeave}
                onDrop={handlePhotoDrop}
                onClick={() => photoInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                  photoDragging
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                {displayImage ? (

                  <div className="relative aspect-square">
                    <img
                      src={displayImage}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square flex flex-col items-center justify-center p-6">
                    <Upload className={`w-12 h-12 mb-3 ${
                      photoDragging ? 'text-blue-500' : 'text-slate-400'
                    }`} />
                    <p className="text-sm font-medium text-slate-700 text-center">
                      {photoDragging ? 'Drop image here' : 'Click or drag to upload'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) uploadPhoto(file)
                  }}
                  className="hidden"
                />
              </div>

              {session?.user && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-900">{session.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume Upload Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">Resume Upload</h2>
                  <p className="text-sm text-slate-600">Upload your resume PDF for AI analysis</p>
                </div>
              </div>

              <div
                onDragOver={handleResumeDragOver}
                onDragLeave={handleResumeDragLeave}
                onDrop={handleResumeDrop}
                onClick={() => resumeInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all mb-4 ${
                  resumeDragging
                    ? 'border-blue-500 bg-blue-50'
                    : resumeFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <div className="text-center">
                  <Upload className={`w-12 h-12 mx-auto mb-3 ${
                    resumeDragging ? 'text-blue-500' : 
                    resumeFile ? 'text-green-500' : 'text-slate-400'
                  }`} />
                  {resumeFile ? (
                    <>
                      <p className="text-sm font-medium text-green-700 mb-1">{resumeFile.name}</p>
                      <p className="text-xs text-green-600">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-slate-700">
                        {resumeDragging ? 'Drop PDF here' : 'Click or drag PDF to upload'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF only, max 5MB</p>
                    </>
                  )}
                </div>
                <input
                  ref={resumeInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </div>

              {resumeUrl && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Resume uploaded successfully</span>
                </div>
              )}

              <button
                onClick={handleResumeUpload}
                disabled={loading || !resumeFile}
                className="w-full bg-gradient-to-r from-green-600 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Resume
                  </>
                )}
              </button>
            </div>

            {/* Drive Link Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center text-green-600">
                  <LinkIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">Google Drive Link</h2>
                  <p className="text-sm text-slate-600">Optional: Link to your resume on Google Drive</p>
                </div>
              </div>

              <input
                type="url"
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
                className="w-full px-4 py-3 border text-blue-400 text-1xl border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              />

              <button
                onClick={handleDriveLinkSave}
                disabled={loading}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition"
              >
                Save Drive Link
              </button>
            </div>

            {/* SMTP Configuration Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center text-orange-600">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">SMTP Configuration</h2>
                  <p className="text-sm text-slate-600">Configure your email sending settings</p>
                </div>
                  <button
                    onClick={() => router.push('/documentation')}
                    className="text-sm font-medium text-white bg-black px-4 py-2 rounded-xl 
           hover:bg-gray-900 hover:text-blue-400 cursor-pointer 
           transition-all duration-200"
           >
                    Guide
                  </button>

              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  required
                  placeholder="SMTP Email"
                  value={smtp.email}
                  onChange={(e) => setSmtp({ ...smtp, email: e.target.value })}
                  className="px-4 py-3 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  required
                  placeholder="SMTP Host (e.g., smtp.gmail.com)"
                  value={smtp.host}
                  onChange={(e) => setSmtp({ ...smtp, host: e.target.value })}
                  className="px-4 py-3 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  required
                  placeholder="Port (e.g., 587)"
                  value={smtp.port}
                  onChange={(e) => setSmtp({ ...smtp, port: e.target.value })}
                  className="px-4 py-3 border text-black  border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="password"
                  required
                  placeholder="App Password"
                  value={smtp.password}
                  onChange={(e) => setSmtp({ ...smtp, password: e.target.value })}
                  className="px-4 py-3 border text-black border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700">
                  💡 Use an app-specific password for better security. Your credentials are encrypted.
                </p>
              </div>

              <button
                onClick={handleSmtpSave}
                disabled={
    loading ||
    !smtp.email.trim() ||
    !smtp.host.trim() ||
    !smtp.port.trim() ||
    !smtp.password.trim()
  }
                
                className="w-full hover:cursor-pointer bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg disabled:opacity-50 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    Save SMTP Configuration
                  </>
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/workspace')}
                className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
              >
                Go to Workspace
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 font-medium bg-slate-500 text-slate-900 hover:bg-slate-600 transition"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
