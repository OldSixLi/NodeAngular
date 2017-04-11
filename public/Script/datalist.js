 var params = " "; //全局变量
 var app = angular.module('myApp', []);
 app.controller('customersCtrl', function($scope, $http) {
     //分页方法声明
     var pageing = function(pageindex, params) {
         //请求地址
         //TODO  需要修改部分
         var url = "../JSON/data.json?" + "pageindex=" + pageindex + "&" + params; //请求的参数和地址
         $http.get(url).success(function(data) {
             if (data != null && data != "" && data != "null") {
                 //判断当前是否存在记录
                 $scope.dataLengths = data.list.length > 0;
                 if (data.list != null && data.list.length > 0) {
                     //赋值操作
                     $scope.names = data;
                     $scope.totalPage = data.page.totalPage;
                     $scope.totalRecord = data.page.totalResult;
                     //调用生成分页方法
                     initPageDiv($("#alreadyPage"), //在哪里生成页码
                         pageindex, //当前页
                         data.page.totalPage, //总页数
                         5, //每次显示多少页
                         $("#currentPage"), //隐藏域的值：当前页数
                         function() {
                             pageing($("#currentPage").val(), params);
                         }
                     );
                     //  2017 年2月28日16: 06: 30 新增
                     $("#alreadyPage").addClass('pagination-split')
                     //  $("#alreadyPage").show();
                 } else {
                     $("#databody").html('<tr><td colspan="100" class="text-center notFound">没有相关数据</td></tr> ');
                     //  $("#alreadyPage").hide(); //未获取到数据时删除操作
                 }
             }
         });
     }
     //分页方法
     pageing(1, params);
     //查询按钮
     $scope.search = function() {
         //TODO  需要修改部分
         //获取输入框参数
         var val1 = $("#input1").val();
         var val2 = $("#sltInvoiceType").val();
         var val3 = $("#sltInvoiceType").val();
         params = "input1=" + val1 + "&sltInvoiceType=" + val2 + "&sltInvoiceType=" + val3;
         pageing(1, params);
     }
     //跳转至某页方法
     $scope.skip = function() {
         if ($scope.toPageValue <= 1) {
             $scope.toPageValue = 1;
         } else if ($scope.toPageValue > $scope.totalPage) {
             $scope.toPageValue = $scope.totalPage;
         }
         pageing($scope.toPageValue, params);
     }
 });
 $(function() {
     $(".breadcrumb,#search_block").height("45px");
     //修改下拉菜单样式
     changeSelect($("#sltInvoiceType"), false);
 });
 //分页控件的初始化
 function initPageDiv($dom, now, all, each, $dom2, change) {
     if (parseInt(now) > parseInt(all)) {
         return;
     }
     var options = {
         bootstrapMajorVersion: 3,
         currentPage: now, // 当前页
         totalPages: all, // 共几页
         numberOfPages: each, // 每次显示几页
         itemTexts: function(type, page, current) { // 修改显示文字
             switch (type) {
                 case "first":
                     return "第一页";
                 case "prev":
                     return "上一页";
                 case "next":
                     return "下一页";
                 case "last":
                     return "最后一页";
                 case "page":
                     return page;
             }
         },
         onPageClicked: function(event, originalEvent, type, page) { // 异步换页
             $dom2.val(page);
             change();
         }
     }
     $dom.bootstrapPaginator(options);
 };
 //下拉菜单的初始化
 function changeSelect($dom, hasSearch) {
     var selectNum = 0;
     if (typeof(hasSearch) != 'undefined') {
         if (hasSearch == false) {
             selectNum = -1;
         }
     }
     $dom.select2({
         tags: true,
         maximumSelectionLength: 3,
         minimumResultsForSearch: selectNum
         // 最多能够选择的个数
     });
 };
