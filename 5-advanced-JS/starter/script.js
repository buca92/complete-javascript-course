var Person = function (name, yearOfBirth, job) {
    this.name = name;
    this.yearOfBirth = yearOfBirth;
    this.job = job;
};

Person.prototype.calculateAge = function () {
    console.log(2020 - this.yearOfBirth);
}

Person.prototype.lastName = 'Bucek';

var adamek = new Person('Adamek', 2013, 'student');
adamek.calculateAge()
console.log(adamek.lastName);

// Object.create
var personProto = {
    calculateAge: function () {
        console.log(2020 - this.yearOfBirth);
    }
};

var adamek2 = Object.create(personProto);
adamek2.name = 'Adamek 2';
adamek2.yearOfBirth = 2013;
adamek2.job = 'student';
adamek2.calculateAge();

var adamek3 = Object.create(personProto, {
    name: { value: 'Adamek' },
    yearOfBirth: { value: 2013 },
    job: { value: 'student' }
});
adamek3.calculateAge();

