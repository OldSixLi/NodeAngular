Vue.component('ht-table', {
  template: '\
        <div>\
          <table class="table table-hover">\
          <thead>\
          <tr><th v-show="showindex==\'true\'||showindex==null">#</th>\
          <th v-for="x in rule" :width="x.width">{{x.name}}</th></tr>\
          </thead><tbody>\
            <tr v-for="(x,index) in valuelist">\
            <td v-show="showindex==\'true\'||showindex==null">{{index+1}}</td>\
            <td v-for="y in rule" >\
               <span v-html="render(x[y.dataKey],y.filter)"> </span>\
               \
              </td>\
            </tr>\
          </tbody>\
          </table>\
          <div class="pull-right page">\
           <ul class="pagination"></ul></div>\
          <span style="display:none;">{{searchDatas}}{{searchData}}</span>\
        </div>',
  //NOTE 如何在此处将数据进行过滤处理是一个问题
  //获取当前的过滤器并进行处理
  props: ["ajaxurl", "searchData", "showindex"],
  data: function() {
    return {
      valuelist: [],
      rule: [],
      nameurl: "李三丰"
    }
  },
  filter: {
    toGender: function(value) {
      return value == "M" ? "男" : "女";
    }
  },
  methods: {
    toshow: function(e) {
      e.preventDefault();
      this.$emit("chuandi");
    },
    //异步请求数据
    getlist: function(pageindex) {
      var data = new Object();
      var self = this;
      var params = new Object();
      params = this.searchData;

      params.page = pageindex;
      $.ajax({
        type: "GET",
        url: this.ajaxurl,
        data: params,
        dataType: "json",
        success: function(data) {
          if (data != null && data != "") {
            if (data.dataSuccess) {
              self.valuelist = data.data;
              var $page = $(self.$el.childNodes[2]).find("ul");
              self.initPageDiv($page,
                pageindex + 1,
                data.totalPages,
                5,
                $page,
                function() {
                  self.getlist($page.data("page") - 1);
                });
            } else {}　
          } else {}
        }　
      });
    },
    render: function(tdData, rule) {
      //如果filter存在
      if (rule) {
        var filter = rule;
        if (window[filter]) {
          var newdata = window[filter](tdData);
          return newdata;
        } else {
          return tdData;
        }
      } else {
        return tdData;
      }
    },
    // 分页方法初始化
    initPageDiv: function($dom, now, all, each, $dom2, change) {
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
        },
        onPageClicked: function(event, originalEvent, type, page) { // 异步换页
          $dom2.data("page", page);
          change();
        }
      }
      $dom.bootstrapPaginator(options);
    },
    parseText: function(str) {
      if (str.indexOf(0) == ("{") || str.indexOf(0) == ("[")) {
        str = str.replace(/'/g, "\"");
        str = str.replace(/(\s?\{\s?)(\S)/g, "$1" + "\"" + "$2");
        str = str.replace(/(\s?,\s?)(\S)/g, "$1" + "\"" + "$2");
        str = str.replace(/(\S\s?):(\s?\S)/g, "$1" + "\":" + "$2");
        str = str.replace(/,"\{/g, ",{");
        str = str.replace(/""/g, "\"");
        str = str.replace(/\s/g, "");
        try {
          str = JSON.parse(str)
        } catch (e) {}
      }
      return str;
    }
  },
  computed: {
    searchDatas: function() {
      this.getlist(0);
      return this.searchData;
    }
  },
  //在组件加载完成后的钩子
  mounted: function() {　
    this.getlist(0);
    var _this = this;
    _this.$slots.default.forEach(function(child) {
      var obj = {};
      for (var p in child.componentOptions.propsData) {
        obj[p] = child.componentOptions.propsData[p]
      }
      _this.rule.push(obj);
    })
  }
});
Vue.component('column', {
  template: '<span style="display: none">123</span>',
  // template: '<span>123</span>',
  props: {
    dataKey: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    align: {
      type: String,
      default: 'left'
    },
    filter: [String, Array],
    width: String,
    action: [String, Array, Object]
  },
  data: function() {
    return {}
  },
  mounted: function() {
    // 把{key:1}变成object
    var filter = this.filter;
    if (filter && !$.isPlainObject(filter)) {
      this.filter = this.parseText(filter);
    }
    var action = this.action;
    if (action && !$.isPlainObject(action)) {
      this.action = this.parseText(action);
      if ($.isPlainObject(this.action)) {
        this.action = [this.action];
      }
    }
  }
});