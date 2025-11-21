function createCounter(init) {
  let currentValue = init;

  return {
    increment: function () {
      currentValue++;
      return currentValue;
    },
    decrement: function () {
      currentValue--;
      return currentValue;
    },
    reset: function () {
      currentValue = init;
      return currentValue;
    },
  };
}

const counter = createCounter(5);

console.log(counter.increment());
console.log(counter.decrement());
console.log(counter.reset());
