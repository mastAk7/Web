// create interface -> instructor

interface Instructor {
    name : string;
    experience : number;
    introduce() : void;
}

// class CBInstructor implementing Instructor

class CBInstructor implements Instructor {
    name : string;
    experience: number;
    constructor(name:string,experience:number){
        this.name=name;
        this.experience=experience;
    }
    introduce(): void {
        if(this.experience===1){
            console.log(`Hi, I am ${this.name}, with ${this.experience} year of experience at Coding Blocks`);
        } else{
            console.log(`Hi, I am ${this.name}, with ${this.experience} years of experience at Coding Blocks`);
        }
    }
}

let instructor1 = new CBInstructor("Aryan", 2);
let instructor2 = new CBInstructor("Hrishi", 1);

instructor1.introduce();
instructor2.introduce();