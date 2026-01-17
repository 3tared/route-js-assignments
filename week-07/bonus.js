var removeElement = function (nums, val) {
  let k = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== val) {
      nums[k] = nums[i];
      k++;
    }
  }

  return k;
};

console.log("Test Case 1:");
let nums1 = [3, 2, 2, 3];
let val1 = 3;
let k1 = removeElement(nums1, val1);
console.log(`k = ${k1}, nums = [${nums1.slice(0, k1)}]`);

console.log("\nTest Case 2:");
let nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
let val2 = 2;
let k2 = removeElement(nums2, val2);
console.log(`k = ${k2}, nums = [${nums2.slice(0, k2)}]`);
