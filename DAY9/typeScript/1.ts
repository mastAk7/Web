function greet(name: string): string {
    return `Hello, ${name}!`;
}

const userName: string = "World";
const message: string = greet(userName);

console.log(message);