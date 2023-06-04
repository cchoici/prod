export const memorize = f => {
  const cache = {};
  return function () {
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

console.time('time1');
await calc(3, 3);
console.timeEnd('time1');

console.time('time2');
await calc(3, 3);
console.timeEnd('time2');
