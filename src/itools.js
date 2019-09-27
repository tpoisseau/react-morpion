// https://gist.githubusercontent.com/tpoisseau/f0095249dfdeacbafc51f8af04b0aac1/raw/49a7c1568428c654d9ec3b2179d9a081c1c0e31a/itools.js
/**
 * Array.prototype rewrite for functional generator compatibilities + some extra
 */

export function* range({start=0, stop=Infinity, step=1}) {
  for (let i = start; i < stop; i+=step) {
      yield i;
  }
}

export function* concat(...args) {
 for (let arg of args) {
     if (Array.isArray(arg)) yield * arg;
     else yield arg;
 }
}

export function every(iterable, callback) {
 for (let item of iterable) {
     if (!callback(item)) return false;
 }

 return true;
}

export function* filter(iterable, callback) {
 for (let item of iterable) {
     if (callback(item)) yield item;
 }
}

export function find(iterable, callback) {
 for (let item of iterable) {
     if (callback(item)) return item;
 }
}

export function* ennumerate(iterable) {
 let index = 0;
 for (let item of iterable) {
     yield [index++, item];
 }
}

export function findIndex(iterable, callback) {
 for (let [index, item] of ennumerate(iterable)) {
     if (callback(item)) return index;
 }
}

export function forEach(iterable, callback) {
 for (let item of iterable) {
     callback(item);
 }
}

export function includes(iterable, value) {
 for (let item of iterable) {
     if (item === value) return true;
 }

 return false;
}

export function indexOf(iterable, value) {
 for (let [index, item] of ennumerate(iterable)) {
     if (item === value) return index;
 }

 return -1;
}

export function join(iterable, joiner) {
 let result = '';

 for (let item of iterable) {
     result += item + joiner;
 }

 return result.substr(0, result.length - joiner.length);
}

export function* map(iterable, callback) {
 for (let item of iterable) {
     yield callback(item);
 }
}

export function* shift(iterable, position=1) {
 const it = ennumerate(iterable);

 for (let i = 0; i < position; i++) {
     it.next();
 }

 yield * it;
}

export function* reverse(iterable) {
 yield * Array.from(iterable).reverse();
}

export function* slice(iterable, {start=0, stop, step=1}) {
 for (let [index, item] of ennumerate(iterable)) {
     if (index < start) continue;
     if (index >= stop) continue;

     if ((index % step) !== 0) continue;

     yield item;
 }
}

export function some(iterable, callback) {
 for (let item of iterable) {
     if (callback(item)) return true;
 }

 return false;
}

export function reduce(iterable, callback, initValue=0) {
 for (let item of iterable) {
     initValue = callback(initValue, item);
 }

 return initValue;
}

export function* flat(iterable) {
 yield * reduce(iterable, (acc, val) => concat(acc, val), [])
}

export function* iter(iterable) {
    yield * iterable;
}

/*
heavely inspired from python doc
https://docs.python.org/3.3/library/functions.html#zip

def zip(*iterables):
    # zip('ABCD', 'xy') --> Ax By
    sentinel = object()
    iterators = [iter(it) for it in iterables]
    while iterators:
        result = []
        for it in iterators:
            elem = next(it, sentinel)
            if elem is sentinel:
                return
            result.append(elem)
        yield tuple(result)
*/
export function* zip(...iterables) {
    const iterators = [...map(iterables, (it => iter(it)))];
    
    while (true) {
        const result = [];
        
        let atLeastOneDone = false;
        for (const it of iterators) {
            const {done=false, value} = it.next();
            if (done) atLeastOneDone = true;

            result.push(value);
        }

        yield result;
        if (atLeastOneDone) break;
    }
}

/**
* functional API
*/

export function partial(callback, ...cachedArgs) {
 return (...args) => callback(...cachedArgs, ...args)
}

export function partialRight(callback, ...cachedArgs) {
 return (...args) => callback(...args, ...cachedArgs);
}


export function construct(Type, ...args) {
 return new Type(...args);
}

export function pipe(value, ...operations) {
 for (let op of operations) {
    value = op(value);
 }

 return value;
}

reduce([
 concat, every, filter, find, ennumerate, findIndex, forEach, includes,
 indexOf, join, map, shift, reverse, slice, some, reduce, flat, range,
], (acc, value) => {
 acc[value.name] = partial(partialRight, value);

 return acc;
}, pipe);

pipe.construct = Type => (it => construct(Type, it));

/*
const itools = require('./index.js');
const {pipe} = itools;

const result = pipe(
 itools.range({stop: 100}),
 pipe.map(v => v * Math.random()),
 pipe.map(Math.floor),
 pipe.filter(v => v % 2),
 pipe.construct(Set),
 itools.ennumerate,
 pipe.reduce((map, [index, value]) => map.set(index, value), new Map()),
 map => map.entries(),
 pipe.map(([k, v]) => `${k}:${v}`),
 pipe.join(', ')
);

console.log(result);
*/