export interface student {
  _id?: number;
  name: string;
  email: string;
  state: string;
  city: string;
  address: string;
  date_of_birth: string;
  phone_number: string;
  image_url: File | null;
}
export interface studentList{
  student_ids : number[]
}