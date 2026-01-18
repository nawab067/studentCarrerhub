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
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'


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

  const [openDialog, setOpenDialog] = useState(false)
  const [openAddAssessment, setOpenAddAssessment] = useState(false)

  const [activeClassId, setActiveClassId] = useState<string | null>(null)
  const [activeClassName, setActiveClassName] = useState('')


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
          `http://127.0.0.1:8000/classes/assigned/${teacherId}`
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
        `http://127.0.0.1:8000/get_assesments/${classId}`
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
        `http://127.0.0.1:8000/delete_assesment/${assessmentId}`
      )
      setAssessments((prev) =>
        prev.filter((a) => a._id !== assessmentId)
      )
    } catch {
      setError('Failed to delete assessment.')
    }
  }

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Assessments</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card
              key={cls._id}
              className="bg-sky-100 border-sky-300 shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {cls.classroom_name}
                </CardTitle>
                <BookOpen className="h-5 w-5 text-sky-600" />
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-sky-600" />
                  <p className="text-sky-700">
                    {cls.students.length} Students
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-sky-400 text-sky-700 hover:bg-sky-200"
                  onClick={() => handleManageAssessments(cls)}
                >
                  Manage Assessments
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

     
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent
            className="
              max-w-2xl 
              w-full 
              max-h-[90vh] 
              overflow-hidden 
              p-0
            "
          >
            {/* HEADER */}
            <DialogHeader className="p-6 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-xl font-bold text-sky-700">
                    {activeClassName} Assessments
                  </DialogTitle>
                  <DialogDescription>
                    Manage assessments for this class
                  </DialogDescription>
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setOpenDialog(false)}
                >
                  <X />
                </Button>
              </div>

              <Button
                size="sm"
                onClick={() => setOpenAddAssessment(true)}
                className="
                  mt-4 
                  bg-sky-600 
                  text-white 
                  w-fit
                  transition-colors
                  hover:bg-emerald-600
                  active:bg-emerald-700
                "
              >
                Add Assessment
              </Button>
            </DialogHeader>

         
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              {assessments.length === 0 && (
                <p className="text-center text-gray-500">
                  No assessments added yet
                </p>
              )}

              {assessments.map((assessment) => (
                <Card key={assessment._id}>
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle>{assessment.name}</CardTitle>
                      <p className="text-xs text-gray-500">
                        Created on {formatDate(assessment.created_at)}
                      </p>
                    </div>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDeleteAssessment(assessment._id)}
                    >
                      🗑
                    </Button>
                  </CardHeader>

                  <CardContent>
                    {assessment.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

      
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
