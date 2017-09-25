"use strict";

/**
 * 浩天云项目中部分组件
 * @authors 马少博 (1030809514@qq.com)
 * @date    2017-08-09 14:22:29
 * @version 1.0
 */

//NOTE此处应该为通用方法
function _broadcast(componentName, eventName, params) {
  this.$children.forEach(function(child) {
    var name = child.$options.componentName;
    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      _broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
// 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　◆◆◆◆◆　　　◆　　　◆◆◆◆　　◆◆◆　　　◆◆◆◆◆　
// 　◆　◆　◆　　　◆　　　　◆　　◆　　◆　　　　　◆　　◆　
// 　　　◆　　　　　◆◆　　　◆　　◆　　◆　　　　　◆　◆　　
// 　　　◆　　　　◆　◆　　　◆◆◆　　　◆　　　　　◆◆◆　　
// 　　　◆　　　　◆　◆　　　◆　　◆　　◆　　　　　◆　◆　　
// 　　　◆　　　　◆◆◆◆　　◆　　◆　　◆　　　　　◆　　　　
// 　　　◆　　　　◆　　◆　　◆　　◆　　◆　　　◆　◆　　◆　
// 　　◆◆◆　　◆◆　　◆◆◆◆◆◆　　◆◆◆◆◆◆◆◆◆◆◆　
//表格组件
Vue.component('ht-table', {
  template: "<div>" + "        <table class=\"table table-hover\">" + "          <thead>" + "            <tr>" + "              <!-- 展示序列号 -->" + "              <th v-show=\"!!showindex\">#</th>" + "              <!-- 遍历当前的列名，进行展示，同时设置列的style样式 -->" + "              <th v-for=\"x in rule\" :width=\"x.width\" :style=\"{textAlign:x.align,width:x.width}\">{{x.name}}</th>" + "            </tr>" + "          </thead>" + "          <tbody>" + "            <!-- 搜索结果进行处理 -->" + "            <tr v-for=\"(x,index) in valuelist\" v-show=\"!showLoading&&valuelist!=null&&valuelist.length>0\">" + "              <td v-show=\"!!showindex\">{{index+1}}</td>" + "              <td v-for=\"y in rule\" :style=\"{textAlign:y.align,width:y.width}\">" + "                <!--Begin: If当前的参数为多参数，进行多参数处理操作 -->" + "                <span v-if=\"y.dataKey.split(\',\').length>1\"> " + "                  <!--NOTE 此处的逻辑有点不正常，难描述。" + "                    每个td中的params参数，先置为空数组，再往数组中逐个添加当前td中的参数。" + "                    目的是防止其他td中多参数与当前td参数拼接到一起 -->" + "                <span v-show=\'false\'>{{x.params=[]}}</span>" + "                <span v-for=\"singleKey in y.dataKey.split(\',\')\" style=\"display:none;\"> " + "                        {{x.params.push(x[singleKey])}}" + "                    </span>" + "                <span v-html=\"render(x.params,y.filter)\"> </span>" + "                </span>" + "                <!-- End:结束多参数判断 -->" + "                <!-- Else当前的参数为单个参数，直接进行处理 -->" + "                <span v-else v-html=\"render(x[y.dataKey],y.filter)\"> </span>" + "              </td>" + "            </tr>" + "            <!-- 当前搜索结果为空时，提示没有搜索结果 -->" + "            <tr v-show=\"!showLoading&&(valuelist==null||valuelist.length==0)\">" + "              <td colspan=\"100\">" + "                <h2 class=\"text-center\" style=\"color:#a78989;\">{{errorInfo}}</h2>" + "              </td>" + "            </tr>" + "          </tbody>" + "        </table>" + "        <!-- 加载动画区域 NOTE: 通过修改样式 .cssload-loader 相关参数可以更改动画-->" + "        <div v-show=\"showLoading\" :style=\"loadingHeight\" class=\"relative\">" + "          <div class=\"cssload-loader\"></div>" + "        </div>" + "        <!-- 分页控件模块 -->" + "        <div class=\"pull-right page\">" + "          <ul class=\"pagination\" v-show=\"valuelist!=null&&valuelist.length>0\"></ul>" + "        </div>" + "        <!-- 搜索参数 -->" + "        <span style=\"display:none;\">{{searchDatas}}</span>" + "      </div>",
  props: {
    ajaxurl: {
      required: true
    },
    searchData: {
      default: function _default() {
        return {
          currentPage: 1
        };
      }
    },
    showindex: {
      default: true
    }
  },
  data: function data() {
    return {
      valuelist: [],
      rule: [],
      nameurl: "李三丰",
      showLoading: false,
      loadingHeight: "height:300px",
      errorInfo: "暂无结果"

    };
  },
  filter: {
    toGender: function toGender(value) {
      return value == "M" ? "男" : "女";
    }
  },
  methods: {
    toshow: function toshow(e) {
      e.preventDefault();
      this.$emit("chuandi");
    },
    //异步请求数据
    getlist: function getlist() {
      var self = this;
      var params = new Object();
      params = self.searchData;
      var pageindex = params.currentPage;
      self.loadingHeight = $(self.$el).find('tbody').height() ? "height:" + (($(self.$el).find('tbody').height() - 0 > 300 ? $(self.$el).find('tbody').height() : 300) + "px") : "height:300px";
      $.ajax({
        type: "POST",
        url: this.ajaxurl,
        beforeSend: function beforeSend(request) {
          self.showLoading = true;
        },
        data: params,
        dataType: "json",
        success: function success(data) {
          if (data != null && data != "") {
            try {
              if (data.success) {
                self.valuelist = data.bean.data ? data.bean.data : [];
                for (var i = 0; i < self.valuelist.length; i++) {
                  var element = self.valuelist[i];
                  element["params"] = [];
                }
                // BootStrap分页控件的声明
                if (self.valuelist.length > 0) {
                  var $page = $(self.$el.children[2]).find("ul");
                  self.initPageDiv($page, pageindex, data.bean.pageCount, 5, $page, function() {
                    self.searchData.currentPage = $page.data("page");
                  });
                }
              } else {
                self.valuelist = [];
                self.errorInfo = data.message;
              }
            } catch (error) {
              self.valuelist = [];
              self.showLoading = false;
            }
          }
        },
        error: function error(response) {
          self.valuelist = [];
          if (response.responseText && JSON.parse(response.responseText) && JSON.parse(response.responseText).errorMessage) {} else {}
        },
        complete: function complete() {
          self.showLoading = false;
        }
      });
    },
    render: function render(tdData, rule) {
      if (!rule) {
        return tdData;
      } else {
        var filter = rule;
        return window.HtmlFun && window.HtmlFun[filter] ? Object.prototype.toString.call(tdData) == '[object Array]' ? window.HtmlFun[filter].apply(this, tdData) : window.HtmlFun[filter](tdData) : tdData;
      }
    },
    // 分页方法初始化
    initPageDiv: function initPageDiv($dom, now, all, each, $dom2, change) {
      if (parseInt(now) > parseInt(all)) {
        return;
      }
      var options = {
        bootstrapMajorVersion: 3,
        currentPage: now, // 当前页
        totalPages: all, // 共几页
        numberOfPages: each, // 每次显示几页
        itemTexts: function itemTexts(type, page, current) {
          // 修改显示文字
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
        //单击事件
        onPageClicked: function onPageClicked(event, originalEvent, type, page) {
          // 异步换页
          $dom2.data("page", page);
          change();
        }
      };
      $dom.bootstrapPaginator(options);
    },
    parseText: function parseText(str) {
      if (str.indexOf(0) == "{" || str.indexOf(0) == "[") {
        str = str.replace(/'/g, "\"");
        str = str.replace(/(\s?\{\s?)(\S)/g, "$1" + "\"" + "$2");
        str = str.replace(/(\s?,\s?)(\S)/g, "$1" + "\"" + "$2");
        str = str.replace(/(\S\s?):(\s?\S)/g, "$1" + "\":" + "$2");
        str = str.replace(/,"\{/g, ",{");
        str = str.replace(/""/g, "\"");
        str = str.replace(/\s/g, "");
        try {
          str = JSON.parse(str);
        } catch (e) {}
      }
      return str;
    }
  },
  computed: {
    searchDatas: function searchDatas() {
      this.getlist(0);
      return this.searchData;
    }
  },
  //在组件加载完成后的钩子
  mounted: function mounted() {
    var self = this;
    var _this = this;
    _this.$slots.default.forEach(function(child) {
      var obj = {};
      for (var p in child.componentOptions.propsData) {
        obj[p] = child.componentOptions.propsData[p];
      }
      _this.rule.push(obj);
    });
  }
});

/**
 * table下 column组件声明
 * 2017年8月4日14:56:51 添加
 */
Vue.component('column', {
  template: '<span style="display: none">123</span>',
  props: {
    dataKey: {
      type: String,
      required: true
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
    style: String,
    width: String,
    action: [String, Array, Object]
  },
  data: function data() {
    return {};
  },
  mounted: function mounted() {
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
// 　◆◆◆◆◆　◆◆　◆◆◆◆◆◆◆　　◆◆　　◆◆◆◆◆◆◆　
// 　　　◆　　　　◆　　◆　　◆　　◆　　◆　　◆　◆　◆　◆　
// 　　　◆　　　　◆◆　◆　　◆　　◆　　◆　　◆　　　◆　　　
// 　　　◆　　　　◆◆　◆　　◆◆◆　　　◆　　◆　　　◆　　　
// 　　　◆　　　　◆　◆◆　　◆　　　　　◆　　◆　　　◆　　　
// 　　　◆　　　　◆　◆◆　　◆　　　　　◆　　◆　　　◆　　　
// 　　　◆　　　　◆　　◆　　◆　　　　　◆　　◆　　　◆　　　
// 　◆◆◆◆◆　◆◆◆　◆　◆◆◆　　　　　◆◆　　　◆◆◆　　　
//输入框组件
Vue.component('ht-input', {
  // template: '#ht-input',
  template: '<label style="padding: 0;border: none;border-radius: 0;box-shadow:none;">' + '        <div :class="[' + '                      type === \'textarea\' ? \'el-textarea\' : \'el-input\',' + '                      size ? \'el-input--\' + size : \'\',' + '                      {' + '                        \'is-disabled\': disabled,' + '                        \'el-input-group\': $slots.prepend || $slots.append,' + '                        \'el-input-group--append\': $slots.append,' + '                        \'el-input-group--prepend\': $slots.prepend' + '                      }' + '                    ]">' + '      <template v-if="type !== \'textarea\'">' + '      <!-- 前置元素 -->' + '      <div class="el-input-group__prepend" v-if="$slots.prepend">' + '        <slot name="prepend"></slot>' + '      </div>' + '      <!-- input 图标 -->' + '      <slot name="icon">' + '        <i class="el-input__icon"' + '          :class="[' + '            \'el-icon-\' + icon,' + '            onIconClick ? \'is-clickable\' : \'\'' + '          ]"' + '          v-if="icon"' + '          @click="handleIconClick">' + '        </i>' + '      </slot>' + '      <input' + '        v-if="type !== \'textarea\'"' +
    // NOTE 为了和Bootstrap风格保持一致,取消使用.el-input__inner  
    '        class="form-control"' + '        v-bind="$props" ' + '        :placeholder="places"' + '        :autocomplete="autoComplete"' + '        :value="currentValue"' + '        ref="input"' + '        @input="handleInput"' + '        @focus="handleFocus"' + '        @blur="handleBlur"' + '      >' + '      <i class="el-input__icon el-icon-loading" v-if="validating"></i>' + '      <!-- 后置元素 -->' + '      <div class="el-input-group__append" v-if="$slots.append">' + '        <slot name="append"></slot>' + '      </div>' + '    </template>' + '    </div>' + '    </label>',
  //对外获取的数据
  props: {
    value: [String, Number],
    placeholder: String,
    size: String,
    resize: String,
    readonly: Boolean,
    autofocus: Boolean,
    icon: String,
    disabled: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    name: String,
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    rows: {
      type: Number,
      default: 2
    },
    autoComplete: {
      type: String,
      default: 'off'
    },
    form: String,
    maxlength: Number,
    minlength: Number,
    max: {},
    min: {},
    step: {},
    validateEvent: {
      type: Boolean,
      default: true
    },
    onIconClick: Function
  },
  //
  computed: {
    validating: function validating() {
      return this.$parent.validateState === 'validating';
    },
    textareaStyle: function textareaStyle() {
      return merge({}, this.textareaCalcStyle, {
        resize: this.resize
      });
    }
  },
  watch: {
    'value': function value(_value, oldValue) {
      //根据不同的类型进行处理操作
      var type = this.type;
      switch (type) {
        case "text":
          break;
        case "numbers":
          // this.placeholder = "请输入大于0的整数";
          var reg = new RegExp(/^[1-9]+$/);
          if (!reg.test(_value)) {
            if (_value.length == 1) {

              _value = _value.replace(/[^1-9]/g, '');
            } else {
              if (_value - 0 == 0) {
                _value = "";
              }
              _value = _value.replace(/\D/g, '');
            }
          }
          break;
        case "money":
          // $(".vipprices").keyup(function() {
          var reg = _value.match(/\d+\.?\d{0,2}/);
          var txt = '';
          if (reg != null) {
            txt = reg[0];
          }
          _value = txt;
          // }).change(function() {
          //   $(this).keypress();
          //   var v = $(this).val();
          //   if (/\.$/.test(v)) {
          //     $(this).val(v.substr(0, v.length - 1));
          //   }
          // });
          break;

        default:
          break;
      }
      this.setCurrentValue(_value);
    }
  },

  methods: {
    dispatch: function dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast: function(_broadcast2) {
      function broadcast(_x, _x2, _x3) {
        return _broadcast2.apply(this, arguments);
      }

      broadcast.toString = function() {
        return _broadcast2.toString();
      };

      return broadcast;
    }(function(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    }),
    handleBlur: function handleBlur(event) {
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
      }
    },
    inputSelect: function inputSelect() {
      this.$refs.input.select();
    },
    handleFocus: function handleFocus(event) {
      this.$emit('focus', event);
    },
    handleInput: function handleInput(event) {
      var value = event.target.value;
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('change', value);
    },
    handleIconClick: function handleIconClick(event) {
      if (this.onIconClick) {
        this.onIconClick(event);
      }
      this.$emit('click', event);
    },
    setCurrentValue: function setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  },
  //组件内数据部分
  data: function data() {

    var placehs = "";

    if (this.placeholder == undefined) {

      if (this.type == "numbers") {
        placehs = "请输入数字";
      }
    } else {
      placehs = this.placeholder;
    }

    return {
      currentValue: this.value,
      textareaCalcStyle: {},
      places: placehs
    };
  },
  created: function created() {
    this.$on('inputSelect', this.inputSelect);
    if (this.type == "numbers") {
      if (this.placeholder == undefined) {
        this.places = "请输入大于0的整数";
      }
    }
    if (this.type == "money") {
      if (this.placeholder == undefined) {
        this.places = "请输入金额，小数点后保留两位小数";
      }
    }
  },
  mounted: function mounted() {
    //这个地方我想设置默认的placeholder  但是在添加两个判断条件之后 就会报错  暂时不确定原因
    if (this.type == "numbers") {

      // if (this.placeholder == undefined) {
      // this.placeholder = "请输入数字"
      // }
    }
  }
});
// 　◆◆◆◆　　　　◆　　　◆◆◆◆　　◆◆◆◆◆　　◆◆◆　　
// 　　◆　　◆　　　◆　　　　◆　　◆　　　◆　　　◆　　　◆　
// 　　◆　　◆　　　◆◆　　　◆　　◆　　　◆　　　◆　　　◆　
// 　　◆◆◆　　　◆　◆　　　◆　　◆　　　◆　　　◆　　　◆　
// 　　◆　◆　　　◆　◆　　　◆　　◆　　　◆　　　◆　　　◆　
// 　　◆　　◆　　◆◆◆◆　　◆　　◆　　　◆　　　◆　　　◆　
// 　　◆　　◆　　◆　　◆　　◆　　◆　　　◆　　　◆　　　◆　
// 　◆◆◆　◆◆◆◆　　◆◆◆◆◆◆　　◆◆◆◆◆　　◆◆◆　　

Vue.component("ht-radio", {
  template: '<label class="el-radio">' + '    <span class="el-radio__input"' + '      :class="{' + '        \'is-disabled\': isDisabled,' + '        \'is-checked\': model === label,' + '        \'is-focus\': focus' + '      }"' + '    >' + '      <span class="el-radio__inner"></span>' + '      <input' + '        class="el-radio__original"' + '        :value="label"' + '        type="radio"' + '        v-model="model"' + '        @focus="focus = true"' + '        @blur="focus = false"' + '        @click="click()"' + '        @change="change()"' + '        :name="name"' + '        :disabled="isDisabled">' + '    </span>' + '    <span class="el-radio__label">' + '      <slot></slot>' + '      <template v-if="!$slots.default">{{label}}</template>' + '    </span>' + '  </label>',
  methods: {
    dispatch: function dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root;
      var name = parent.$options.componentName;
      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent;

        if (parent) {
          name = parent.$options.componentName;
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params));
      }
    },
    broadcast: function broadcast(componentName, eventName, params) {
      _broadcast.call(this, componentName, eventName, params);
    },
    //当下点击
    click: function click() {
      this.$emit('click');
    },
    change: function change() {
      this.$emit('change');
    }
  },

  props: {
    value: {},
    label: {},
    disabled: Boolean,
    name: String
  },
  data: function data() {
    return {
      focus: false
    };
  },

  computed: {
    isGroup: function isGroup() {
      var parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'ElRadioGroup') {
          parent = parent.$parent;
        } else {
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    },

    model: {
      get: function get() {
        return this.isGroup ? this._radioGroup.value : this.value;
      },
      set: function set(val) {
        if (this.isGroup) {
          this.dispatch('ElRadioGroup', 'input', [val]);
        } else {
          this.$emit('input', val);
        }
      }
    },

    isDisabled: function isDisabled() {
      return this.isGroup ? this._radioGroup.disabled || this.disabled : this.disabled;
    }
  },
  watch: {
    label: function label(val) {
      alert('23131');
    }
  }
});
// 　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　
// 　　◆◆◆◆　◆◆◆◆◆　◆◆◆　　　◆◆◆◆◆　　◆◆◆◆　◆◆◆◆◆　　◆◆◆　　
// 　◆　　　◆　　◆　　◆　　◆　　　　　◆　　◆　◆　　　◆　◆　◆　◆　◆　　　◆　
// 　◆　　　　　　◆　◆　　　◆　　　　　◆　◆　　◆　　　　　　　◆　　　◆　　　◆　
// 　　◆◆　　　　◆◆◆　　　◆　　　　　◆◆◆　　◆　　　　　　　◆　　　　　　◆　　
// 　　　　◆　　　◆　◆　　　◆　　　　　◆　◆　　◆　　　　　　　◆　　　　　◆　　　
// 　　　　　◆　　◆　　　　　◆　　　　　◆　　　　◆　　　　　　　◆　　　　◆　　　　
// 　◆　　　◆　　◆　　◆　　◆　　　◆　◆　　◆　◆　　　◆　　　◆　　　◆　　　　　
// 　◆◆◆◆　　◆◆◆◆◆　◆◆◆◆◆◆◆◆◆◆◆　　◆◆◆　　　◆◆◆　　◆◆◆◆◆　

// 马少博 2017年9月25日10:48:58 添加
Vue.component('ht-select', {
  props: {
    options: {
      type: Object,
      default: function() {
        //NOTE:在prop设置默认值为对象时,需用方法返回值(不能直接设置值)
        return {
          tags: false,
          minimumResultsForSearch: -1
        }
      }
    },
    value: String
  },
  template: '<select class="form-control"> <slot></slot> </select>',
  //在元素值被挂载以后运行此方法
  mounted: function() {
    var _self = this;
    $(this.$el)
      .select2(this.options)
      .val(this.value)
      .trigger('change')
      .on('change', function() {
        _self.$emit('input', this.value);
      });
  },
  watch: {
    value: function(value) {
      // 更新值
      $(this.$el).val(value).trigger('change');
    },
    options: function(options) {
      // 更新设置
      $(this.$el).select2(options)
    }
  },
  destroyed: function() {
    //删除配置
    $(this.$el).off().select2('destroy');
  }
});