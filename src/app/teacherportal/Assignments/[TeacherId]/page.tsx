'use client'

import StudentDialog from '@/components/teacher-portal/add-assesment'
import { useEffect, useState } from 'react'
import axios from 'axios'
import TeacherPortalSidebar from '@/components/teacher-portal/teacherportal-sidebar'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Users, 
  X, 
  Plus, 
  FileText, 
  Trash2, 
  Calendar,
  ClipboardList,
  GraduationCap,
  LayoutGrid,
  AlertCircle
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface AssignedClass {
  _id: string
  classroom_name: string
  students: string[]
  teacherId: string
}

export interface Assessment {
  _id: string
  name: string
  description: string
  classId: string
  created_at: string
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

export default function TeacherClassesPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  const [openDialog, setOpenDialog] = useState(false)
  const [openAddAssessment, setOpenAddAssessment] = useState(false)

  const [activeClassId, setActiveClassId] = useState<string | null>(null)
  const [activeClassName, setActiveClassName] = useState('')
  const baseUrl = process.env.BASE_URL

  useEffect(() => {
    const id = localStorage.getItem('teacherId')
    if (!id) {
      setError('Teacher ID not found. Please login again.')
      return
    }
    setTeacherId(id)
  }, [])

  useEffect(() => {
    if (!teacherId) return

    const fetchClasses = async () => {
      try {
        setLoading(true)
        const res = await axios.get(
          `${baseUrl}/classes/assigned/${teacherId}`
        )
        setAssignedClasses(res.data?.data || [])
      } catch {
        setError('Failed to load classes.')
      } finally {
        setLoading(false)
      }
    }

    fetchClasses()
  }, [teacherId])

  const fetchAssessments = async (classId: string) => {
    try {
      const res = await axios.get(
      `${baseUrl}/get_assesments/${classId}`
      )
      setAssessments(res.data?.data || [])
    } catch {
      setError('Failed to refresh assessments.')
    }
  }

  const handleManageAssessments = (cls: AssignedClass) => {
    setActiveClassId(cls._id)
    setActiveClassName(cls.classroom_name)
    fetchAssessments(cls._id)
    setOpenDialog(true)
  }

  const handleAssessmentAdded = () => {
    if (!activeClassId) return
    fetchAssessments(activeClassId)
    setOpenAddAssessment(false)
  }

  const handleDeleteAssessment = async (assessmentId: string) => {
    try {
      await axios.delete(
        `${baseUrl}/delete_assesment/${assessmentId}`
      )
      setAssessments((prev) =>
        prev.filter((a) => a._id !== assessmentId)
      )
    } catch {
      setError('Failed to delete assessment.')
    }
  }

  const getClassColor = (index: number) => {
    const colors = [
      { gradient: "from-blue-500 to-blue-600", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
      { gradient: "from-purple-500 to-purple-600", bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
      { gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700" },
      { gradient: "from-orange-500 to-orange-600", bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" },
      { gradient: "from-pink-500 to-pink-600", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700" },
      { gradient: "from-cyan-500 to-cyan-600", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700" },
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
     <TeacherPortalSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
     
              <main
       className={`transition-all duration-300 min-h-screen ${
         collapsed ? "ml-16" : "ml-64"
       }`}
     >
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <ClipboardList className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Assessments
              </h1>
              <p className="text-slate-600">Create and manage assessments for your classes</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {!loading && assignedClasses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Classes</p>
                    <p className="text-3xl font-bold text-slate-800">{assignedClasses.length}</p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <LayoutGrid className="h-7 w-7 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {assignedClasses.reduce((sum, cls) => sum + cls.students.length, 0)}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Users className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Active Assessments</p>
                    <p className="text-3xl font-bold text-slate-800">
                      {assignedClasses.length * 2}
                    </p>
                  </div>
                  <div className="h-14 w-14 rounded-full bg-violet-100 flex items-center justify-center">
                    <FileText className="h-7 w-7 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-blue-200 rounded-full"></div>
              <div className="h-16 w-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading classes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-red-50 border-red-200 border-2 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {assignedClasses.map((cls, index) => {
            const colors = getClassColor(index)
            return (
              <Card
                key={cls._id}
                className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-1"
              >
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {cls.classroom_name}
                      </CardTitle>
                      <Badge variant="secondary" className={`${colors.bg} ${colors.text} border ${colors.border}`}>
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Active Class
                      </Badge>
                    </div>
                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-md`}>
                      <BookOpen className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Student Count Box */}
                  <div className={`flex items-center justify-between p-4 ${colors.bg} rounded-xl border ${colors.border}`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-sm`}>
                        <Users className={`h-5 w-5 ${colors.text}`} />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Students</p>
                        <p className={`text-xl font-bold ${colors.text}`}>
                          {cls.students.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleManageAssessments(cls)}
                    className={`w-full bg-gradient-to-r ${colors.gradient} hover:opacity-90 text-white font-medium py-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Manage Assessments
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Assessment Management Dialog */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-hidden p-0 gap-0">
            {/* HEADER */}
            <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl font-bold text-slate-800 mb-1">
                      {activeClassName}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600">
                      Manage and organize assessments for this class
                    </DialogDescription>
                  </div>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                  className="hover:bg-white/80"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-blue-100">
                <Badge variant="outline" className="text-base px-4 py-2">
                  <FileText className="h-4 w-4 mr-2" />
                  {assessments.length} Assessment{assessments.length !== 1 ? 's' : ''}
                </Badge>
                <Button
                  onClick={() => setOpenAddAssessment(true)}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-md"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Assessment
                </Button>
              </div>
            </DialogHeader>

            {/* CONTENT */}
            <ScrollArea className="max-h-[calc(90vh-200px)]">
              <div className="p-6 space-y-4">
                {assessments.length === 0 && (
                  <Card className="bg-slate-50 border-dashed border-2 border-slate-200">
                    <CardContent className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                          <FileText className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                          No Assessments Yet
                        </h3>
                        <p className="text-slate-500 max-w-sm mb-4">
                          Start by creating your first assessment for this class
                        </p>
                        <Button
                          onClick={() => setOpenAddAssessment(true)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create Assessment
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {assessments.map((assessment, idx) => (
                  <Card
                    key={assessment._id}
                    className="group bg-white border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
                  >
                    <div className={`h-1 bg-gradient-to-r ${getClassColor(idx).gradient}`}></div>
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getClassColor(idx).gradient} flex items-center justify-center shadow-sm flex-shrink-0`}>
                            <FileText className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                              {assessment.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <Calendar className="h-3 w-3" />
                              <span>Created on {formatDate(assessment.created_at)}</span>
                            </div>
                          </div>
                        </div>

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteAssessment(assessment._id)}
                          className="hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="pt-4">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {assessment.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Add Assessment Dialog */}
        {activeClassId && teacherId && (
          <StudentDialog
            open={openAddAssessment}
            onOpenChange={setOpenAddAssessment}
            classId={activeClassId}
            teacherId={teacherId}
            onAssessmentAdded={handleAssessmentAdded}
          />
        )}
      </main>
    </div>
  )
}