export const memorize = f => {
  const cache = {};
  return function () {
    console.log(arguments);
    const key = JSON.stringify(arguments);
    cache[key] = cache[key] ?? f.apply(f, arguments);
    return cache[key];
  };
};

/* test */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const pure = async (a, b) => {
  await delay(3000);
  return a + b;
};
const calc = memorize(pure);

const t0 = performance.now();
const result1 = await calc(3, 3);
const t1 = performance.now();
console.log(result1, '  ', t1 - t0);
const t2 = performance.now();
const result2 = await calc(3, 3);
const t3 = performance.now();
console.log(result2, '  ', t3 - t2);
