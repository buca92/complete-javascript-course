// ES5
var name5 = 'Adam Bucek';
var age5 = 23;
name5 = 'Adamek Bucek';

// ES6
let name6 = 'Adam Bucek';
const age6 = 23;
name6 = 'Adamek Bucek';

let i = 23;

for (let i = 0; i < 5; i++) {
    console.log(i);
}

console.log(i);

for (i = 0; i < 5; i++) {
    console.log(i);
}

console.log(i);

// Blocks and IIFEs

// ES6
{ // Block start
    const a = 1;
    let b = 2;
} // Block end

// console.log(a + b);

// ES5
(function () {
    var c = 3;
})();

// console.log(c);

// Arrow functions
const years = [1990, 1965, 1982, 1937];

// ES5
var ages5 = years.map(function (year) {
    return 2020 - year;
});

console.log(ages5);

let ages6 = years.map(year => 2019 - year)
console.log(ages6);

ages6 = years.map((year, index) => `Age element ${index + 1}: ${2018 - year}`);
console.log(ages6);

ages6 = years.map((year, index) => {
    const now = new Date();

    return `Age element ${index + 1}: ${now.getFullYear() - year}`
});
console.log(ages6);

// Arrow functions - this

// ES5
var box5 = {
    color: 'green',
    position: 1,
    clickMe: function () {
        document.querySelector('.' + this.color).addEventListener('click', function () {
            var str = 'This is box number ' + this.position + ' and it is ' + this.color;
            console.log(str);
        }.bind(this))
    }
};
// box5.clickMe();

// ES6
const box6 = {
    color: 'green',
    position: 1,
    clickMe: function () { // classical function has to be called in object to preserve the this pointer to object where it is placed
        document.querySelector('.' + this.color).addEventListener('click', () => {
            var str = 'This is box number ' + this.position + ' and it is ' + this.color;
            console.log(str);
        })
    }
};
box6.clickMe();

// const box66 = {
//     color: 'green',
//     position: 1,
//     clickMe: () => {
//         document.querySelector('.green').addEventListener('click', () => {
//             var str = 'This is box number ' + this.position + ' and it is ' + this.color;
//             console.log(str);
//         })
//     }
// };
// box66.clickMe();

function Person(name) {
    this.name = name;
}

// ES5
Person.prototype.myFriends5 = function (friends) {
    var array = friends.map(function (item) {
        return this.name + ' is friends with ' + item;
    }.bind(this));

    console.log(array);
}

var friends = ['Adamek', 'Sabina', 'Jakub'];
new Person('Libor').myFriends5(friends);

// ES6
Person.prototype.myFriends6 = function (friends) {
    var array = friends.map(item => `${this.name} is friends with ${item}`);

    console.log(array);
}
new Person('Adulka').myFriends6(friends);

// Destructuring

// ES5
var john = ['John', 26];
// var name = john[0];
// var age = john[1];

// ES6
const [name, year] = ['John', 26];
console.log(name, year);


const obj = { firstName: 'John', lastName: 'Smith' };
const nonsense = null;
const { firstName: name1, lastName: name2, age = 20 } = obj || {};
console.log(name1, name2, age);

// Arrays

const boxes = document.querySelectorAll('.box');

// ES5
// var boxesArr5 = Array.prototype.slice.call(boxes);
// boxesArr5.forEach(element => element.style.backgroundColor = 'dodgerblue');

// ES6
// const boxesArr6 = Array.from(boxes);
// boxesArr6.forEach(element => element.style.backgroundColor = 'dodgerblue');

// ES5
// for (var j = 0; j < boxesArr5.length; j++) {
//     if (boxesArr5[j].className === 'box blue') {
//         continue;
//     }

//     boxesArr5[j].textContent = 'I changed to blue'
// }

// ES6
// for (const element of boxesArr6) {
//     if (element.className.includes('blue')) {
//         continue;
//     }

//     element.textContent = 'I changed to blue'
// }

// const elementIndex = boxesArr6.findIndex(element => element.className.includes('blue'))
// const element = boxesArr6.find(element => element.className.includes('blue'))
// element.textContent = 'Bla';

// const elements = boxesArr6.filter(element => element.className.includes('blue'));

// console.log(elementIndex, element, elements);

// Spread Operator
function addFourAges(a, b, c, d) {
    return a + b + c + d;
}

var sum1 = addFourAges(1, 2, 3, 4);
console.log(sum1);

// ES5
var ages = [1, 2, 3, 4];
var sum2 = addFourAges.apply(null, ages);
console.log(sum2);

// ES6
const sum3 = addFourAges(...ages);
console.log(sum3);

const familySmith = ['John', 'Jane', 'Mark'];
const familyMiller = ['Mary', 'Bob', 'Ann'];

const bigFamily = [...familySmith, 'Lily', ...familyMiller];
console.log(bigFamily)

const h = document.querySelector('h1');
const boxes1 = document.querySelectorAll('.box');
const htmlElements = [h, ...boxes1];

htmlElements.forEach(element => console.log(element))

// Rest paramaters

// ES5
// function isFullAge5() {
//     console.log(Array.prototype.slice.call(arguments));
// }
// isFullAge5(1990, 1956, 2013);

// ES6
// function isFullAge6(...years) {
//     console.log(years);
// }
// isFullAge6(1999, 2013, 1992, 2015);

// ES5
function isFullAge5(limit) {
    console.log(Array.prototype.slice.call(arguments, 1)); // the limit value is excluded
}
isFullAge5(15, 1990, 1956, 2013);

// ES6
function isFullAge6(limit, ...years) {
    console.log(limit, years);
}
isFullAge6(16, 1999, 2013, 1992, 2015);

// Maps
const question = new Map();
question.set('question', 'What is the official name of the latest major JavaScript version?');
question.set(1, 'ES5');
question.set(2, 'ES6');
question.set(3, 'ES2015');
question.set(4, 'ES7');
question.set('correct', 3);
question.set(true, 'Correct answer');
question.set(false, 'Wrong, please try again!');

console.log(question.size)
console.log(question.get('question'));

if (question.has(4)) {
    // question.delete(4);
    console.log(question.get(4));
}

// question.clear();

question.forEach((value, key) => console.log(`${key} => ${value}`));

for (let [key, value] of question.entries()) {
    if (typeof(key) === 'number') {
        console.log(`Answer ${key} => ${value}`)
    }
}

// const ans = parseInt(prompt('Write the correct answer'));
// console.log(question.get(ans === question.get('correct')));

// Classes

// ES5
var Person5 = function (name, yearOfBirth, job) {
    this.name = name;
    this.yearOfBirth = yearOfBirth;
    this.job = job;
}

Person5.prototype.calculateAge = function (year) {
    return year - this.yearOfBirth;
}

var adam5 = new Person5('Adam', 2013, 'student');
console.log(adam5.calculateAge(2020));

// ES6
class Person6 {
    constructor(name, yearOfBirth, job) {
        this.name = name;
        this.yearOfBirth = yearOfBirth,
        this.job = job;
    }

    calculateAge(year) {
        return year - this.yearOfBirth;
    }

    static greeting() {
        console.log('Hey there!');
    }
}

const adam6 = new Person6('Adam', 2013, 'student');
console.log(adam6.calculateAge(2020));
Person6.greeting();

// Classes and subclasses (inheritance)

// ES5
var Athlete5 = function (name, yearOfBirth, job, olympicGames, medals) {
    Person5.call(this, name, yearOfBirth, job);
    
    this.olympicGames = olympicGames;
    this.medals = medals;
}

Athlete5.prototype = Object.create(Person5.prototype);

Athlete5.prototype.wonMedal = function () {
    this.medals++;
};

var athlete5 = new Athlete5('Adam', 2013, 'student', 'runner', 5);

// ES6
class Athlete6 extends Person6 {
    constructor(name, yearOfBirth, job, olympicGames, medals) {
        super(name, yearOfBirth, job);

        this.olympicGames = olympicGames;
        this.medals = medals;
    }

    wonMedal() {
        this.medals++;
    }
}

const athlete6 = new Athlete6('Adam', 2013, 'student', 'runner', 5);