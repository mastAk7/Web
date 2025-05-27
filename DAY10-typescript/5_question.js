// create interface -> instructor
// class CBInstructor implementing Instructor
var CBInstructor = /** @class */ (function () {
    function CBInstructor(name, experience) {
        this.name = name;
        this.experience = experience;
    }
    CBInstructor.prototype.introduce = function () {
        if (this.experience === 1) {
            console.log("Hi, I am ".concat(this.name, ", with ").concat(this.experience, " year of experience at Coding Blocks"));
        }
        else {
            console.log("Hi, I am ".concat(this.name, ", with ").concat(this.experience, " years of experience at Coding Blocks"));
        }
    };
    return CBInstructor;
}());
var instructor1 = new CBInstructor("Aryan", 2);
var instructor2 = new CBInstructor("Hrishi", 1);
instructor1.introduce();
instructor2.introduce();
