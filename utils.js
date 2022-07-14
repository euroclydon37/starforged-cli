const {
  split,
  equals,
  pipe,
  range,
  includes,
  map,
  keys,
  find,
  prop,
  __,
} = require("ramda");

const isExactNumber = (key) => split("-")(key).length === 1;

const compareKey = (num) => (key) => {
  if (isExactNumber(key)) {
    return equals(Number(key), num);
  }

  return pipe(
    split("-"),
    map(Number),
    ([min, max]) => range(min, max + 1),
    includes(num)
  )(key);
};

const getResult = (num) => (table) =>
  pipe(keys, find(compareKey(num)), prop(__, table))(table);

const randomInteger = ({ max }) => Math.floor(Math.random() * max) + 1;

module.exports = { compareKey, getResult, randomInteger };
