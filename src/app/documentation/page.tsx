// 'use client'

// import { useState, useEffect } from 'react'
// import { Edit, Plus, Trash2, Save, X, Upload, MoveUp, MoveDown, Loader } from 'lucide-react'
// import { useSession } from 'next-auth/react'

// type Step = {
//   id?: string
//   title: string
//   content: string
//   imageUrl?: string
//   order: number
// }

// type Section = {
//   id: string
//   title: string
//   description?: string
//   order: number
//   steps: Step[]
// }

// export default function DocumentationPage() {
//   const [sections, setSections] = useState<Section[]>([])
//   const [loading, setLoading] = useState(true)
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [editMode, setEditMode] = useState(false)
//   const [editingSection, setEditingSection] = useState<Section | null>(null)
//   const [showAddForm, setShowAddForm] = useState(false)

//   // New section form state
//   const [newSection, setNewSection] = useState({
//     title: '',
//     description: '',
//     steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
//   })

//   // Check admin status
//   const { data: session, status } = useSession()

// useEffect(() => {
//   if (status === 'authenticated') {
//     setIsAdmin(session.user?.email === 'sanketadsare5@gmail.com')
//   } else {
//     setIsAdmin(false)
//   }
// }, [session, status])

// useEffect(() => {
//   if (!isAdmin) {
//     setEditMode(false)
//     setEditingSection(null)
//   }
// }, [isAdmin])


//   // Fetch documentation
//   useEffect(() => {
//     fetchDocumentation()
//   }, [])

//   const fetchDocumentation = async () => {
//     try {
//       const res = await fetch('/api/documentation')
//       const data = await res.json()
//       setSections(data)
//     } catch (error) {
//       console.error('Failed to fetch documentation:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleImageUpload = async (
//     e: React.ChangeEvent<HTMLInputElement>,
//     stepIndex: number,
//     isEdit: boolean = false
//   ) => {
//     const file = e.target.files?.[0]
//     if (!file) return

//     try {
//       const formData = new FormData()
//       formData.append('file', file)

//       const res = await fetch('/api/upload-doc', {
//         method: 'POST',
//         body: formData
//       })

//       if (!res.ok) throw new Error('Upload failed')

//       const data = await res.json()
//       const imageUrl = data.url

//       if (isEdit && editingSection) {
//         const updatedSteps = [...editingSection.steps]
//         updatedSteps[stepIndex].imageUrl = imageUrl
//         setEditingSection({ ...editingSection, steps: updatedSteps })
//       } else {
//         const updatedSteps = [...newSection.steps]
//         updatedSteps[stepIndex].imageUrl = imageUrl
//         setNewSection({ ...newSection, steps: updatedSteps })
//       }
//     } catch (error) {
//       console.error('Upload failed:', error)
//       alert('Failed to upload image')
//     }
//   }

//   const addStepToForm = (isEdit: boolean = false) => {
//     if (isEdit && editingSection) {
//       setEditingSection({
//         ...editingSection,
//         steps: [
//           ...editingSection.steps,
//           { title: '', content: '', imageUrl: '', order: editingSection.steps.length }
//         ]
//       })
//     } else {
//       setNewSection({
//         ...newSection,
//         steps: [
//           ...newSection.steps,
//           { title: '', content: '', imageUrl: '', order: newSection.steps.length }
//         ]
//       })
//     }
//   }

//   const removeStepFromForm = (index: number, isEdit: boolean = false) => {
//     if (isEdit && editingSection) {
//       const updatedSteps = editingSection.steps.filter((_, i) => i !== index)
//       setEditingSection({ ...editingSection, steps: updatedSteps })
//     } else {
//       const updatedSteps = newSection.steps.filter((_, i) => i !== index)
//       setNewSection({ ...newSection, steps: updatedSteps })
//     }
//   }

//   const handleAddSection = async () => {
//     if (!newSection.title.trim()) {
//       alert('Section title is required')
//       return
//     }

//     if (newSection.steps.some(s => !s.title.trim() || !s.content.trim())) {
//       alert('All steps must have title and content')
//       return
//     }

//     try {
//       const res = await fetch('/api/documentation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newSection)
//       })

//       if (!res.ok) throw new Error('Failed to create section')

//       await fetchDocumentation()
//       setNewSection({
//         title: '',
//         description: '',
//         steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
//       })
//       setShowAddForm(false)
//     } catch (error) {
//       console.error('Failed to add section:', error)
//       alert('Failed to add section')
//     }
//   }

//   const handleEditSection = (section: Section) => {
//     setEditingSection({ ...section })
//   }

//   const handleSaveEdit = async () => {
//     if (!editingSection) return

//     if (!editingSection.title.trim()) {
//       alert('Section title is required')
//       return
//     }

//     try {
//       const res = await fetch(`/api/documentation/${editingSection.id}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(editingSection)
//       })

//       if (!res.ok) throw new Error('Failed to update section')

//       await fetchDocumentation()
//       setEditingSection(null)
//     } catch (error) {
//       console.error('Failed to update section:', error)
//       alert('Failed to update section')
//     }
//   }

//   const handleDeleteSection = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this section?')) return

//     try {
//       const res = await fetch(`/api/documentation/${id}`, {
//         method: 'DELETE'
//       })

//       if (!res.ok) throw new Error('Failed to delete section')

//       await fetchDocumentation()
//     } catch (error) {
//       console.error('Failed to delete section:', error)
//       alert('Failed to delete section')
//     }
//   }

//   const handleMoveSection = async (id: string, direction: 'up' | 'down') => {
//     const index = sections.findIndex(s => s.id === id)
//     if (index === -1) return
//     if (direction === 'up' && index === 0) return
//     if (direction === 'down' && index === sections.length - 1) return

//     const newSections = [...sections]
//     const targetIndex = direction === 'up' ? index - 1 : index + 1
    
//     ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

//     // Update local state immediately
//     setSections(newSections)

//     // Update in database
//     try {
//       const sectionIds = newSections.map(s => s.id)
//       await fetch('/api/documentation/reorder', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sectionIds })
//       })
//     } catch (error) {
//       console.error('Failed to reorder sections:', error)
//       // Revert on error
//       await fetchDocumentation()
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
//         <div className="text-center">
//           <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-slate-600">Loading documentation...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
//       {/* Header */}
//       <header className="bg-white border-b shadow-sm sticky top-0 z-40">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900">Documentation</h1>
//               <p className="text-sm text-slate-600 mt-1">Learn how to use our platform</p>
//             </div>
            
//             {isAdmin && (
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setEditMode(!editMode)}
//                   className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
//                     editMode 
//                       ? 'bg-red-600 text-white hover:bg-red-700' 
//                       : 'bg-blue-600 text-white hover:bg-blue-700'
//                   }`}
//                 >
//                   {editMode ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
//                   {editMode ? 'Exit Edit Mode' : 'Edit Mode'}
//                 </button>
                
//                 {editMode && (
//                   <button
//                     onClick={() => setShowAddForm(true)}
//                     className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Section
//                   </button>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="container mx-auto px-6 py-12 max-w-5xl">
//         {/* Admin Info Banner */}
//         {isAdmin && !editMode && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
//             <p className="text-blue-800 text-sm">
//               👋 Welcome Admin! Click "Edit Mode" to manage documentation sections.
//             </p>
//           </div>
//         )}

//         {/* Sections */}
//         <div className="space-y-12">
//           {sections.map((section, index) => (
//             <div
//               key={section.id}
//               className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
//             >
//               {editingSection?.id === section.id ? (
//                 // Edit Form
//                 <div className="p-6 space-y-6">
//                   <input
//                     type="text"
//                     value={editingSection.title}
//                     onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
//                     className="w-full text-2xl font-bold px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="Section Title"
//                   />
                  
//                   <textarea
//                     value={editingSection.description || ''}
//                     onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
//                     rows={2}
//                     className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                     placeholder="Section description (optional)"
//                   />

//                   {/* Steps */}
//                   <div className="space-y-4">
//                     <div className="flex items-center justify-between">
//                       <h3 className="font-semibold text-slate-800">Steps</h3>
//                       <button
//                         onClick={() => addStepToForm(true)}
//                         className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
//                       >
//                         + Add Step
//                       </button>
//                     </div>

//                     {editingSection.steps.map((step, stepIdx) => (
//                       <div key={stepIdx} className="border border-slate-300 rounded-lg p-4 space-y-3">
//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-slate-600">Step {stepIdx + 1}</span>
//                           {editingSection.steps.length > 1 && (
//                             <button
//                               onClick={() => removeStepFromForm(stepIdx, true)}
//                               className="text-red-600 hover:text-red-700"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           )}
//                         </div>

//                         <input
//                           type="text"
//                           value={step.title}
//                           onChange={(e) => {
//                             const updatedSteps = [...editingSection.steps]
//                             updatedSteps[stepIdx].title = e.target.value
//                             setEditingSection({ ...editingSection, steps: updatedSteps })
//                           }}
//                           className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
//                           placeholder="Step title"
//                         />

//                         <textarea
//                           value={step.content}
//                           onChange={(e) => {
//                             const updatedSteps = [...editingSection.steps]
//                             updatedSteps[stepIdx].content = e.target.value
//                             setEditingSection({ ...editingSection, steps: updatedSteps })
//                           }}
//                           rows={3}
//                           className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
//                           placeholder="Step content"
//                         />

//                         {step.imageUrl ? (
//                           <div className="relative">
//                             <img src={step.imageUrl} alt="Step" className="w-full h-40 object-cover rounded" />
//                             <button
//                               onClick={() => {
//                                 const updatedSteps = [...editingSection.steps]
//                                 updatedSteps[stepIdx].imageUrl = ''
//                                 setEditingSection({ ...editingSection, steps: updatedSteps })
//                               }}
//                               className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full"
//                             >
//                               <X className="w-3 h-3" />
//                             </button>
//                           </div>
//                         ) : (
//                           <label className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded cursor-pointer hover:bg-slate-50">
//                             <Upload className="w-6 h-6 text-slate-400" />
//                             <input
//                               type="file"
//                               accept="image/*"
//                               onChange={(e) => handleImageUpload(e, stepIdx, true)}
//                               className="hidden"
//                             />
//                           </label>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={handleSaveEdit}
//                       className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
//                     >
//                       <Save className="w-4 h-4" />
//                       Save Changes
//                     </button>
//                     <button
//                       onClick={() => setEditingSection(null)}
//                       className="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg hover:bg-slate-300"
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 // Display Mode
//                 <div className="p-8">
//                   <div className="flex items-start justify-between mb-6">
//                     <div>
//                       <h2 className="text-3xl font-bold text-slate-900 mb-2">{section.title}</h2>
//                       {section.description && (
//                         <p className="text-slate-600">{section.description}</p>
//                       )}
//                     </div>
                    
//                     {editMode && (
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => handleMoveSection(section.id, 'up')}
//                           disabled={index === 0}
//                           className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
//                         >
//                           <MoveUp className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleMoveSection(section.id, 'down')}
//                           disabled={index === sections.length - 1}
//                           className="p-2 text-slate-600 hover:bg-slate-100 rounded disabled:opacity-30"
//                         >
//                           <MoveDown className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleEditSection(section)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button
//                           onClick={() => handleDeleteSection(section.id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     )}
//                   </div>

//                   {/* Steps */}
//                   <div className="space-y-8">
//                     {section.steps.map((step, stepIdx) => (
//                       <div key={step.id || stepIdx} className="border-l-4 border-blue-500 pl-6">
//                         <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
//                         <p className="text-slate-700 leading-relaxed mb-4 whitespace-pre-wrap">
//                           {step.content}
//                         </p>
//                         {step.imageUrl && (
//                           <img
//                             src={step.imageUrl}
//                             alt={step.title}
//                             className="rounded-lg border border-slate-200 max-w-full"
//                           />
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Empty State */}
//         {sections.length === 0 && (
//           <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//             <p className="text-slate-600 text-lg mb-2">No documentation sections yet.</p>
//             {isAdmin && (
//               <p className="text-slate-500 text-sm">Click "Add Section" to get started.</p>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Add Section Modal */}
//       {showAddForm && (
//         <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl my-8">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-2xl font-bold text-slate-900">Add New Section</h3>
//               <button
//                 onClick={() => {
//                   setShowAddForm(false)
//                   setNewSection({
//                     title: '',
//                     description: '',
//                     steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
//                   })
//                 }}
//                 className="p-2 hover:bg-slate-100 rounded-lg"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//               <input
//                 type="text"
//                 value={newSection.title}
//                 onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
//                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 placeholder="Section Title *"
//               />

//               <textarea
//                 value={newSection.description}
//                 onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
//                 rows={2}
//                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
//                 placeholder="Section description (optional)"
//               />

//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h4 className="font-semibold text-slate-800">Steps</h4>
//                   <button
//                     onClick={() => addStepToForm(false)}
//                     className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100"
//                   >
//                     + Add Step
//                   </button>
//                 </div>

//                 {newSection.steps.map((step, stepIdx) => (
//                   <div key={stepIdx} className="border border-slate-300 rounded-lg p-4 space-y-3">
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm font-medium text-slate-600">Step {stepIdx + 1}</span>
//                       {newSection.steps.length > 1 && (
//                         <button
//                           onClick={() => removeStepFromForm(stepIdx, false)}
//                           className="text-red-600 hover:text-red-700"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       )}
//                     </div>

//                     <input
//                       type="text"
//                       value={step.title}
//                       onChange={(e) => {
//                         const updatedSteps = [...newSection.steps]
//                         updatedSteps[stepIdx].title = e.target.value
//                         setNewSection({ ...newSection, steps: updatedSteps })
//                       }}
//                       className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
//                       placeholder="Step title *"
//                     />

//                     <textarea
//                       value={step.content}
//                       onChange={(e) => {
//                         const updatedSteps = [...newSection.steps]
//                         updatedSteps[stepIdx].content = e.target.value
//                         setNewSection({ ...newSection, steps: updatedSteps })
//                       }}
//                       rows={3}
//                       className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 resize-none"
//                       placeholder="Step content *"
//                     />

//                     {step.imageUrl ? (
//                       <div className="relative">
//                         <img src={step.imageUrl} alt="Step" className="w-full h-40 object-cover rounded" />
//                         <button
//                           onClick={() => {
//                             const updatedSteps = [...newSection.steps]
//                             updatedSteps[stepIdx].imageUrl = ''
//                             setNewSection({ ...newSection, steps: updatedSteps })
//                           }}
//                           className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full"
//                         >
//                           <X className="w-3 h-3" />
//                         </button>
//                       </div>
//                     ) : (
//                       <label className="flex items-center justify-center h-24 border-2 border-dashed border-slate-300 rounded cursor-pointer hover:bg-slate-50">
//                         <Upload className="w-6 h-6 text-slate-400" />
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={(e) => handleImageUpload(e, stepIdx, false)}
//                           className="hidden"
//                         />
//                       </label>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div className="flex gap-2 pt-4 sticky bottom-0 bg-white">
//                 <button
//                   onClick={handleAddSection}
//                   className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium"
//                 >
//                   Add Section
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddForm(false)
//                     setNewSection({
//                       title: '',
//                       description: '',
//                       steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
//                     })
//                   }}
//                   className="flex-1 bg-slate-200 text-slate-700 py-2.5 rounded-lg hover:bg-slate-300 font-medium"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { Edit, Plus, Trash2, Save, X, Upload, MoveUp, MoveDown, Loader, BookOpen, CheckCircle2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import AppLayout from '@/components/layout/AppLayout'

type Step = {
  id?: string
  title: string
  content: string
  imageUrl?: string
  order: number
}

type Section = {
  id: string
  title: string
  description?: string
  order: number
  steps: Step[]
}

export default function DocumentationPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // New section form state
  const [newSection, setNewSection] = useState({
    title: '',
    description: '',
    steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
  })

  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      setIsAdmin(session.user?.email === 'sanketadsare5@gmail.com')
    } else {
      setIsAdmin(false)
    }
  }, [session, status])

  useEffect(() => {
    if (!isAdmin) {
      setEditMode(false)
      setEditingSection(null)
    }
  }, [isAdmin])

  useEffect(() => {
    fetchDocumentation()
  }, [])

  const fetchDocumentation = async () => {
    try {
      const res = await fetch('/api/documentation')
      const data = await res.json()
      setSections(data)
    } catch (error) {
      console.error('Failed to fetch documentation:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    stepIndex: number,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload-doc', {
        method: 'POST',
        body: formData
      })

      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      const imageUrl = data.url

      if (isEdit && editingSection) {
        const updatedSteps = [...editingSection.steps]
        updatedSteps[stepIndex].imageUrl = imageUrl
        setEditingSection({ ...editingSection, steps: updatedSteps })
      } else {
        const updatedSteps = [...newSection.steps]
        updatedSteps[stepIndex].imageUrl = imageUrl
        setNewSection({ ...newSection, steps: updatedSteps })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload image')
    }
  }

  const addStepToForm = (isEdit: boolean = false) => {
    if (isEdit && editingSection) {
      setEditingSection({
        ...editingSection,
        steps: [
          ...editingSection.steps,
          { title: '', content: '', imageUrl: '', order: editingSection.steps.length }
        ]
      })
    } else {
      setNewSection({
        ...newSection,
        steps: [
          ...newSection.steps,
          { title: '', content: '', imageUrl: '', order: newSection.steps.length }
        ]
      })
    }
  }

  const removeStepFromForm = (index: number, isEdit: boolean = false) => {
    if (isEdit && editingSection) {
      const updatedSteps = editingSection.steps.filter((_, i) => i !== index)
      setEditingSection({ ...editingSection, steps: updatedSteps })
    } else {
      const updatedSteps = newSection.steps.filter((_, i) => i !== index)
      setNewSection({ ...newSection, steps: updatedSteps })
    }
  }

  const handleAddSection = async () => {
    if (!newSection.title.trim()) {
      alert('Section title is required')
      return
    }

    if (newSection.steps.some(s => !s.title.trim() || !s.content.trim())) {
      alert('All steps must have title and content')
      return
    }

    try {
      const res = await fetch('/api/documentation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      })

      if (!res.ok) throw new Error('Failed to create section')

      await fetchDocumentation()
      setNewSection({
        title: '',
        description: '',
        steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
      })
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add section:', error)
      alert('Failed to add section')
    }
  }

  const handleEditSection = (section: Section) => {
    setEditingSection({ ...section })
  }

  const handleSaveEdit = async () => {
    if (!editingSection) return

    if (!editingSection.title.trim()) {
      alert('Section title is required')
      return
    }

    try {
      const res = await fetch(`/api/documentation/${editingSection.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSection)
      })

      if (!res.ok) throw new Error('Failed to update section')

      await fetchDocumentation()
      setEditingSection(null)
    } catch (error) {
      console.error('Failed to update section:', error)
      alert('Failed to update section')
    }
  }

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return

    try {
      const res = await fetch(`/api/documentation/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete section')

      await fetchDocumentation()
    } catch (error) {
      console.error('Failed to delete section:', error)
      alert('Failed to delete section')
    }
  }

  const handleMoveSection = async (id: string, direction: 'up' | 'down') => {
    const index = sections.findIndex(s => s.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === sections.length - 1) return

    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    setSections(newSections)

    try {
      const sectionIds = newSections.map(s => s.id)
      await fetch('/api/documentation/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionIds })
      })
    } catch (error) {
      console.error('Failed to reorder sections:', error)
      await fetchDocumentation()
    }
  }

  if (loading) {
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
    <div className="min-h-screen bg-white/10">
      {/* Header with Glass Effect */}
      <header className="bg-slate-100/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto  px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-black bg-clip-text text-transparent">
                  Documentation
                </h1>
                <p className="text-sm text-slate-800 mt-1">Master our platform step by step</p>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-3">
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    editMode 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
                  }`}
                >
                  {editMode ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {editMode ? 'Exit Edit' : 'Edit Mode'}
                </button>
                
                {editMode && (
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 bg-green-500/20 text-green-400 border border-green-500/30 px-5 py-2.5 rounded-xl hover:bg-green-500/30 transition-all duration-200 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Section
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Admin Info Banner */}
        {isAdmin && !editMode && (
          <div className="bg-red-100/10 border border-blue-500/30 rounded-2xl p-5 mb-10 backdrop-blur-sm">
            <p className="text-blue-400 text-sm flex items-center gap-2">
              <span className="text-xl">👋</span>
              Welcome Admin! Click "Edit Mode" to manage documentation sections.
            </p>
          </div>
        )}

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-slate-80/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {editingSection?.id === section.id ? (
                // Edit Form
                <div className="p-8 space-y-6">
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full text-2xl font-bold px-5 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                    placeholder="Section Title"
                  />
                  
                  <textarea
                    value={editingSection.description || ''}
                    onChange={(e) => setEditingSection({ ...editingSection, description: e.target.value })}
                    rows={2}
                    className="w-full px-5 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none text-slate-300 placeholder-slate-500"
                    placeholder="Section description (optional)"
                  />

                  {/* Steps in Edit Mode */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-200">Steps</h3>
                      <button
                        onClick={() => addStepToForm(true)}
                        className="text-sm bg-blue-500/20 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
                      >
                        + Add Step
                      </button>
                    </div>

                    {editingSection.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="bg-slate-900/50 border border-slate-600 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-black">Step {stepIdx + 1}</span>
                          {editingSection.steps.length > 1 && (
                            <button
                              onClick={() => removeStepFromForm(stepIdx, true)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updatedSteps = [...editingSection.steps]
                            updatedSteps[stepIdx].title = e.target.value
                            setEditingSection({ ...editingSection, steps: updatedSteps })
                          }}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                          placeholder="Step title"
                        />

                        <textarea
                          value={step.content}
                          onChange={(e) => {
                            const updatedSteps = [...editingSection.steps]
                            updatedSteps[stepIdx].content = e.target.value
                            setEditingSection({ ...editingSection, steps: updatedSteps })
                          }}
                          rows={3}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-slate-300 placeholder-slate-500"
                          placeholder="Step content"
                        />

                        {step.imageUrl ? (
                          <div className="relative">
                            <img src={step.imageUrl} alt="Step" className="w-full h-48 object-cover rounded-lg border border-slate-700" />
                            <button
                              onClick={() => {
                                const updatedSteps = [...editingSection.steps]
                                updatedSteps[stepIdx].imageUrl = ''
                                setEditingSection({ ...editingSection, steps: updatedSteps })
                              }}
                              className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800/50 hover:border-blue-500/50 transition-all">
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                              <span className="text-sm text-slate-400">Click to upload image</span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, stepIdx, true)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 font-medium transition-all shadow-lg"
                    >
                      <Save className="w-5 h-5" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingSection(null)}
                      className="flex-1 bg-slate-700 text-slate-300 py-3 rounded-xl hover:bg-slate-600 font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display Mode - Beautiful User-Facing View
                <div className="p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h2 className="text-4xl font-bold bg-black bg-clip-text text-transparent mb-3">
                        {section.title}
                      </h2>
                      {section.description && (
                        <p className="text-slate-900 text-lg">{section.description}</p>
                      )}
                    </div>
                    
                    {editMode && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleMoveSection(section.id, 'up')}
                          disabled={index === 0}
                          className="p-2 text-slate-900 hover:bg-slate-900/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveUp className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(section.id, 'down')}
                          disabled={index === sections.length - 1}
                          className="p-2 text-slate-400 hover:bg-slate-700/50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <MoveDown className="w-5 h-5 text-black" />
                        </button>
                        <button
                          onClick={() => handleEditSection(section)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg border border-blue-500/30"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(section.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg border border-red-500/30"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Steps - Beautiful Display */}
                  <div className="space-y-8">
                    {section.steps.map((step, stepIdx) => (
                      <div key={step.id || stepIdx} className="group">
                        <div className="flex gap-6">
                          {/* Step Number Circle */}
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-200 to-gray-300 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                              <span className="text-black font-bold text-lg">{stepIdx + 1}</span>
                            </div>
                            {stepIdx < section.steps.length - 1 && (
                              <div className="w-0.5 h-full bg-gradient-to-b from-blue-900/50 to-transparent ml-6 mt-2" />
                            )}
                          </div>

                          {/* Step Content */}
                          <div className="flex-1 pb-6">
                            <div className="flex items-start gap-3 mb-4">
                              <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                              <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-400 transition-colors">
                                {step.title}
                              </h3>
                            </div>
                            
                            <p className="text-slate-900 leading-relaxed text-lg mb-6 pl-9 whitespace-pre-wrap">
                              {step.content}
                            </p>

                            {step.imageUrl && (
                              <div className="pl-9">
                                <div className="rounded-2xl overflow-hidden border-2 border-slate-700/50 shadow-2xl hover:border-blue-500/50 transition-all duration-300">
                                  <img
                                    src={step.imageUrl}
                                    alt={step.title}
                                    className="w-full h-auto"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sections.length === 0 && (
          <div className="text-center py-20 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-xl mb-2">No documentation sections yet</p>
            {isAdmin && (
              <p className="text-slate-500">Click "Add Section" to get started</p>
            )}
          </div>
        )}
      </main>

      {/* Add Section Modal - Dark Theme */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Add New Section
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewSection({
                    title: '',
                    description: '',
                    steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
                  })
                }}
                className="p-2 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              <input
                type="text"
                value={newSection.title}
                onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                className="w-full px-5 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                placeholder="Section Title *"
              />

              <textarea
                value={newSection.description}
                onChange={(e) => setNewSection({ ...newSection, description: e.target.value })}
                rows={2}
                className="w-full px-5 py-3 bg-slate-900/50 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none text-slate-300 placeholder-slate-500"
                placeholder="Section description (optional)"
              />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-200 text-lg">Steps</h4>
                  <button
                    onClick={() => addStepToForm(false)}
                    className="text-sm bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 border border-blue-500/30"
                  >
                    + Add Step
                  </button>
                </div>

                {newSection.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="bg-slate-900/50 border border-slate-600 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-400">Step {stepIdx + 1}</span>
                      {newSection.steps.length > 1 && (
                        <button
                          onClick={() => removeStepFromForm(stepIdx, false)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => {
                        const updatedSteps = [...newSection.steps]
                        updatedSteps[stepIdx].title = e.target.value
                        setNewSection({ ...newSection, steps: updatedSteps })
                      }}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-500"
                      placeholder="Step title *"
                    />

                    <textarea
                      value={step.content}
                      onChange={(e) => {
                        const updatedSteps = [...newSection.steps]
                        updatedSteps[stepIdx].content = e.target.value
                        setNewSection({ ...newSection, steps: updatedSteps })
                      }}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-slate-300 placeholder-slate-500"
                      placeholder="Step content *"
                    />

                    {step.imageUrl ? (
                      <div className="relative">
                        <img src={step.imageUrl} alt="Step" className="w-full h-48 object-cover rounded-lg border border-slate-700" />
                        <button
                          onClick={() => {
                            const updatedSteps = [...newSection.steps]
                            updatedSteps[stepIdx].imageUrl = ''
                            setNewSection({ ...newSection, steps: updatedSteps })
                          }}
                          className="absolute top-3 right-3 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center h-32 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800/50 hover:border-blue-500/50 transition-all">
                        <div className="text-center">
                          <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                          <span className="text-sm text-slate-400">Click to upload image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, stepIdx, false)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4 sticky bottom-0 bg-slate-800">
                <button
                  onClick={handleAddSection}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 font-medium transition-all shadow-lg"
                >
                  Add Section
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setNewSection({
                      title: '',
                      description: '',
                      steps: [{ title: '', content: '', imageUrl: '', order: 0 }]
                    })
                  }}
                  className="flex-1 bg-slate-700 text-slate-300 py-3 rounded-xl hover:bg-slate-600 font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 10px;
        }
           .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
     </AppLayout>
  )
}