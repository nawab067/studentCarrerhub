export interface teacher {
    _id: string;
    name: string;
}

export interface classroom {
    _id: string;
    classroom_name: string;
    students: string[];
    teacherId: string | null; 
}
