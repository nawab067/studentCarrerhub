'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'

interface StudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classId: string
  teacherId: string
}

interface AssessmentData {
  name: string
  description: string
  classId: string
  teacherId: string
}

export default function StudentDialog({
  open,
  onOpenChange,
  classId,
  teacherId,
}: StudentDialogProps) {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    name: '',
    description: '',
    classId,
    teacherId,
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAssessmentData({
      ...assessmentData,
      [e.target.name]: e.target.value,
    })
  }
  async function handleSubmit() {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/create_assesment',
      assessmentData
    )

    console.log(response.data)
    alert('Assessment created successfully!')
    onOpenChange(false)
  } catch (error) {
    console.error(error)
    alert('Backend not reachable')
  }
}

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Add New Assessment
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Assessment Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Mid Term Exam"
              value={assessmentData.name}
              onChange={handleChange}
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
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button onClick={handleSubmit}>
            Save Assessment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
