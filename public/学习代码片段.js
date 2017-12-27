// *****************************************************************
/**
 * 实用代码片段
 * @returns
 */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
/* jshint esversion: 6 */
/**
 * 计算数组中值的出现次数。
 * @returns
 */
const countOccurrences = (arr, value) => arr.reduce((a, v) => v === value ? a + 1 : a + 0, 0);
console.log(countOccurrences([1, 2, 3, 4, 5], 1));
/**
 * 计算数组的和
 * @returns
 */
console.time("forLoop");
const sumArr = (arr) => arr.reduce((a, v) => a + v, 0);
console.log(sumArr([1, 2, 3, 4, 5, 6, 7, 8]));
console.timeEnd("forLoop");

console.time("forLoop");
var arr = [1, 2, 3, 4, 5, 6, 7, 8],
  sum = 0;
for (let index = 0; index < arr.length; index++) {
  const element = arr[index];
  sum += element;
}
console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
console.log(sum);
console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
console.timeEnd("forLoop");
/**
 * forEach(不影响原来数组)
 * @returns
 */
console.time("forLoop");
var arr = [1, 2, 3, 4, 5, 6, 7, 8];
arr.forEach((element, i) => { console.log(i + "是" + element); });
console.log(arr);
console.timeEnd("forLoop");

/**
 * 返回两个数组间的差异
 * @returns
 */
const difference = (a, b) => { const s = new Set(b); return a.filter(x => !s.has(x)); };
console.log(different([1, 2, 4, 5, 10], [1]));

/**
 * 去重
 * @returns
 * 内部使用的比对类似于精确比对(===),但是精确比对认为NaN!=NaN,而在Set内部认为NaN==NaN
 */
const unique = arr => [...new Set(arr)];
console.log(unique([1, 1, 1, 11, 2, 2, 3, 4, 5, NaN, NaN, NaN]));
/**
 * 筛选出数组中的唯一值
 * @returns
 */
const filterNonUnique = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
console.log(filterNonUnique([1, 2, 2, 3, 4, 4, 5]));
/**
 * 参数转数组
 * @returns
 */
const a = (...arr) => arr;
console.log(a(1, 2, 3, 4, 100).reduce((arr, v) => arr + v, 0));
/**
 * 递归减弱数组深度
 * @returns
 */
const flattenDepth =
  (arr, depth = 1) =>
  depth != 1 ? arr.reduce((a, v) => a.concat(Array.isArray(v) ? flattenDepth(v, depth - 1) : v), []) :
  arr.reduce((a, v) => a.concat(v), []);
console.log(
  flattenDepth(
    [
      1, [2],
      [
        [
          [3], 4
        ], 5
      ]
    ], 2));
/**
 * 根据给定函数对数组元素进行分组
 * @returns
 */
const groupBy = (arr, func) =>
  arr
  .map(typeof func === 'function' ? func : val => val[func])
  .reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i]);
    return acc;
  }, {});
console.log(groupBy([6.1, 4.2, 6.3, 6.5], Math.floor));
console.log(groupBy(['one', 'two', 'three'], 'length'));
/**
 * 返回除最后一个数组之外的所有元素。
 * @returns
 */
const initial = arr => arr.slice(0, -1);
console.log(initial([1, 2, 3, 4, 5]));

/**
 * 在指定范围内的数组(递增)
 * @returns
 */
const initializeArrayWithRange = (end, start = 0) =>
  Array.from({ length: end - start }).map((v, i) => i + start);
console.log(initializeArrayWithRange(5));
/**
 * 固定长度的值
 * @returns
 */
const initializeArrayWithValues = (n, value = 0) => Array(n).fill(value);
console.log(initializeArrayWithValues(10, 100));
/**
 * 生成固定长度的数组
 * @returns
 */
// 方法一
var arr = [];
const lengthArr = () => {
  arr.push(10);
  return arr.length < 5 ? lengthArr() : false;
};
lengthArr();
console.log(arr);
// 方法二
var arr = Array.prototype.slice.call(new Int8Array(10));
console.log(arr);
/**
 * 返回数组中的每个第 n 个元素(例:返回2 4 6)
 * @returns 返回数组中的每个第 n 个元素
 */
const everyNth = (arr, nth) => arr.filter((e, i) => i % nth === 0);
console.log(everyNth([1, 2, 3, 4, 5, 6, 7, 8, 9], 3));
/**
 * 筛选出数组中的唯一值(没有其他重复值)
 * @returns
 */
const filterNonUniques = arr => arr.filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
console.log(filterNonUniques([1, 2, 2, 3, 4, 4, 5]));
/**
 * 拼接数组
 * @returns
 */
const flatten = arr => arr.reduce((a, v) => a.concat(v), []);
console.log(flatten([1, [2], 3, 4]));

/**
 * 从对象中挑选键值对
 * @returns
 */
const pick = (obj, arr) => arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});
console.log(pick({ a: 1, b: 3, c: 5, d: 7 }, ['c', 'd']));

/**
 * 对原始数组进行变异, 以筛选出指定的值。(把和第二个参数中匹配的值给删掉)
 * @returns
 */
const pull = (arr, ...args) => {
  let pulled = arr.filter((v, i) => !args.includes(v));
  arr.length = 0;
  pulled.forEach(v => arr.push(v));
};
let myArray = ['a', 'b', 'c', 'a', 'b', 'c'];
pull(myArray, 'a', 'c');
console.log(myArray); //- > ['b', 'b']
//数组删除的方法
arr.splice(index, length);

/**
 * 数组的删除方法(根据index)
 * @returns
 */
Array.prototype.remove = function(from, to) {
  form = form > to ? [to, to = form][0] : form;
  var rest = this.slice((to || from) + 1 || this.length);
  console.log(rest);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
arr.remove(3, 1);

/**
 * 根据函数进行删除
 * @returns
 */
const remove = (arr, func) =>
  Array.isArray(arr) ?
  arr
  .filter(func)
  .reduce((acc, val) => {
    arr.splice(arr.indexOf(val), 1);
    return acc.concat(val);
  }, []) : [];

console.log(remove([1, 2, 3, 4], n => n > 2));

/**
 * 返回数组中的随机元素
 * @returns 随机数
 */
const sample = arr => arr[Math.floor(Math.random() * arr.length)];
console.log(sample([3, 7, 9, 11]));

/**
 * 随机数组值的顺序
 * @returns 随机混乱后的数组
 */
const randomArr = a => a.sort(() => Math.random() - 0.5);
console.log(randomArr([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]));

/**
 * 返回两个数组中包含的元素的数组
 * @returns
 */
const commonArr = (arr, values) => arr.filter(v => values.includes(v));
console.log(commonArr([1, 2, 3], [1, 2, 4]));

/**
 * 返回两个数组之间的差异
 * @returns
 */
const diffArr = (a, b) => {
  const arrA = new Set(a),
    arrB = new Set(b);
  return [...a.filter(x => !arrB.has(x)), ...b.filter(x => !arrA.has(x))];
};
console.log(diffArr([1, 2, 3], [1, 2, 4]));
/**
 * 返回数组中的所有元素, 除第一个。
 * @returns
 */

const tail = arr => arr.length > 1 ? arr.slice(1) : arr;
console.log(tail([1, 2, 3]));

/**
 * 从第n个index以后删除数组(从开始截取几个数)
 * @returns
 */
const take = (arr, n = 1) => arr.slice(0, n);
console.log(take([1, 2, 3], 1));

/**
 * 返回一个数组, 其中 n 个元素从末尾移除。(和上边方法相反,从末尾截取几个数)
 * @returns
 */
const takeRight = (arr, n = 1) => arr.slice(arr.length - n, arr.length);
console.log(takeRight([1, 2, 3], 3));

/**
 * 返回两个数组组合后去重的值
 * @returns
 */
const uniteArr = (a, b) => [...new Set([...a, ...b])];
console.log(uniteArr([1, 2, 2, 3], [2, 3, 4]));

/**
 * 创建基于原始数组中的位置分组的元素数组。
 * @returns
 */
const zip = (...arrays) => {
  const maxNum = Math.max(...arrays.map(x => x.length));
  return Array.from({ length: maxNum }).map(
    (_, i) => {
      return Array.from({ length: arrays.length }, (_, k) => arrays[k][i]);
    });
};

let ass = [1, 2];
let b = [3, 4];
let c = [5, 6];
let d = [7, 8];
let e = [9, 10];
console.log(zip(ass, b, c, d, e)); //[ [ 1, 3, 5, 7, 9 ], [ 2, 4, 6, 8, 10 ] ]

//https://github.com/kujian/30-seconds-of-code#difference
/**
 * 
 * Promise 例1
 * @returns
 */
const sttClog = (m) => {
  return new Promise(function(resolve, reject) {
    if (true) {
      setTimeout(() => {
        resolve(500);
      }, m);
    } else {
      reject(error);
    }
  });
};
sttClog(5000).then(v => console.log(v));
/**
 * Promise执行顺序
 * @returns
 */
let promise = new Promise(function(resolve, reject) {
  console.log('先执行Promise');
  resolve();
});

promise.then(function() {
  console.log('最后执行回调函数resolved.');
});
console.log('后执行Hi!');
/**
 * Promise处理错误
 * @returns
 */
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
}).catch(e => console.log('当前的错误是' + e));
// Uncaught (in promise) ReferenceError: x is not defined

/**
 * Promise.all
 * @returns
 */
const p1 = new Promise((resolve, reject) => {
    resolve('hello');
  })
  .then(result => result)
  .catch(e => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
  })
  .then(result => result)
  .catch(e => "当前错误" + e);

Promise.all([p1, p2])
  .then((result) => console.log("结果" + result))
  .catch(e => console.log(e));
// 结果hello,当前错误Error: 报错了 NOTE 在promise中自己处理了 ,不会走最后一个catch

/**
 * 获取当前结果对象
 * @returns
 */
const getURLParameters = url =>
  url.match(/([^?=&]+)(=([^&]*))/g).reduce(
    (a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {}
  );
console.log(getURLParameters('http://url.com/page?name=马少博&surname=网络名称'));
/**
 * 重定向到指定的 URL。
 * 传递第二个参数以模拟链接单击 (true-默认值) 或 HTTP 重定向 (false)
 * @returns
 */
const redirect = (url, asLink) =>
  asLink ? window.location.href = url : window.location.replace(url);
// redirect('https://google.com');

const digitize = n => [...
  ('' + n)
].map(i => parseInt(i));
console.log(digitize('2sadsadasd334'));

var a = Array.prototype.slice.call(new Int8Array(10));
var b = a.map(x => 10);
var b = Array(n).fill(value);
console.log(b);

/**
 * 计算最大除数(最大公约数)
 * @returns
 */
console.log(8 % 36);
const gcd = (x, y) => !y ? x : gcd(y, x % y);
// const gcd = (x, y) => {
//   console.log(x + ":" + y);
//   return !y ? x : gcd(y, x % y);
// }
console.log(gcd(8, 36));

/**
 * 最小公倍数
 * @returns
 */
const lcm = (x, y) => {
  const gcd = (x, y) => !y ? x : gcd(y, x % y);
  return Math.abs(x * y) / (gcd(x, y));
};

console.log(lcm(18, 30));

/**
 * 写入文件 
 * @returns
 */
const fs = require('fs');
const path = require('path');
const JSONToFile = (str) => fs.writeFile(path.resolve(__dirname, "./a.txt"), str);

JSONToFile("文件写入相关的内容上行下效寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻寻\n你们测试的内容是恩邯郸市三大手笔");
/**
 * 读取文件 
 * @returns 
 */
const readFileLines = filename => fs.readFileSync(filename).toString('UTF8').split('\n');
console.log(readFileLines(path.resolve(__dirname, "./a.txt")));


/**
 * 将字符串的第一个字母大写
 * lowerRest参数以保持字符串的其余部分不变, 或将其设置为true以转换为小写
 * @returns 
 */
const capitalize = ([first, ...rest], lowerRest = false) =>
  first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));
console.log(capitalize("ssssssssSSSsssssss", true));
/**
 *  将字符串中每个单词的首字母大写。
 * @returns 
 */
const capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase());
console.log(capitalizeEveryWord('hello world!')); //'Hello World!'
/**
 * 根据首字母大写分隔字符串 (将驼峰处理成分隔的形状)
 * @returns 
 */
const fromCamelCase = (str, separator = '_') =>
  str.replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
  .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2').toLowerCase();
// fromCamelCase('someDatabaseFieldName', ' ') -> 'some database field name'
// fromCamelCase('someLabelThatNeedsToBeCamelized', '-') -> 'some-label-that-needs-to-be-camelized'
// fromCamelCase('someJavascriptProperty', '_') -> 'some_javascript_property'
console.log(fromCamelCase('someLabelThatNeedsToBeCamelized', '-')); //Vue组件声明类似的方法
/**
 * 字符串反转 
 * @returns 
 */
const reStr = (str) => [...str].reverse().join("");
console.log(reStr('asdfghjkl'));
/**
 * 
 * 字符串排序 
 * @returns 
 */
const sortStr = (str) => [...str].sort((a, b) => a.localeCompare(b)).join('');
console.log(sortStr('cabbage')); //aabbceg
/**
 * 字符串截取固定长度 
 * @returns 
 */
// truncateString('boomerang', 7) -> 'boom...'
const toSetLengthStr = (str, num) => str.length > num ? str.slice(0, num > 3 ? num - 3 : num) : str;
/**
 *  将3位色码扩展为6位色码。
 * @returns 
 */
const extendHex = shortHex =>
  '#' + shortHex.slice(shortHex.startsWith('#') ? 1 : 0).split('').map(x => x + x).join('');
const zhuanbian = str => '#' + [...str.slice(str.startsWith("#") ? 1 : 0)].map(x => x + x).join("");
console.log(zhuanbian('#03f'));

/**
 * 
 * 判断是否是数组 
 * @returns 
 */
const isArray = val => !!val && Array.isArray(val);
// isArray(null) -> false
// isArray([1]) -> true
console.log(Array.isArray(0));
/**
 * 类型判断 
 * @returns 
 */
const testType = (val) => {
  typeof val === 'symbol';
  typeof val === 'string';
  typeof val === 'number';
  typeof val === 'function';
  typeof val === 'boolean';
  !!val && Array.isArray(val);
  return true;
};
console.log(testType('s'));

/**
 * 邮件检测 
 * @returns 
 */
const validateEmail = str =>
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(str);
console.log(validateEmail('mymai@lgmail.com'));
// validateEmail(mymail@gmail.com) -> true
/**
 * 判断是否是数字 
 * @returns 
 */
const validateNumber = n => !isNaN(parseFloat(n)) && isFinite(n) && Number(n) == n;
console.log(validateNumber('10'));

console.log(parseInt('90s')); //会忽略之后的数字
//  -> true