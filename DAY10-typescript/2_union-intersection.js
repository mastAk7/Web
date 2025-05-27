function introduce(person) {
    console.log("Hello, my name is ".concat(person.name, "."));
}
var Member = {
    name: "aryan",
    marks: 90
};
introduce(Member);
console.log(Member);
