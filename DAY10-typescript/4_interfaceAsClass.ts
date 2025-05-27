// interface Person {
//     name: string;
//     age: number;
//     print() : void;
// }

// class Student implements Person {
//     name: string;
//     age: number;
//     studentId: number;

//     constructor(name: string, age: number, studentId: number) {
//         this.name = name;
//         this.age = age;
//         this.studentId = studentId;
//     }

//     print(): void {
//         console.log(`${this.name}, Age: ${this.age}, Student ID: ${this.studentId}`);
//     }
// }

// // if implements and interface not use, there would be no constraints and the class is free to add any properties or methods

// const student = new Student("Aryan", 18, 12345);
// student.print();