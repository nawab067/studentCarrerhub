import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { subject } from "@/app/admin/subjects/add-subject/page";

export interface subjectAddPageProps {
  onSubmit: (subject: subject) => Promise<void>;
  loading: boolean;
}

export default function subjectAddPage({ onSubmit, loading }: subjectAddPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const subject: subject = {
      subject_name: formData.get("subject_name") as string,
      subjectId: formData.get("subjectId") as string,
      description: formData.get("description") as string,     
    };
    await onSubmit(subject);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              
              <div>
                <Label htmlFor="subject_name">Subject Name</Label>
                <Input id="subject_name" name="subject_name" placeholder="Enter subject name" required />
              </div>

              <div>
                <Label htmlFor="subjectId">Subject ID</Label>
                <Input id="subjectId" name="subjectId" type="number" placeholder="Enter Subject ID" required />
              </div>

              <div>
                <Label htmlFor="description">Subject Description</Label>
                <Input id="designation" name="description" placeholder="Enter description here" required />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Adding..." : "Add Subject"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
