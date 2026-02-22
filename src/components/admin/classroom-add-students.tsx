"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Student {
  _id: string;
  name: string;
}

interface ClassroomDialogProps {
  open: boolean;
  onClose: () => void;
  classroomId: string | null;
  onStudentAdded: () => void;
}

export default function ClassroomDialog({
  open,
  onClose,
  classroomId,
  onStudentAdded,
}: ClassroomDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classroomStudents, setClassroomStudents] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  /* ========================
     Load BOTH APIs together
  ======================== */
  useEffect(() => {
    const loadData = async () => {
      if (!open || !classroomId) return;

      try {
        setLoading(true);

        const [studentsRes, classroomRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/Student"),
          axios.get(`http://127.0.0.1:8000/classroom/${classroomId}`),
        ]);

        setStudents(studentsRes.data);

        setClassroomStudents(
          classroomRes.data.students.map((s: Student) => s._id)
        );

        setSelectedStudents([]);
        setSearch("");
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [open, classroomId]);

  /* ========================
     Filter students (FIXED)
  ======================== */
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const isAdded = classroomStudents.includes(s._id);

      return (
        !isAdded &&
        s.name.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [students, classroomStudents, search]);

  /* ========================
     Selection helpers
  ======================== */
  const isAllSelected =
    filteredStudents.length > 0 &&
    selectedStudents.length === filteredStudents.length;

  const toggleSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedStudents(
      isAllSelected ? [] : filteredStudents.map((s) => s._id)
    );
  };

  const handleClearAll = () => setSelectedStudents([]);

  /* ========================
     Add students
  ======================== */
  const handleAdd = async () => {
    if (!classroomId || selectedStudents.length === 0) return;

    try {
      setAdding(true);

      await axios.post(
        `http://127.0.0.1:8000/classroom/${classroomId}`,
        { student_ids: selectedStudents }
      );

      onStudentAdded();
      onClose();
    } catch (error) {
      console.error("Error adding students:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full h-[550px] flex flex-col p-0 rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="px-5 py-4 border-b flex justify-between items-center">
  <DialogTitle className="text-lg font-semibold">
    Add Students
  </DialogTitle>

  <span className="text-sm text-muted-foreground">
    {selectedStudents.length} selected
  </span>
</div>
        <div className="px-5 py-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Students</h2>
          <span className="text-sm text-muted-foreground">
            {selectedStudents.length} selected
          </span>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between px-5 py-2 border-b">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSelectAll}
            disabled={filteredStudents.length === 0}
          >
            {isAllSelected ? "Unselect All" : "Select All"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearAll}
            disabled={selectedStudents.length === 0}
          >
            Clear
          </Button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground mt-10">
              Loading students...
            </p>
          ) : filteredStudents.length === 0 ? (
            <p className="text-center text-muted-foreground mt-10">
              No available students
            </p>
          ) : (
            filteredStudents.map((student) => {
              const isSelected = selectedStudents.includes(student._id);

              return (
                <div
                  key={student._id}
                  onClick={() => toggleSelect(student._id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition
                    ${
                      isSelected
                        ? "bg-blue-50 border-blue-400"
                        : "hover:bg-muted"
                    }
                  `}
                >
                  <Checkbox checked={isSelected} />
                  <span className="font-medium">{student.name}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 border-t flex gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={adding}
          >
            Cancel
          </Button>

          <Button
            className="w-full"
            disabled={selectedStudents.length === 0 || adding}
            onClick={handleAdd}
          >
            {adding ? "Adding..." : `Add (${selectedStudents.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}