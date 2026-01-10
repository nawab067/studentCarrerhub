import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Student } from "@/app/admin/students/addStudent/page";

interface AddstudentPageProps {
  onSubmit: (student: Student) => Promise<void>;
  loading: boolean;
}

export default function AddstudentPage({ onSubmit, loading }: AddstudentPageProps) {

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const student: Student = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      state: formData.get("state") as string,
      city: formData.get("city") as string,
      Roll_Number: formData.get("Roll_Number") as string,
      address: formData.get("address") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      phone_number: formData.get("phone_number") as string,
      image_url: formData.get("image_url") as File
    };

    await onSubmit(student);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Add Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">

              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" placeholder="Enter student name" required />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="Enter student email" required />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input id="state" name="state" placeholder="Enter state" required />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="Enter city" required />
              </div>

              <div>
                <Label htmlFor="Roll">Roll number</Label>
                <Input id="Roll_Number" name="Roll_Number" placeholder="Enter Roll number" required />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" placeholder="Enter address" required />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" required />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input id="phone_number" name="phone_number" type="tel" placeholder="Enter phone number" required />
              </div>

              <div>
                <Label htmlFor="image_url">Image</Label>
                <Input id="image_url" name="image_url" type="file" accept="image/*" required />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Adding..." : "Add Student"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
