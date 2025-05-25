"use strict";
function createStudent(name, age) {
    return {
        name,
        age,
        greet: () => {
            return `Hello, ${name}! You are ${age} years old.`;
        }
    };
}
const student1 = Student("aryan", 18);
console.log(student1.age);
console.log(student1.name);
console.log(student1.greet());
