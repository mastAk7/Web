var Student = /** @class */ (function () {
    function Student(name, age, studentId) {
        this.name = name;
        this.age = age;
        this.studentId = studentId;
    }
    Student.prototype.print = function () {
        console.log("".concat(this.name, ", Age: ").concat(this.age, ", Student ID: ").concat(this.studentId));
    };
    return Student;
}());
// if implements and interface not use, there would be no constraints and the class is free to add any properties or methods
var student = new Student("Aryan", 18, 12345);
student.print();
