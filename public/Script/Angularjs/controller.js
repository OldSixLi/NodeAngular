/*
 * @Author:马少博 (ma.shaobo@qq.com)
 * @Date: 2017年4月5日13:54:19
 * @Last Modified by: 马少博
 * @Last Modified time:2017年4月7日10:53:45
 */

　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　◆◆◆◆◆◆◆　　　　　　◆◆◆　　　　◆◆◆◆◆◆◆◆◆◆　　　◆◆◆　　　　　
// 　　◆◆◆　◆◆◆◆　　　　◆◆◆◆　　　◆◆◆　◆◆　◆◆◆　　　◆◆◆◆　　　　
// 　　◆◆◆　　◆◆◆　　　　◆◆◆◆　　　◆◆　　◆◆　　◆◆　　　◆◆◆◆　　　　
// 　　◆◆◆　　　◆◆◆　　　◆◆◆◆　　　◆◆　　◆◆　　◆◆　　　◆◆◆◆　　　　
// 　　◆◆◆　　　◆◆◆　　◆◆　◆◆　　　　　　　◆◆　　　　　　◆◆　◆◆　　　　
// 　　◆◆◆　　　◆◆◆　　◆◆　◆◆◆　　　　　　◆◆　　　　　　◆◆　◆◆◆　　　
// 　　◆◆◆　　　◆◆◆　　◆◆　◆◆◆　　　　　　◆◆　　　　　　◆◆　◆◆◆　　　
// 　　◆◆◆　　　◆◆◆　　◆◆◆◆◆◆　　　　　　◆◆　　　　　　◆◆◆◆◆◆　　　
// 　　◆◆◆　　　◆◆◆　◆◆　　　◆◆　　　　　　◆◆　　　　　◆◆　　　◆◆　　　
// 　　◆◆◆　　　◆◆◆　◆◆　　　◆◆◆　　　　　◆◆　　　　　◆◆　　　◆◆◆　　
// 　　◆◆◆　　◆◆◆　　◆◆　　　◆◆◆　　　　　◆◆　　　　　◆◆　　　◆◆◆　　
// 　　◆◆◆　◆◆◆◆　◆◆◆　　　◆◆◆　　　　　◆◆　　　　◆◆◆　　　◆◆◆　　
// 　◆◆◆◆◆◆◆　　◆◆◆◆◆　　◆◆◆◆　　◆◆◆◆◆◆　◆◆◆◆◆　　◆◆◆◆　
// 第一个控制器
app.controller('customersCtrl', function($scope, httpService, sortService) {
  /**
   * 异步分页请求数据 
   * @param {any} pageindex 当前页面(从0开始计算)
   * @param {any} url 请求服务地址
   * @param {any} params  请求参数
   */
  $scope.page = function(pageindex, url, params) {
    httpService.pageing(pageindex, '')
      .then(
        //请求成功操作
        function(res) {
          switch (res.status) {
            case 200:
              {
                //请求成功操作
                var data = res.data;
                $scope.data = data;
                $scope.dataLengths = data.content.length > 0;
                break;
              }
            case 404:
              {
                //请求地址不存在
                break;
              }
            case 500:
              {
                //服务器内部错误
                console.log(JSON.stringify(res));
                alert(res.data.errorMessage);
                break;
              }
            default:
              {
                //请求服务失败
                alert("请求服务失败");
                break;
              }
          }
        }
      );
  };

  // 页面加载时执行
  var page = $scope.page;
  page(0);

  /**
   * 排序方法相关的操作 
   * @param {any} ziduan 排序的字段名称 
   */
  $scope.sort = function(ziduan) {
    sortService.sort(ziduan, $scope.desc);
  };

});

// 当前页面中存在的第二个控制器
app.controller('secondCtrl', function($scope) {
  $scope.count = '同一个页面,第二个controller的数据绑定';
});

　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　◆◆◆　　　◆◆◆　　◆◆◆　　　　　　　　◆◆◆◆◆◆◆◆　　◆◆◆◆◆　　　
// 　◆◆◆　　　◆◆◆　　◆◆◆　　　　　　　　◆◆◆　　　　　　◆◆◆　◆◆◆　　
// 　◆◆◆　　　◆◆◆◆　◆◆◆　　　　　　　　◆◆◆　　　　　　◆◆◆　　◆◆　　
// 　◆◆◆　　　◆◆◆◆　◆◆◆　　　　　　　　◆◆◆　　　　　◆◆◆　　　◆◆◆　
// 　◆◆◆　　　◆◆◆◆◆◆◆◆　　　　　　　　◆◆◆　　　　　◆◆◆　　　◆◆◆　
// 　◆◆◆　　　◆◆◆◆◆◆◆◆　　　　　　　　◆◆◆◆◆◆◆　◆◆◆　　　◆◆◆　
// 　◆◆◆　　　◆◆◆◆◆◆◆◆　　　　　　　　◆◆◆　　　　　◆◆◆　　　◆◆◆　
// 　◆◆◆　　　◆◆◆◆◆◆◆◆　　　　　　　　◆◆◆　　　　　　◆◆◆　　◆◆◆　
// 　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　　◆◆◆　　　　　　◆◆◆　◆◆◆　　
// 　◆◆◆　　　◆◆◆　◆◆◆◆　　　　　　　　◆◆◆　　　　　　◆◆◆◆◆◆◆　　
// 　◆◆◆　　　◆◆◆　　◆◆◆　　　　　　　　◆◆◆　　　　　　　◆◆◆◆◆　　　

//info页面 控制器
app.controller('infoCtrl', function($scope, $location, urlService, httpService) {


  $(document).ready(function() {
    //利用JS改变DOM value值,然后同步到Angularjs的作用域中(仅为试行办法,不推荐在Angularjs中使用)
    $("#changeNumBtn").on("click", function() {
      $("#num").val($("#num").val() - 0 + 1);
      $scope.number = $("#num").val();
      //同步angularjs作用域值
      scopeChange();
    });
  });

  // $scope.datas = '我是详情页数据绑定部分';
  var urlObj = urlService.UrlSearch();

  function scopeChange() {
    $scope.$apply();
  }

  if (!urlObj.id) {
    //$location服务解析地址栏中的URL（基于window.location），让你在应用代码中能获取到。改变地址栏中的URL会反应$location服务中，反之亦然。可以获取url参数,也可以改变地址
    tool.alert("提示", "当前页面没有传入参数,返回到列表页面", function() {});
    $location.path('/data');
  } else {
    $scope.datas = urlObj.id;
    var id = urlObj.id;
    httpService.pageing(id, "/users/userinfo?id=" + id).then(
      function(res) {
        switch (res.status) {
          case 200:
            {
              var data = res.data;
              //请求成功操作
              if (data != null && data != "" && data.data != null && data.data != "" && data.data.length > 0) {
                $scope.data = data.data[0];
                console.log(JSON.stringify(data.data[0]));
              }
              break;
            }
          case 404:
            {
              //请求地址不存在
              break;
            }
          case 500:
            {
              //服务器内部错误
              console.log(JSON.stringify(res));
              alert(res.data.errorMessage);
              break;
            }
          default:
            {
              //请求服务失败
              alert("请求服务失败");
              break;
            }
        }
      }
    );
  }
});