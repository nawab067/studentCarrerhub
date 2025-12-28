import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Teacher } from "@/app/admin/teachers/addteacher/page";

interface AddTeacherPageProps {
  onSubmit: (teacher: Teacher) => Promise<void>;
  loading: boolean;
}

export default function AddTeacherPage({ onSubmit, loading }: AddTeacherPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const teacher: Teacher = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      Teacher_Designation: formData.get("designation") as string,
      Teacher_Professionality: formData.get("professionality") as string,
      Teacher_Phone_Number: formData.get("phone") as string,
      status: formData.get("status") as string,
      image: formData.get("image") as File,
    };

    await onSubmit(teacher);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add Teacher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Enter teacher name" required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter teacher email" required />
              </div>

              <div>
                <Label htmlFor="designation">Teacher Designation</Label>
                <Input id="designation" name="designation" placeholder="Enter designation" required />
              </div>

              <div>
                <Label htmlFor="professionality">Professionality</Label>
                <Input id="professionality" name="professionality" placeholder="Enter professional skills" required />
              </div>

              {/* STATUS FIELD */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <Input id="image" name="image" type="file" accept="image/*" required />
              </div>

              <div>
                <Label htmlFor="phone">Teacher Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="Enter phone number" required />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Adding..." : "Add Teacher"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
