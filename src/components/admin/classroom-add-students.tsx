import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
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

export default function ClassroomDialog({ open, onClose, classroomId, onStudentAdded }: ClassroomDialogProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // MULTI-SELECT ARRAY
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchStudents();
      setSelectedStudents([]); // reset selections when opened
    }
  }, [open]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/Student", {
        headers: { "Content-Type": "application/json" }
      });
      setStudents(res.data);
    } catch (error) {
      console.error("Student fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle multi-select
  const toggleSelect = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  // Add multiple students at once
  const handleAdd = async () => {
    if (selectedStudents.length === 0 || !classroomId) return;

    try {
      await axios.post(`http://127.0.0.1:8000/classroom/${classroomId}`, {
        student_ids: selectedStudents
      });

      onStudentAdded();
      onClose();
    } catch (error) {
      console.error("Error adding students:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-2xl font-semibold">Add Students to Classroom</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card className="shadow-none border-0">
            <CardContent className="p-0">
              <ScrollArea className="h-64 p-4">
                {loading ? (
                  <p className="text-center py-8 text-muted-foreground">Loading students...</p>
                ) : students.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No students available.</p>
                ) : (
                  <div className="space-y-2">
                    {students.map((s) => (
                      <div
                        key={s._id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          selectedStudents.includes(s._id)
                            ? "bg-primary/10 border-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => toggleSelect(s._id)}
                      >
                        <span className="font-medium">{s.name}</span>

                        {/* Selection Indicator */}
                        {selectedStudents.includes(s._id) && (
                          <span className="text-primary font-bold">✔</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <DialogFooter className="p-6 border-t flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={selectedStudents.length === 0}>
            Add {selectedStudents.length > 0 ? `(${selectedStudents.length}) Students` : "Students"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
