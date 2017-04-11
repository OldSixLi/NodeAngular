//请求数据
$(function() {
    //请求第一页的内容
    pageing(1);
}


});
//已开具发票数据部分 翻页的异步请求方法
function pageing(pageindex) {
    var htmlstr = "";
    //请求的接口路径
    var url = "http://localhost:8080/csfwpt_console/restful/order/2/" + pageindex;
    $.getJSON(url, function(data) {
        if (data != null && data != "" && data != "null") {
            var content = data.list; //获取主体数据
            if (content != null && content.length > 0) {
                for (var i = 0; i < content.length; i++) {
                    var singleDataStr = (content[i].状态 === "已作废") ? "<tr class='tr-cancel'>" : "<tr>";
                    singleDataStr += "<td>" + content[i].订单号 + "</td>" +
                        "<td>" + content[i].客户名称 + "</td>" +
                        "<td>" + content[i].销售网点 + "</td>" +
                        "<td>" + content[i].销售人员 + "</td>" +
                        "<td>" + content[i].订单金额 + "</td>" +
                        "<td class='state'>" + content[i].状态 + "</td>" +
                        "<td>" + content[i].订单日期 + "</td>" +
                        "<td>" + "<a href=''>开票</a>|<a href=''>详情</a>|<a href='' class='a-delete'>作废</a>" + "</td>"
                    "</tr>";
                    htmlstr += singleDataStr;
                }
                //创建翻页方法
                paginators(data.page.currentPage, data.page.totalPage);
                //添加数据至当前页面主体中
                $("#databody").html(htmlstr);

            }
        } else {
            //未获取到数据时提示内容
            alert("暂未获取到内容");
        }
    });
}

//翻页控件的设置
function paginators(currentPage, totalPage) {
    var options = {
        bootstrapMajorVersion: 3,
        currentPage: currentPage,
        totalPages: totalPage,
        numberOfPages: 3, //显示的页数
        itemTexts: function(type, page, current) {
            switch (type) {
                case "first":
                    return "首页";
                case "prev":
                    return "<";
                case "next":
                    return ">";
                case "last":
                    return "尾页";
                case "page":
                    return page;
            }
        }
    }
    $("#alreadyPage").bootstrapPaginator(options);
}
