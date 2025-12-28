export interface Subject {
  _id: string;
  subject_name?: string;
  name: string;
}

export interface Teacher {
  _id: string;
  name: string;
}

export interface Course {
  _id?: string;
  course_name: string;
  course_code: string;
  description: string;
  subject: Subject | null;
  teacher: Teacher | null;
  subjectId?: string;  
  teacherId?: string;   
}

export interface GetCourse {
  _id?: string;
  name: string;
  course_code: string;
  description: string;
  subject: Subject | null;
  teacher: Teacher | null;
  subjectId?: string;  
  teacherId?: string;   
}

