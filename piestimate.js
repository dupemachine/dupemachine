// declare some vars we will use.
let iterationValues = [];
let arrayTotal;

// since we are given arctan(1) = piExact / 4, let's first calculate what arctan(1) is
const arcTanOne = Math.PI / 4;

// We get a value of like ~0.785 (rounded).  Using basic algebra we could also rearrange the eq and say then that this number
// multipled by 4 should give us Pi.  So, the point of our work below will be to try to derive this same number/value using the first equation.
// If after enough iterations, we could multiply it by 4 and should be reasonably close to the value of Pi. More iterations = better estimate.


// We are told to go for 20 iterations
// however because i belongs to membership set of only odd numbers from 1 to infinity, we must set i=40 to get 20 iterations
for (let i=1; i <= 40; i++) {

    // only calculate for odd numbers
    if (i % 2 != 0) {
        iterationValues.push(Math.pow( (-1), ((i-1)/2) ) * (Math.pow(1, i) / i));
    }

    // after 20 iterations, calculate the summation of each iteration, multiply by 4, and then log it
    if (i == 40) {
        arrayTotal = iterationValues.reduce((a, b) => a + b, 0);
        let piEstimate = arrayTotal * 4;
        console.log('Here is our estimated value of pi after 20 iterations: ', piEstimate);
        console.log('The actual value of pi is: ', Math.PI);
    }
}

