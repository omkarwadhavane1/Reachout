// 'use client';

// import { useState, useEffect } from 'react';
// import { useSession } from 'next-auth/react';
// import { useRouter } from 'next/navigation';

// interface Log {
//   id: string;
//   recruiterEmail: string;
//   subject: string;
//   status: string;
//   errorMessage?: string;
//   createdAt: string;
// }

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [logs, setLogs] = useState<Log[]>([]);
//   const [stats, setStats] = useState({ sent: 0, failed: 0 });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === 'unauthenticated') {
//       router.push('/login');
//     } else if (status === 'authenticated') {
//       fetchLogs();
//     }
//   }, [status, router]);

//   const fetchLogs = async () => {
//     try {
//       const res = await fetch('/api/logs');
//       const data = await res.json();
//       setLogs(data.logs);
//       setStats(data.stats);
//     } catch (err) {
//       console.error('Failed to fetch logs:', err);
//     }
//     setLoading(false);
//   };

//   if (status === 'loading' || loading) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-500 py-8">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="bg-gray-500 rounded-lg shadow p-6">
//           <h1 className="text-2xl font-bold mb-6">Application History</h1>

//           {/* Stats */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             <div className="bg-green-200 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Total Sent</p>
//               <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
//             </div>
//             <div className="bg-red-50 p-4 rounded-lg">
//               <p className="text-sm text-gray-600">Failed</p>
//               <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
//             </div>
//           </div>

//           {/* Logs Table */}
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="bg-black">
//                   <th className="px-4 py-2 text-left">Email</th>
//                   <th className="px-4 py-2 text-left">Subject</th>
//                   <th className="px-4 py-2 text-left">Status</th>
//                   <th className="px-4 py-2 text-left">Date</th>
//                   <th className="px-4 py-2 text-left">Error</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logs.map((log) => (
//                   <tr key={log.id} className="border-b">
//                     <td className="px-4 py-2">{log.recruiterEmail}</td>
//                     <td className="px-4 py-2 truncate max-w-xs">{log.subject}</td>
//                     <td className="px-4 py-2">
//                       <span
//                         className={`px-2 py-1 rounded text-xs ${
//                           log.status === 'SENT'
//                             ? 'bg-green-400 text-green-800'
//                             : 'bg-red-300 text-red-800'
//                         }`}
//                       >
//                         {log.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-2 text-sm text-gray-600">
//                       {new Date(log.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-4 py-2 text-sm text-red-600 truncate max-w-xs">
//                       {log.errorMessage || '-'}
//                     </td>
//                     <td>
//                       <button className="text-blue-600 hover:underline" onClick={() => router.push(`/dashboard/log/${log.id}`)}>
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           {logs.length === 0 && (
//             <p className="text-center text-gray-500 py-8">No applications yet</p>
//           )}

//           <button
//             onClick={() => router.push('/workspace')}
//             className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//           >
//             Back to Workspace
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// ============================================
// app/dashboard/page.tsx
// Enhanced Dashboard with Email History
// ============================================

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import {
  Mail, CheckCircle, XCircle, Clock, TrendingUp, Calendar,
  Search, Filter, Eye, Download, Loader, AlertCircle, ArrowUpRight
} from 'lucide-react'

interface Log {
  id: string
  recruiterEmail: string
  subject: string
  body: string
  status: string
  errorMessage?: string
  createdAt: string
  generationMode: string
  role?: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [logs, setLogs] = useState<Log[]>([])
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([])
  const [stats, setStats] = useState({ sent: 0, failed: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SENT' | 'FAILED'>('ALL')
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchLogs()
    }
  }, [status, router])

  useEffect(() => {
    let filtered = logs

    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(log => log.status === statusFilter)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(log =>
        log.recruiterEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.role?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredLogs(filtered)
  }, [logs, searchQuery, statusFilter])

  useEffect(() => {
  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && selectedLog) {
      setSelectedLog(null);
    }
  };

  // Add event listener when modal is open
  if (selectedLog) {
    document.addEventListener('keydown', handleEscKey);
  }

  // Cleanup: remove event listener when component unmounts or modal closes
  return () => {
    document.removeEventListener('keydown', handleEscKey);
  };
}, [selectedLog]); 

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs')
      const data = await res.json()
      setLogs(data.logs)
      setFilteredLogs(data.logs)
      setStats(data.stats)
    } catch (err) {
      console.error('Failed to fetch logs:', err)
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const exportToCSV = () => {
    const headers = ['Email', 'Subject', 'Status', 'Date', 'Role', 'Error']
    const rows = filteredLogs.map(log => [
      log.recruiterEmail,
      log.subject,
      log.status,
      log.body,
      
      formatDate(log.createdAt),
      log.role || '',
      log.errorMessage || ''
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `email-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  if (status === 'loading' || loading) {
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
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Email History</h1>
          <p className="text-slate-600">Track all your sent applications and their statuses</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 border-black  rounded-xl border-4 bg-gray-300 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-400 rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black  text-2xl font-medium">Total Sent</span>
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{logs.length}</p>
            <p className="text-1xl text-slate-900 mt-1">All applications</p>
          </div>

          <div className="bg-gray-300 rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className=" text-black  text-2xl text-2xl font-medium">Successful</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.sent}</p>
            <p className="text-1xl text-slate-900 mt-1">
              {logs.length > 0 ? Math.round((stats.sent / logs.length) * 100) : 0}% success rate
            </p>
          </div>

          <div className="bg-gray-400 rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black  text-2xl font-medium">Failed</span>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-1xl text-slate-900 mt-1">Needs attention</p>
          </div>

          <div className="bg-gray-300 rounded-xl border border-slate-200 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-black text-2xl  font-medium">This Week</span>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {logs.filter(log => {
                const logDate = new Date(log.createdAt)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return logDate > weekAgo
              }).length}
            </p>
            <p className="text-1xl text-slate-900 mt-1">Last 7 days</p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl  border border-slate-300 p-6 mb-6">
          <div className="flex flex-col  md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by email, subject, or role..."
                className="w-full pl-10 pr-4 py-3 border text-black border-slate-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                  statusFilter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('SENT')}
                className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                  statusFilter === 'SENT'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Sent
              </button>
              <button
                onClick={() => setStatusFilter('FAILED')}
                className={`px-4 py-3 rounded-lg  border-2 font-medium transition ${
                  statusFilter === 'FAILED'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Failed
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-purple-300 rounded-xl border border-slate-200 overflow-hidden">
          {filteredLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Recipient
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{log.recruiterEmail}</p>
                            <p className="text-xs text-slate-500">{log.role ? 'Role Based' : 'JD Based'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 truncate max-w-xs" title={log.subject}>
                          {log.subject}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600">{log.role || '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {log.status === 'SENT' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Sent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            <XCircle className="w-3 h-3" />
                            Failed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          {formatDate(log.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No applications found</h3>
              <p className="text-slate-600 mb-6">
                {searchQuery || statusFilter !== 'ALL'
                  ? 'Try adjusting your filters'
                  : 'Start sending applications from the workspace'}
              </p>
              <button
                onClick={() => router.push('/workspace')}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
              >
                Go to Workspace
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Email Details</h3>
                <p className="text-sm text-slate-600 mt-1">{formatDate(selectedLog.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <XCircle className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                {selectedLog.status === 'SENT' ? (
                  <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Successfully Sent</span>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Failed to Send</span>
                    </div>
                    {selectedLog.errorMessage && (
                      <p className="text-sm text-red-600 ml-7">{selectedLog.errorMessage}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Recipient */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipient</label>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">{selectedLog.recruiterEmail}</span>
                </div>
              </div>

              {/* Role */}
              {selectedLog.role && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <p className="bg-slate-50 p-4 rounded-lg text-slate-900">{selectedLog.role}</p>
                </div>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <p className="bg-slate-50 p-4 rounded-lg text-slate-900">{selectedLog.subject}</p>
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Body</label>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-900">
                    {selectedLog.body}
                  </pre>
                </div>
              </div>

              {/* Generation Mode */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Generation Mode</label>
                <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium">
                  {selectedLog.role ? '🎯 Role Based' : '📄 Job Description Based'}

                  
                  
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full bg-slate-900 text-white px-6 py-3 rounded-lg hover:bg-slate-800 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}