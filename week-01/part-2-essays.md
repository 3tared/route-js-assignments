Part 2: Essay Questions

1. What is the difference between forEach and for...of? When would you use each?

forEach for me is a method that only accepts an array and loops over it, while for...of is just a loop that accepts any iterable, not necessarily an array.

In forEach, I can’t use break or continue, but in for...of I can do that.
In for...of, I can’t get the index, unlike forEach and also for...in where I can get the index.

Also, for...of gives me the values only, not the index, while forEach can give me both.

I will use for...of if I want full control over the loop, like using continue or break when I reach a certain value, or if I want to loop over a string, array, or any iterable in general, and if I need to use async/await, I will use it here.

I will use forEach if I want to loop over an array and get both the index and the values, and when I want a loop that doesn’t wait and doesn’t stop.

2. What is hoisting and what is the Temporal Dead Zone (TDZ)? Explain with examples.

Hoisting means that when I have a variable (whether var, let, or const) that I declared, and I try to use it before its initialization. For example:

console.log(x);

let x = 0;

Here I’m trying to print the variable x before reaching the line where it’s declared.

Even in this case:

console.log(x);

let x;

I will still get an error:

Cannot access 'x' before initialization

Note: var is the only variable that will give me undefined as its value. The others (let, const) will give me the error above.

So in the end, I will be in the Temporal Dead Zone (TDZ), which means I’m trying to access a value that doesn’t exist yet.
Like in the example above, I’m trying to access x whose value is 0, but I’m still in the dead zone because I can’t reach the value until the variable is initialized.

Example:

console.log(x);

let x = 0;

console.log(x);

The first console.log will throw an error because I’m trying to access a value that doesn’t exist yet — I’m still in the TDZ.
The second console.log will print the value because the variable has already been initialized.

3. What are the main differences between == and ===?

The main difference between == and === is that == checks the value only.
For example, if we have:

let x = "10";

if (x == 10) {
console.log("yes");
} else {
console.log("no");
}

Here, the variable x equals "10" as a value, and == will consider it true because it checks the value only.

But === checks both the value and the type.
So in the example above, if I use ===, it will print no because the variable is a string type and the other is a number.

4. Explain how try-catch works and why it is important in async operations.

The try-catch statement is used to handle errors without stopping the program.
Any code inside the try block runs normally, and if an error occurs, JavaScript immediately moves to the catch block to handle it.

Importance in async operations:

Async operations (like API calls, fetch, and await) can fail at any time due to network issues, invalid data, or server errors.
When an awaited promise rejects, it throws an error.
Using try-catch prevents the async function from crashing and allows you to handle the error safely, such as showing a message or retrying the operation.

5. What’s the difference between type conversion and coercion? Provide examples of each.

Type conversion is when the developer manually converts a value from one type to another.
Type coercion is when JavaScript automatically converts the type during an operation.

Type Conversion (Manual) – Example:
let x = "10";
let y = Number(x); // Manual conversion to number
console.log(y); // 10 (number)

Type Coercion (Automatic) – Example:
let x = "10";
let y = x \_ 2; // JavaScript automatically converts "10" to 10
console.log(y); // 20 (number)
