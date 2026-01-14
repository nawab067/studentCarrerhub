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
import { FileText, Loader2 } from 'lucide-react'
import axios from 'axios'



interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  onAssessmentAdded: () => void 
}

interface AssessmentData {
  name: string
  description: string
  classId: string
}


export default function StudentDialog({
  open,
  onOpenChange,
  classId,
  onAssessmentAdded,
}: StudentDialogProps) {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    name: '',
    description: '',
    classId,
  })

  const [loading, setLoading] = useState(false)

 
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
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)

      await axios.post(
        'http://127.0.0.1:8000/create_assesment',
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
      alert('Failed to create assessment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden">
   
        <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-5 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-5 w-5" />
              New Assessment
            </DialogTitle>
            <DialogDescription className="text-sky-100">
              Create and assign an assessment to this class
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 px-6 py-6 bg-sky-50">
          <div className="space-y-2">
            <Label htmlFor="name">Assessment Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Mid Term Exam"
              value={assessmentData.name}
              onChange={handleChange}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Assessment details"
              value={assessmentData.description}
              onChange={handleChange}
              className="bg-white resize-none"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 bg-white border-t">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || !assessmentData.name}
            className="bg-sky-600 hover:bg-sky-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Assessment'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
