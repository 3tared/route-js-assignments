// Part 1: Coding Questions

// 1. Convert the string "123" to a number and add 7.
// const str = "123";
// const numToStr = Number(str);
// console.log(numToStr + 7);

// 2. Check if the given variable is falsy and return "Invalid" if it is.
// const value = 0;
// const resualt = !value ? "Invalid" : "Valid";
// console.log(resualt);

// 3. Use for loop to print all numbers between 1 and 10, skipping even numbers using continue.
// const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// for (let i = 0; i < arr.length; i++) {
//   if (arr[i] % 2 == 0) {
//     continue;
//   }
//   console.log(arr[i]);
// }

// 4. Create an array of numbers and return only the even numbers using filter method.
// const arr = [1, 2, 3, 4, 5];
// const evenNumFilter = arr.filter((num) => num % 2 === 0);
// console.log(evenNumFilter);

// 5. Use the spread operator to merge two arrays, then return the merged array.
// const arr1 = [1, 2, 3];
// const arr2 = [4, 5, 6];
// const merge = [...arr1, ...arr2];
// console.log(merge);

// 6. Use a switch statement to return the day of the week given a number (1 = Sunday ...., 7 = Saturday).
// const days = {
//   1: "sunday",
//   2: "monday",
//   3: "tuesday",
//   4: "wednesday",
//   5: "thursday",
//   6: "friday",
//   7: "saturday",
// };
// const numToDay = (day) => {
//   switch (day) {
//     case 1:
//     case 2:
//     case 3:
//     case 4:
//     case 5:
//     case 6:
//     case 7:
//       return days[day];
//     default:
//       return "Invalid day number";
//   }
// };
// console.log(numToDay(2));

// 7. Create an array of strings and return their lengths using map method.
// const arr = ["a", "ab", "abc", "ab"];
// const elementLength = arr.map((ele) => ele.length);
// console.log(elementLength);

// 8. Write a function that checks if a number is divisible by 3 and 5.
// function divisible(num) {
//   if (num % 3 === 0 && num % 5 === 0) {
//     return "Divisible by both";
//   } else {
//     return "Not Divisible";
//   }
// }
// console.log(divisible(15));

// 9. Write a function using arrow syntax to return the square of a number.
// const squareOfaNumber = (num) => num * num;
// console.log(squareOfaNumber(5));

// 10. Write a function that destructures an object to extract values and returns a formatted string.
// const person = {
//   name: "Mohamed Tarek",
//   age: 24,
// };
// const destructPerson = ({ name, age }) => `${name} is ${age} years old`;
// console.log(destructPerson(person));

// 11 .Write a function that accepts multiple parameters (two or more) and returns their sum.
// const sumNumbers = (...num) => {
//   const sum = num.reduce((prev, curr) => {
//     return prev + curr;
//   });
//   return sum;
// };
// console.log(sumNumbers(1, 2, 3, 4, 5));

// 12. Write a function that returns a promise which resolves after 3 seconds with a 'Success' message.
// const promise = () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve("Sucess");
//     }, 3000);
//   });
// };
// promise().then((message) => {
//   console.log(message);
// });

// 13. Write a function to find the largest number in an array.
// const numbers = [1, 4, 7, 2, 4];
// const findLargeNum = (nums) => Math.max(...nums);
// console.log(findLargeNum(numbers));

// 14. Write a function that takes an object and returns an array containing only its keys.
// const user = {
//   name: "Mohamed Tarek",
//   age: 24,
// };
// const keysToArr = (obj) => Object.keys(obj);
// console.log(keysToArr(user));

// 15. Write a function that splits a string into an array of words based on spaces.
// const str = "The quick brown fox";
// const splitStr = (str) => str.split(" ");
// console.log(splitStr(str));
