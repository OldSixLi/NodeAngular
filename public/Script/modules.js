function isRight(string) {
    var obj = {
        'M': 1,
        'N': 1,
    }
    // 剔除空白符
    string = string.replace(/\s/g, '');
    var error = []; //错误信息
    if ("" === string) {
        error.push("当前计算规则不能为空！");
    }
    if (/^[0-9]*$/.test(string)) {
        error.push("计费规则不能为纯数字！");
    }
    if (/[\+\-\*\/]{2,}/.test(string)) {
        error.push("不能出现连续的运算符！");
    }
    if (/\(\)/.test(string)) {
        error.push("不能出现空括号！");
    }
    var stack = [];
    for (var i = 0, item; i < string.length; i++) {
        item = string.charAt(i);
        if ('(' === item) {
            stack.push('(');
        } else if (')' === item) {
            if (stack.length > 0) {
                stack.pop();
            } else {
                return false;
            }
        }
    }
    if (stack.length !== 0) {
        error.push("括号不配对！");
    }
    if (/\([\+\-\*\/]/.test(string)) {
        error.push("(括号后不能是运算符！");
    }
    if (/[\+\-\*\/]\)/.test(string)) {
        error.push(")括号前不能是运算符！");
    }
    if (/[^\+\-\*\/]\(/.test(string)) {
        error.push("(括号前为非运算符！");　
    }
    if (/\)[^\+\-\*\/]/.test(string)) {
        error.push(")括号后为非运算符！");
    }
    // 错误情况，变量没有来自“待选公式变量”
    var tmpStr = string.replace(/[\(\)\+\-\*\/]{1,}/g, '`');
    var array = tmpStr.split('`');
    for (var i = 0, item; i < array.length; i++) {
        item = array[i];
        if (/[A-Z]/i.test(item) && 'undefined' === typeof(obj[item])) {
            if ([error.length - 1] != "出现无效的变量！") {
                error.push("出现无效的变量！");
            }
        }
    }
    if (error.length == 0) {
        return true;
    } else {
        error.push("请修改后再进行验证。")
        tool.alert("提示", error.join('<br/>'));
        return false;
    }
}
