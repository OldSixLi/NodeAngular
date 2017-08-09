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
  template: '\
        <div>\
          <table :class="getClass(classname)">\
          <thead>\
          <tr><th v-show="showindex==\'true\'||showindex==null">#</th>\
          <th v-for="x in rule" :style="getStyle(x)">{{x.name}}</th></tr>\
          </thead><tbody>\
            <tr v-for="(x,index) in valuelist">\
            <td v-show="showindex==\'true\'||showindex==null">{{index+1}}</td>\
            <td v-for="y in rule" :style="getStyle(y)">\
               <span v-if="y.ishtml==\'true\'" v-html="render(x[y.dataKey],y.filter)"> </span>\
               <span v-if="y.ishtml!=\'true\'">{{render(x[y.dataKey],y.filter)}} </span>\
               \
              </td>\
            </tr>\
          </tbody>\
          </table>\
          <div class="pull-right page">\
           <ul class="pagination"></ul></div>\
          <span style="display:none;">{{paramss}}{{params}}</span>\
        </div>',
  //NOTE 如何在此处将数据进行过滤处理是一个问题
  //获取当前的过滤器并进行处理
  //TODO  此处可以改为相关属性的required default值
  props: ["url", "params", "showindex", "classname"],
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
      params = this.params;
      params.currentPage = pageindex;
      $.ajax({
        type: "GET",
        url: this.url,
        data: params,
        dataType: "json",
        success: function(data) {
          if (data != null && data != "") {
            if (data.success) {
              //数据进行处理
              self.valuelist = data.bean.data;
              var $page = $(self.$el.childNodes[2]).find("ul");
              //调用分页方法
              self.initPageDiv($page, pageindex + 1, data.pageCount, 5, $page, function() {
                self.getlist($page.data("page") - 1);
              });

            } else { console.info("当前data.success值为false，数据请求失败！"); }　
          } else { console.info("当前data为空，数据请求失败！") }
        },
        error: function() {
          console.info("当前数据请求失败，请校验url地址和搜索参数格式是否正确！");
        }
      });
    },
    //设置样式
    getStyle: function(col) {
      return {
        "text-align": col.align,
        "width": col.width
      }
    },
    //样式名称
    getClass: function(name) {
      return name ? "table table-hover " + name : "table table-hover";
    },
    //处理数据
    render: function(tdData, rule) {
      //如果filter存在
      if (rule) {
        var filter = rule;
        if (window[filter]) {
          var newdata = window[filter](tdData);
          return newdata;
        } else {
          console.info("当前未声明" + rule + "方法");
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
    paramss: function() {
      this.getlist(0);
      return this.params;
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
// 　　◆◆◆◆　　◆◆◆　　◆◆◆　　　◆◆　　◆◆◆◆　◆◆◆◆◆　◆◆◆　
// 　◆　　　◆　◆　　　◆　　◆　　　　　◆　　◆　◆◆　◆◆　　◆　　◆　　
// 　◆　　　　　◆　　　◆　　◆　　　　　◆　　◆　◆◆　◆◆　　◆◆　◆　　
// 　◆　　　　　◆　　　◆　　◆　　　　　◆　　◆　◆◆　◆◆　　◆◆　◆　　
// 　◆　　　　　◆　　　◆　　◆　　　　　◆　　◆　◆　◆　◆　　◆　◆◆　　
// 　◆　　　　　◆　　　◆　　◆　　　　　◆　　◆　◆　◆　◆　　◆　◆◆　　
// 　◆　　　◆　◆　　　◆　　◆　　　◆　◆　　◆　◆　◆　◆　　◆　　◆　　
// 　　◆◆◆　　　◆◆◆　　◆◆◆◆◆◆　　◆◆　◆◆　◆　◆◆◆◆◆　◆　　
//每列组件
Vue.component('column', {
  template: '<span style="display: none"></span>',
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
    action: [String, Array, Object],
    ishtml: false
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
  template: '<label style="padding: 0;border: none;border-radius: 0;box-shadow:none;">' +
    '        <div :class="[' +
    '                      type === \'textarea\' ? \'el-textarea\' : \'el-input\',' +
    '                      size ? \'el-input--\' + size : \'\',' +
    '                      {' +
    '                        \'is-disabled\': disabled,' +
    '                        \'el-input-group\': $slots.prepend || $slots.append,' +
    '                        \'el-input-group--append\': $slots.append,' +
    '                        \'el-input-group--prepend\': $slots.prepend' +
    '                      }' +
    '                    ]">' +
    '      <template v-if="type !== \'textarea\'">' +
    '      <!-- 前置元素 -->' +
    '      <div class="el-input-group__prepend" v-if="$slots.prepend">' +
    '        <slot name="prepend"></slot>' +
    '      </div>' +
    '      <!-- input 图标 -->' +
    '      <slot name="icon">' +
    '        <i class="el-input__icon"' +
    '          :class="[' +
    '            \'el-icon-\' + icon,' +
    '            onIconClick ? \'is-clickable\' : \'\'' +
    '          ]"' +
    '          v-if="icon"' +
    '          @click="handleIconClick">' +
    '        </i>' +
    '      </slot>' +
    '      <input' +
    '        v-if="type !== \'textarea\'"' +
    // NOTE 为了和Bootstrap风格保持一致,取消使用.el-input__inner  
    '        class="form-control"' +
    '        v-bind="$props" ' +
    '        :placeholder="places"' +
    '        :autocomplete="autoComplete"' +
    '        :value="currentValue"' +
    '        ref="input"' +
    '        @input="handleInput"' +
    '        @focus="handleFocus"' +
    '        @blur="handleBlur"' +
    '      >' +
    '      <i class="el-input__icon el-icon-loading" v-if="validating"></i>' +
    '      <!-- 后置元素 -->' +
    '      <div class="el-input-group__append" v-if="$slots.append">' +
    '        <slot name="append"></slot>' +
    '      </div>' +
    '    </template>' +
    '    </div>' +
    '    </label>',
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
    validating() {
      return this.$parent.validateState === 'validating';
    },
    textareaStyle() {
      return merge({}, this.textareaCalcStyle, {
        resize: this.resize
      });
    }
  },
  watch: {
    'value' (value, oldValue) {
      //根据不同的类型进行处理操作
      var type = this.type;
      switch (type) {
        case "text":
          break;
        case "numbers":
          // this.placeholder = "请输入大于0的整数";
          var reg = new RegExp(/^[1-9]+$/);
          if (!reg.test(value)) {
            if (value.length == 1) {

              value = value.replace(/[^1-9]/g, '')
            } else {
              if (value - 0 == 0) {
                value = ""
              }
              value = value.replace(/\D/g, '')
            }
          }
          break;
        case "money":
          // $(".vipprices").keyup(function() {
          var reg = value.match(/\d+\.?\d{0,2}/);
          var txt = '';
          if (reg != null) {
            txt = reg[0];
          }
          value = txt;
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
      this.setCurrentValue(value);
    }
  },

  methods: {
    dispatch(componentName, eventName, params) {
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
    broadcast(componentName, eventName, params) {
      broadcast.call(this, componentName, eventName, params);
    },
    handleBlur(event) {
      this.$emit('blur', event);
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.blur', [this.currentValue]);
      }
    },
    inputSelect() {
      this.$refs.input.select();
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    handleInput(event) {
      const value = event.target.value;
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('change', value);
    },
    handleIconClick(event) {
      if (this.onIconClick) {
        this.onIconClick(event);
      }
      this.$emit('click', event);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      }
    }
  },
  //组件内数据部分
  data() {

    var placehs = "";

    if (this.placeholder == undefined) {

      if (this.type == "numbers") {
        placehs = "请输入数字"
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
  created() {
    this.$on('inputSelect', this.inputSelect);
    if (this.type == "numbers") {
      if (this.placeholder == undefined) {
        this.places = "请输入大于0的整数"
      }
    }
    if (this.type == "money") {
      if (this.placeholder == undefined) {
        this.places = "请输入金额，小数点后保留两位小数"
      }
    }
  },

  mounted() {
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
  template: '<label class="el-radio">' +
    '    <span class="el-radio__input"' +
    '      :class="{' +
    '        \'is-disabled\': isDisabled,' +
    '        \'is-checked\': model === label,' +
    '        \'is-focus\': focus' +
    '      }"' +
    '    >' +
    '      <span class="el-radio__inner"></span>' +
    '      <input' +
    '        class="el-radio__original"' +
    '        :value="label"' +
    '        type="radio"' +
    '        v-model="model"' +
    '        @focus="focus = true"' +
    '        @blur="focus = false"' +
    '        @click="click()"' +
    '        @change="change()"' +
    '        :name="name"' +
    '        :disabled="isDisabled">' +
    '    </span>' +
    '    <span class="el-radio__label">' +
    '      <slot></slot>' +
    '      <template v-if="!$slots.default">{{label}}</template>' +
    '    </span>' +
    '  </label>',
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