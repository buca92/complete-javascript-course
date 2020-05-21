var firstName = 'Adam';
console.log(firstName)

var lastName = 'Bucek';
var age = 28;

var fullAge = false;
console.log(lastName)

if (age < 15) {
    console.log('1');
} else if (age < 25) {
    console.log('2')
} else if (age < 35) {
    console.log('3')
} else if (age < 45) {
    console.log('4')
} else {
    console.log('no one')
}

function calculateTip(total) {
    var tipRatio;

    if (total < 50) {
        tipRatio = 0.2
    } else if (total < 200) {
        tipRatio = 0.15;
    } else {
        tipRatio = 0.1;
    }

    return total * tipRatio;
}

var totals = [124, 48, 268];
var tips = totals.map((total) => {
    return calculateTip(total)
})
var totalsIncludingTips = totals.map((total) => {
    return total + calculateTip(total)
})

console.log(totals, tips, totalsIncludingTips)
