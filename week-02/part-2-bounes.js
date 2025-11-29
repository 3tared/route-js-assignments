function findKthPositive(arr, k) {
  let missingCount = 0;
  let current = 1;
  let arrIndex = 0;

  while (missingCount < k) {
    if (arrIndex < arr.length && arr[arrIndex] === current) {
      arrIndex++;
    } else {
      missingCount++;
      if (missingCount === k) {
        return current;
      }
    }
    current++;
  }

  return current - 1;
}
