'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  X,
} from 'lucide-react'
import axios from 'axios'

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  teacherId: string
  onAssessmentAdded: () => void
}

interface AssessmentData {
  name: string
  description: string
  classId: string
  teacherId?: string
}

export default function StudentDialog({
  open,
  onOpenChange,
  classId,
  teacherId,
  onAssessmentAdded,
}: StudentDialogProps) {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    name: '',
    description: '',
    classId,
    teacherId,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const baseurl = process.env.BASE_URL;

  useEffect(() => {
    setAssessmentData((prev) => ({
      ...prev,
      classId,
    }))
  }, [classId])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAssessmentData({
      ...assessmentData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async () => {
    if (!assessmentData.name.trim()) {
      setError('Assessment name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)

      await axios.post(
        `${baseurl}/create_assesment`,
        assessmentData
      )

      onAssessmentAdded()
      onOpenChange(false)

      setAssessmentData({
        name: '',
        description: '',
        classId,
      })
    } catch (error) {
      console.error(error)
      setError('Failed to create assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onOpenChange(false)
      setError(null)
      setAssessmentData({
        name: '',
        description: '',
        classId,
        teacherId,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
          w-[95vw]
          max-w-6xl
          h-[90vh]
          p-0
          gap-0
          overflow-y-auto
          border-0
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

          <DialogHeader className="relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold mb-1">
                      Create New Assessment
                    </DialogTitle>
                    <DialogDescription className="text-blue-100">
                      Design an assessment for your students
                    </DialogDescription>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-0 backdrop-blur-sm"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  New Assignment
                </Badge>
              </div>

              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                disabled={loading}
                className="hover:bg-white/20 text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>
        </div>

        {/* Form Content */}
        <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50 px-8 py-6">
          <div className="mx-auto w-full max-w-4xl space-y-6">
            {error && (
              <Card className="bg-red-50 border-red-200 border-2">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700 font-medium">
                      {error}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <Label className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 font-semibold">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    Assessment Name
                  </span>
                  <Badge variant="outline">Required</Badge>
                </Label>
                <Input
                  name="name"
                  value={assessmentData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-md">
              <CardContent className="pt-6">
                <Label className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4 text-purple-600" />
                    Description
                  </span>
                  <Badge variant="outline">Optional</Badge>
                </Label>
                <Textarea
                  name="description"
                  value={assessmentData.description}
                  onChange={handleChange}
                  disabled={loading}
                  rows={5}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-8 py-5 bg-white border-t">
          <div className="flex justify-between w-full">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                hover:from-blue-700
                hover:to-indigo-700
                text-white
                shadow-md
                hover:shadow-lg
                transition-all
              "
            >
              {loading ? 'Creating...' : 'Create Assessment'}
            </Button>

          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
