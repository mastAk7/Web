interface Student {
    name: string;
    age: number;
    greet: () => string;
}

function createStudent(name: string, age: number) : {
    name : string,
    age : number, 
    greet: () => string
} {
    return {
        name,
        age,
        greet: () => {
            return `Hello, ${name}! You are ${age} years old.`;
        }
    }
}

const student1 = createStudent("aryan",18);

console.log(student1.age)
console.log(student1.name)
console.log(student1.greet())