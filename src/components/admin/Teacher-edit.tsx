import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Teacher } from "@/app/admin/teachers/addteacher/page";

interface TeacherEditPageProps {
  teacherData: Teacher | null; 
  editTeacher: (teacher: Teacher) => Promise<void>;
  loading: boolean;
}

export default function TeacherEditPage({ teacherData, editTeacher, loading }: TeacherEditPageProps) {
  if (!teacherData) {
    return <p className="text-center p-6">Loading teacher data...</p>;
  }

  
    const [name, setName] = useState(teacherData?.name || "");
    const [email, setEmail] = useState(teacherData?.email || "");
    const [designation, setDesignation] = useState(teacherData?.Teacher_Designation || "");
    const [professionality, setProfessionality] = useState(teacherData?.Teacher_Professionality || "");
    const [phone, setPhone] = useState(teacherData?.Teacher_Phone_Number || "");
    const [status, setStatus] = useState(teacherData?.status || "active");
    const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedTeacher: Teacher = {
      ...teacherData,
      name,
      email,
      Teacher_Designation: designation,
      Teacher_Professionality: professionality,
      Teacher_Phone_Number: phone,
      status,
      image, 
    };

    await editTeacher(updatedTeacher);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Edit Teacher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter teacher name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter teacher email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="designation">Teacher Designation</Label>
                <Input
                  id="designation"
                  name="designation"
                  placeholder="Enter designation"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="professionality">Professionality</Label>
                <Input
                  id="professionality"
                  name="professionality"
                  placeholder="Enter professional skills"
                  required
                  value={professionality}
                  onChange={(e) => setProfessionality(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={status}
                  onValueChange={(val) => setStatus(val)}
                >
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
                <Label htmlFor="image">Image (Upload new to change)</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                  }
                />
              </div>

              <div>
                <Label htmlFor="phone">Teacher Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Updating..." : "Update Teacher"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
