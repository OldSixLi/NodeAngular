function testIsNum(num) {
  console.log(isNaN(num) && num > 0);
  return num > 0;
}

testIsNum('6')