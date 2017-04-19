/*
 * 路由控制模块
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月7日15:28:06
 * @Last Modified by: 马少博
 * @Last Modified time:2017年4月7日15:28:08
 */
var app = angular.module('myApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: "../showDoc/image.html"
      })
      .when('/data', {
        templateUrl: "../showDoc/DataBind.html"
      })
      .when('/info', {
        templateUrl: "../showDoc/info.html"
      })
      .when('/form', {
        templateUrl: "../showDoc/formAdd.html"
      })
      .when('/upload', {
        templateUrl: "../showDoc/upload.html"
      })
      .when('/talk', {
        templateUrl: "../showDoc/talk.html"
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);