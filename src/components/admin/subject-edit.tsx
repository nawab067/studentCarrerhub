import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { subject } from "@/app/admin/subjects/add-subject/page";

export interface subjectEditPageProps {
  subject?: subject | null; 
  onSubmit: (subject: subject) => Promise<void>;
  loading: boolean;
}

export default function SubjectEditPage({ subject, onSubmit, loading }: subjectEditPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updatedSubject: subject = {
      subject_name: formData.get("subject_name") as string,
      subjectId: formData.get("subjectId") as string,
      description: formData.get("description") as string,     
    };
    await onSubmit(updatedSubject);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Edit Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              
              <div>
                <Label htmlFor="subject_name">Subject Name</Label>
                <Input 
                  id="subject_name"
                  name="subject_name"
                  placeholder="Enter subject name"
                  required
                  defaultValue={subject?.subject_name}
                />
              </div>

              <div>
                <Label htmlFor="subjectId">Subject ID</Label>
                <Input
                  id="subjectId"
                  name="subjectId"
                  type="number"
                  placeholder="Enter Subject ID"
                  required
                  defaultValue={subject?.subjectId}
                />
              </div>

              <div>
                <Label htmlFor="description">Subject Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Enter description here"
                  required
                  defaultValue={subject?.description}
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Updating..." : "Update Subject"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
