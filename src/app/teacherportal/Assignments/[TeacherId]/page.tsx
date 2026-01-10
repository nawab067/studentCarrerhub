'use client'

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
  DialogClose,
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
  teacherId: string
  classId: string
}

export default function TeacherClassesPage() {
  const [teacherId, setTeacherId] = useState<string | null>(null)
  const [assignedClasses, setAssignedClasses] = useState<AssignedClass[]>([])
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [activeClassName, setActiveClassName] = useState('')

  // Get teacher ID
  useEffect(() => {
    const id = localStorage.getItem('teacherId')
    if (!id) {
      setError('Teacher ID not found. Please login again.')
      return
    }
    setTeacherId(id)
  }, [])

  // Fetch assigned classes
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

  // Fetch assessments
  const handleManageAssessments = async (cls: AssignedClass) => {
    try {
      setLoading(true)
      setActiveClassName(cls.classroom_name)

      const res = await axios.get(
        `http://127.0.0.1:8000/get_assesments/${cls._id}`
      )

      setAssessments(res.data?.data || [])
      setOpenDialog(true)
    } catch {
      setError('Failed to load assessments.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      <TeacherPortalSidebar />

      <main className="flex-1 p-6 ml-0 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Assessments</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Classes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedClasses.map((cls) => (
            <Card
              key={cls._id}
              className="bg-sky-100 border-sky-300 shadow-md hover:shadow-lg transition"
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

        {/* CENTERED DIALOG */}
       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
  <DialogContent className="max-w-xl p-0">
    <DialogHeader className="p-6 border-b relative space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <DialogTitle className="text-xl font-bold text-sky-700">
            {activeClassName} Assessments
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Manage assessments for this class
          </DialogDescription>
        </div>

        <DialogClose className="rounded-full p-1 hover:bg-gray-100">
          <X className="h-5 w-5" />
        </DialogClose>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3">
        <Button
          size="sm"
          className="bg-sky-600 hover:bg-sky-700 text-white"

        >
          Add Assessment
        </Button>

        <Button
          size="sm"
          variant="destructive"
          disabled={assessments.length === 0}
        >
          Delete Assessment
        </Button>
      </div>
    </DialogHeader>

    {/* BODY */}
    <div className="p-6 max-h-[60vh] overflow-y-auto space-y-3 bg-sky-50">
      {loading && <p>Loading assessments...</p>}

      {!loading && assessments.length === 0 && (
        <p className="text-gray-500">
          No assessments found for this class.
        </p>
      )}

      {assessments.map((assessment) => (
        <Card
          key={assessment._id}
          className="border border-sky-200 shadow-sm"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base text-sky-800">
              {assessment.name}
            </CardTitle>

            <Button
              size="icon"
              variant="destructive"
            >
              🗑
            </Button>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-gray-600">
              {assessment.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </DialogContent>
</Dialog>

      </main>
    </div>
  )
}
