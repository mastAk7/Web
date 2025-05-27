abstract class User{
    constructor(public name : string) {}

    abstract getRole() : string;

    greet() {
        console.log(`Welcome, ${this.name}`)
    }
}

class Admin extends User {
    getRole() : string {
        return "Admin";
    }
}

const admin = new Admin("Kartik");
admin.greet();