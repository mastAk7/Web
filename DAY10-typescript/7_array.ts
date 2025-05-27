let arr: number[] = [1,2,3,4,5]

console.log(arr);

let names : Array<string> = ["Kartik", "Aryan", "Hrishi"]

console.log(names);

let arr1: (number | string)[] = [1,"aryan"];

console.log(arr1);

interface Person {
    name : string;
    age : number;
}

let personArray : Person[] = [
    {name: "Aryan", age : 18},
    {name: 'Hrishi', age : 19}
]

console.log(personArray);


