'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AssessmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: {
    name?: string;
    marks?: number;
    weightage?: number;
  } | null;
  loading?: boolean;
}

export default function AssessmentDialog({
  open,
  onOpenChange,
  data,
  loading,
}: AssessmentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Assessment Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-gray-500">Loading...</p>
        ) : data ? (
          <div className="space-y-4 mt-2">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Name</span>
              <span>{data.name || "-"}</span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Marks</span>
              <span>{data.marks ?? "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Weightage</span>
              <span>{data.weightage ?? "-"}%</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No data available</p>
        )}
      </DialogContent>
    </Dialog>
  );
}