/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月7日10:55:20
 * @Last Modified by: 马少博
 * @Last Modified time:2017年4月7日10:55:24
 */

//声明APP  
// var app = angular.module('myApp', []);
//创建异步请求服务
app.factory('httpService',
  function($http, $q) {
    /**
     * 异步分页请求数据 
     * @param {any} pageindex 当前页面(从0开始计算)
     * @param {any} url 请求服务地址
     * @param {any} params  请求参数
     */
    var pageing = function(pageindex, url, params) {
      // $q是Angular的一种内置服务， 它可以使你异步地执行函数， 并且当函数执行完成时或异常时它允许你使用函数的返回值或返回执行状态通知等。
      var defer = $q.defer();
      if (url == "") {
        url = "/users/users" + "?" + "page=" + pageindex + "&pageNum=10"; //请求的参数和地址
      }
      $http.get(url)
        .success(function(data, status, head, config) {
          var res = {
            data: data,
            status: status,
            config: config
          };
          defer.resolve(res);
        })
        .error(function(data, status, headers, config) {
          var res = {
            data: data,
            status: status
          };
          defer.resolve(res);
        });
      //返回数据
      return defer.promise;
    };

    //返回的方法
    return {
      pageing: pageing
    };

  }
);

//创建排序服务
app.factory('sortService',
  function() {
    /**
     * 排序方法相关的操作 
     * @param {any} ziduan 排序的字段名称
     * @param {any} desc 排序方式(T/F :正序/逆序)
     */
    var sort = function(ziduan, desc) {
      var classname = '';
      if (desc) {
        classname = 'glyphicon glyphicon-arrow-down';
      } else {
        classname = 'glyphicon glyphicon-arrow-up';
      }
      $("[data-order]").find('span').addClass('glyphicon glyphicon-sort');
      $("[data-order='" + ziduan + "']").find('span').removeClass().addClass(classname);
    };

    //返回的方法
    return {
      sort: sort
    };
  }
);

//获取当前页面传过来的参数
app.factory('urlService',
  function() {
    /**
     * 获取URL地址中参数方法
     * 存储为对象
     */
    var UrlSearch = function() {
      var obj = {};
      var name, value;
      var str = location.href; //取得整个地址栏
      var num = str.indexOf("?");
      str = str.substr(num + 1);
      var arr = str.split("&"); //各个参数放到数组里
      for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
          name = arr[i].substring(0, num);
          value = arr[i].substr(num + 1);
          obj[name] = value;
        }
      }
      return obj;
    };

    //返回的方法
    return {
      UrlSearch: UrlSearch
    };
  }
);