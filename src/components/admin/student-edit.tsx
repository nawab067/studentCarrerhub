// File: src/components/admin/student-edit.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { student } from "@/app/admin/students/addStudent/page";

interface StudentEditPageProps {
  studentData: student | null;
  editStudent: (student: student) => Promise<void>;
  loading: boolean;
}

export default function StudentEditPage({ studentData, editStudent, loading }: StudentEditPageProps) {
  if (!studentData) {
    return <p className="text-center p-6">Loading student data...</p>;
  }

  const [name, setName] = useState(studentData.name);
  const [email, setEmail] = useState(studentData.email);
  const [state, setState] = useState(studentData.state);
  const [city, setCity] = useState(studentData.city);
  const [address, setAddress] = useState(studentData.address);
  const [DOB, setDOB] = useState(studentData.date_of_birth);
  const [phone, setPhone] = useState(studentData.phone_number);
  const [Roll, setRollnumber] = useState(studentData.Roll_Number);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const updatedStudent: student = {
      ...studentData,
      name,
      email,
      state,
      city,
      address, 
      date_of_birth: DOB,
      phone_number: phone,
      Roll_Number: Roll,
      image_url: image ?? studentData.image_url,
    };

    await editStudent(updatedStudent);
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xl">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Edit Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">

              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
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
                  placeholder="Enter student email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="Enter state"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
               <div>
                <Label htmlFor="Roll">Roll Number</Label>
                <Input
                  id="Roll_number"
                  name="Roll_number"
                  placeholder="Enter Roll number"
                  required
                  value={Roll}
                  onChange={(e) => setRollnumber(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  required
                  value={DOB}
                  onChange={(e) => setDOB(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="image_url">Upload New Image (optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImage(e.target.files && e.target.files[0] ? e.target.files[0] : null)
                  }
                />
              </div>

              <Button type="submit" className="w-full mt-4" disabled={loading}>
                {loading ? "Updating..." : "Update Student"}
              </Button>

            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
