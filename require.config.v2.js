/* 司徒正美 */
/*如果有require备份，恢复*/ ;
(function() {
    if (window.requireJsStack) {
        window.require = _require;
        window.define = _define;
        for (var i = 0, len = requireJsStack.length, requireJsItem; requireJsItem = requireJsStack[i]; i += 1) {
            window[requireJsItem.type].apply(window, requireJsItem.args);
        }
    }
}());

/*全局标识的变量*/
var __isLib = function(url) {
    return url.indexOf("dev.dotnar.com:2221") !== -1 || url.indexOf("lib.dotnar.com") !== -1 || url.indexOf("lib.dev-dotnar.com") !== -1
};
var _protocol = location.protocol || "http:";
var _isLib = __isLib(location.host);
var _isLib_color = _isLib ? "color:#1ba1e2" : "color:#d54d34";
var _isIE = !window.dispatchEvent;
var _isLS = !!window.localStorage;
var _isNewDev = location.host.indexOf("dev-dotnar.com") !== -1;
var _isDev = location.host.indexOf("dev.dotnar.com") === 0 || _isNewDev;
var _isDebug = location.search.indexOf("dev=true") !== -1;
var _isBus = location.host === "dev.dotnar.com:2225" || location.hostname === "admin.dotnar.com" || location.hostname === "jewel_admin.dotnar.com" || location.hostname === "admin.dev-dotnar.com";
var _isPay = location.host === "dev.dotnar.com:2224" || location.hostname === "dotnarpay.dotnar.com" || location.hostname === "dotnarpay.dev-dotnar.com";
var _isWWW = location.host === "dev.dotnar.com:2223" || location.hostname === "www.dotnar.com" || location.hostname === "dotnar.com" || location.hostname === "www.dev-dotnar.com" || location.hostname === "dev-dotnar.com";
var _isStore = location.host === "dev.dotnar.com:2222" || location.host.indexOf("dev-dotnar.com") !== -1 || /*location.hostname.indexOf(".dotnar.com") === (location.hostname.length - ".dotnar.com".length) && */ (!_isBus && !_isWWW)
var _isWX = (/MicroMessenger/i).test(window.navigator.userAgent);
var _canWebp = false;
(function() {
    try {
        var image = new Image();
        image.onload = function() {
            _canWebp = true;
        };
        image.src = 'data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA==';
    } catch (e) {}
}());
var _empty_img_url = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
var isMobile = function(_mobileAgent) {
    var mobileAgent = _mobileAgent || ["nokia", "iphone", "android", "motorola", "^mot-", "softbank", "foma", "docomo", "kddi", "up.browser", "up.link", "htc", "dopod", "blazer", "netfront", "helio", "hosin", "huawei", "novarra", "CoolPad", "webos", "techfaith", "palmsource", "blackberry", "alcatel", "amoi", "ktouch", "nexian", "samsung", "^sam-", "s[cg]h", "^lge", "ericsson", "philips", "sagem", "wellcom", "bunjalloo", "maui", "symbian", "smartphone", "midp", "wap", "phone", "windows ce", "iemobile", "^spice", "^bird", "^zte-", "longcos", "pantech", "gionee", "^sie-", "portalmmm", "jigs browser", "hiptop", "^benq", "haier", "^lct", "operas*mobi", "opera*mini", "mobile", "blackberry", "IEMobile", "Windows Phone", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire", "ucbrowser"];
    var browser = navigator.userAgent.toLowerCase();
    var isMobile = false;
    for (var i = 0; i < mobileAgent.length; i++) {
        if (browser.indexOf(mobileAgent[i]) != -1) {
            isMobile = true;
            break;
        }
    }
    return isMobile;
};
var _isMobile = isMobile();
/*
 * 本地存储功能
 */
(function(window) {
    //准备模拟对象、空函数等
    var LS, noop = function() {},
        document = window.document,
        notSupport = {
            set: noop,
            get: noop,
            remove: noop,
            clear: noop,
            each: noop,
            obj: noop,
            length: 0
        };

    if (_isLS) {
        try {
            LS = window.localStorage;
        } catch (e) {
            //如果报错，说明浏览器已经关闭了本地存储或者提高了安全级别
            //则尝试使用userData
        }
    }

    //二次包装接口
    window.LS = !LS ? notSupport : {
        set: function(key, value) {
            //fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
            if (this.get(key) !== undefined)
                this.remove(key);
            LS.setItem(key, value);
            this.length = LS.length;
        },
        //查询不存在的key时，有的浏览器返回null，这里统一返回undefined
        get: function(key) {
            var v = LS.getItem(key);
            return v === null ? undefined : v;
        },
        remove: function(key) {
            LS.removeItem(key);
            this.length = LS.length;
        },
        removeByPrefix: function(prefix) {
            window.LS.each(function(key, value) {
                if (key.indexOf(prefix) === 0) {
                    window.LS.remove(key)
                }
            });
        },
        clear: function() {
            LS.clear();
            this.length = 0;
        },
        //本地存储数据遍历，callback接受两个参数 key 和 value，如果返回false则终止遍历
        each: function(callback) {
            var list = this.obj(),
                fn = callback || function() {},
                key;
            for (key in list)
                if (fn.call(this, key, this.get(key)) === false)
                    break;
        },
        //返回一个对象描述的localStorage副本
        obj: function() {
            var list = {},
                i = 0,
                n, key;
            if (LS.isVirtualObject) {
                list = LS.key(-1);
            } else {
                n = LS.length;
                for (; i < n; i++) {
                    key = LS.key(i);
                    list[key] = this.get(key);
                }
            }
            return list;
        },
        length: LS.length
    };
    //如果有jQuery，则同样扩展到jQuery
    if (window.jQuery) window.jQuery.LS = window.LS;
})(window);
//缓存获取器
var _version_name = "o2o_version";
if (_isLib) {
    _version_name = "lib_version";
} else if (_isBus) {
    _version_name = "bus_version";
} else if (_isWWW) {
    _version_name = "www_version";
} else if (_isPay) {
    _version_name = "pay_version";
}
(function() {
    // var _isDev = false;
    var verion_name = "appConfig.version." + _version_name;
    window._getCache = function(text_url) {
        var _version = LS.get(verion_name);
        var configVersion = window.appConfig && appConfig.version;
        if (!_version) { //如果没有版本号信息，说明以前没有加载过appConfig配置文件，清空缓存
            // console.log("%c找不到版本号，清空缓存", "color:red");
            if (configVersion) {
                // confirm(["初始化了版本号并清空缓存", configVersion[_version_name]]);
                // console.log("%c设定了新的版本号信息", "color:red");
                LS.set(verion_name, configVersion[_version_name]);
            }
            LS.removeByPrefix("r_text!");
        } else if (configVersion && configVersion[_version_name] != _version) { //如果配置文件对象已经加载，并发现版本号与当前版本不匹配。清空缓存
            // console.log("%c当前版本号与最新版本号不相符合，清空缓存", "color:red");
            // confirm(["发现新版本，缓存清空", configVersion[_version_name], _version]);
            LS.removeByPrefix("r_text!");
            //然后将版本号设置为最新的
            // console.log("%c设定了新的版本号信息", "color:red");
            LS.set(verion_name, configVersion[_version_name]);
        } else if (configVersion && configVersion[_version_name] == _version) {
            // console.log("%c版本信息相符合，尝试使用缓存", "color:red");
        }
        //其它情况：配置文件未加载完成，默认直接使用缓存；开发模式不使用缓存
        //在非lib域加载完成对应的appConfig文件后，程序需要自己检测版本信息与缓存的是否一致，不一致的情况，需要情况缓存，并保存新的版本信息。
        var _cache = _isDev ? "" : LS.get(text_url);
        if (!_cache && configVersion && configVersion[_version_name] == _version) {
            // console.log("%c找不到缓存文件，但版本号一直，直接下载新的数据并进行缓存：" + text_url, "color:red");
        }
        return _cache;
    };
}());

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

/*
 * requireJS配置
 */
(function() {
    var dispatchEvent = window.dispatchEvent;
    /*
     * 基础配置
     */
    window.server_url = _isDev ? _protocol + "//" + location.hostname + ":3000/" : _protocol + "//api.dotnar.com/";
    window.lib_url = _isDev ? (_isNewDev ? (_protocol + "//lib.dev-dotnar.com/") : (_protocol + "//" + location.hostname + ":2221/")) : _protocol + "//lib.dotnar.com/";
    var requireConfig = window.requireConfig = {
        // baseUrl: "./",
        waitSeconds: 0,
        paths: {
            //微信js-API
            "wx_core": "http://res.wx.qq.com/open/js/jweixin-1.0.0",
            "wxLogin": "http://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin",
            //应用程序核心
            "jSouper_base": _isDebug ? _protocol + "//localhost:9000/build/jSouper" : lib_url + "js/lib/jSouper.min",
            "jSouper": lib_url + "js/lib/jsouper.handler",
            "tools": lib_url + "js/lib/tools",
            "appConfig": window.server_url + "config/config.json?_=" + (+new Date),
            "appConfigPub": window.server_url + "config/config.public.json?_=" + (+new Date),
            "appConfigBase": window.server_url + "config/config.base.json?_=" + (+new Date),
            "appConfigAdmin": window.server_url + "config/config.admin.json?_=" + (+new Date),
            "appConfigBus": window.server_url + "config/config.bus.json?_=" + (+new Date),
            //交互层核心
            "jQuery": lib_url + "js/lib/jquery-1.11.1.min",
            "jQuery.widget": lib_url + "js/lib/jquery.widget.min",
            "jQuery.easing": lib_url + "js/lib/jquery.easing.1.3.min",
            "jQuery.mousewheel": lib_url + "js/lib/jquery.mousewheel",
            "jQuery.colorPicker": lib_url + "js/lib/colorpicker/js/colorpicker",
            "tinycolorpicker": lib_url + "js/lib/tinycolorpicker/tinycolorpicker",
            "jQuery.tinycolorpicker": lib_url + "js/lib/tinycolorpicker/jquery.tinycolorpicker",

            //弹出框插件
            "jQuery.notify": lib_url + "js/lib/jquery.notify",

            //二维码应用插件
            "jQuery.qrcode": lib_url + "js/lib/jquery.qrcode-0.11.0",
            // 手势插件
            "touch": lib_url + "js/lib/touch.min",
            "touchy": lib_url + "js/lib/jquery.touchy.min",
            "jester": lib_url + "js/lib/jester.min",

            // 编辑器插件
            "ckeditor": lib_url + "js/lib/ckeditor/ckeditor.js",
            //hash路由组件
            "routie": lib_url + "js/lib/routie.min",
            //Cookies操作库
            "Cookies": lib_url + "js/lib/cookies.min",

            "shim_json": lib_url + "js/lib/json3",
            "shim_html5": lib_url + "js/lib/html5",
            "flashcanvas": lib_url + "js/lib/FlashCanvasPro/flashcanvas",
            "localResizeIMG": lib_url + "js/lib/localResizeIMG/LocalResizeIMG",
            //LocalResizeIMG3
            "lrz": lib_url + (_isMobile ? "js/lib/lrz.mobile.min" : "js/lib/lrz.pc.min"),
            "ueditor.config": lib_url + "js/lib/ueditor/ueditor.config",
            "ueditor.core": lib_url + "js/lib/ueditor/ueditor.all.min", //.min
            "ueditor.lang.zh-cn": lib_url + "js/lib/ueditor/lang/zh-cn/zh-cn",
            "ueditor.coAjax_upload": lib_url + "js/lib/ueditor.coAjax_upload",
            "ZeroClipboard": lib_url + "js/lib/ueditor/third-party/zeroclipboard/ZeroClipboard",
            "messenger": lib_url + "js/lib/messenger",
            "cropper": lib_url + (_isDebug ? "js/lib/cropper/cropper" : "js/lib/cropper/cropper.min"),
            "videoJsBase": lib_url + "js/lib/video-js/video",
            "echarts": lib_url + "js/lib/echarts",
            "swipe": lib_url + "/js/lib/swipe.min",
            "html2canvas": lib_url + "/js/lib/html2canvas.min",
            "smartcrop": lib_url + "/js/lib/smartcrop",
            "bus_permission": lib_url + "/js/bus_permission",

            /*
             * RequireJs 插件，这里命名决定使用前缀，如"css" => "css!"
             */
            //requireJs CSS插件
            "l_css": lib_url + "js/lib/require.css",
            "r_css": lib_url + "js/lib/require.css2",
            //requireJs Text插件
            "l_text": lib_url + "js/lib/require.text",
            "r_text": _isLS ? lib_url + "js/lib/require.text3" : lib_url + "js/lib/require.text",
            //requireJs 国际化插件
            "r_i18n": lib_url + "js/lib/require.i18n",

            /*
             * 通用组件包
             * 包括jSouper、jQuery、require.css"
             */
            "common": lib_url + "js/require.common",
            /*
             * 时间插件
             */
            "moment": lib_url + "js/lib/moment.min",
            "moment-locale-zh-cn": lib_url + "js/lib/moment.locale.zh-cn",
            /*
             * Socket 客户端
             */
            "SockJS": lib_url + "js/lib/sock",
            "hint-css": lib_url + "css/hint"
        },
        shim: {
            "jSouper": {
                deps: ["jSouper_base"]
            },
            "jQuery.widget": {
                deps: ["jQuery", "jQuery.easing", "jQuery.mousewheel"]
            },
            "jQuery.easing": {
                deps: ["jQuery"]
            },
            "jQuery.mousewheel": {
                deps: ["jQuery"]
            },
            "jQuery.notify": {
                deps: ["jQuery"]
            },
            "jQuery.qrcode": {
                deps: ["jQuery"]
            },
            "jQuery.colorPicker": {
                deps: ["jQuery", "l_css!" + lib_url + "js/lib/colorpicker/css/colorpicker"]
            },
            "jQuery.tinycolorpicker": {
                deps: ["jQuery"]
            },
            "localResizeIMG": {
                deps: _isMobile ? ["jQuery", lib_url + "js/lib/localResizeIMG/patch/mobileBUGFix.mini.js"] : ["jQuery"]
            },
            "metro": {
                deps: ["jQuery", "jQuery.widget", "metro-core"]
            },
            "moment-locale-zh-cn": {
                deps: ["moment"]
            },
            "ueditor.lang.zh-cn": {
                deps: ["ueditor.core"]
            },
            "ueditor.coAjax_upload": {
                deps: ["ueditor.core"]
            },
            "ueditor.core": {
                deps: ["ueditor.config", "ZeroClipboard"]
            },
            "cropper": {
                deps: ["jQuery", "r_css!" + lib_url + "js/lib/cropper/cropper.min.css"]
            },
            // "echarts": {
            //     deps: [lib_url + "js/lib/echarts/echarts.js"]
            // }
        }
    };
    define("ueditor", ["ZeroClipboard", "ueditor.core", "ueditor.lang.zh-cn", "ueditor.coAjax_upload"], function(ZeroClipboard) {
        window.ZeroClipboard = ZeroClipboard;
        return UE
    });
    define("copy", ["ZeroClipboard"], function(ZeroClipboard) {
        ZeroClipboard.config({
            swfPath: lib_url + "js/lib/ueditor/third-party/zeroclipboard/ZeroClipboard.swf"
        });
        return ZeroClipboard;
    });
    define("videojs", ["videoJsBase", "r_css!" + lib_url + "js/lib/video-js/video-js.min.css"], function(videojs) {
        videojs.options.flash.swf = lib_url + "js/lib/video-js/video-js.swf";
        return videojs;
    });
    define("smartcrop-toimg", ["jQuery", "smartcrop"], function($, SmartCrop) {
        function crop_image_with_url(img_url, options, cb) {
            var imgNode = $("<img>")[0];
            var canvas = $("<canvas>")[0];
            imgNode.src = img_url;
            imgNode.onload = function() {
                // console.log("smartcrop options:", options)
                SmartCrop.crop(imgNode, options, function(result) {

                    var crop = result.topCrop;
                    if (!canvas) {
                        canvas = $('<canvas>')[0];
                    }
                    var ctx = canvas.getContext('2d');
                    canvas.width = options.width;
                    canvas.height = options.height;
                    ctx.drawImage(imgNode, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

                    cb instanceof Function && cb(canvas.toDataURL(), canvas, result);
                });
            }
        }
        return crop_image_with_url;
    });

    if (!dispatchEvent) {
        /*
         * 非现代浏览器的话则加入html5 history垫片
         */
        // requireConfig.shim.routie = {deps:[lib_url+"js/lib/history.min.js"]};
        /*
         * 不支持JSON的浏览器加入JSON3包的支持
         */
        requireConfig.shim.SockJS = {
            deps: ["shim_json"]
        };
    }

    /*
     * 完成配置
     */
    define("require.config", requireConfig)

}());
/*
 * jSouper模板模块的定义与解析
 */
;
(function() {

    /*
     * jSouper的模板文件 ==> UI组件
     * 使用html后缀确保编辑器能自动高亮
     */
    var paths = requireConfig.paths;
    var shim = requireConfig.shim;
    paths["UI.Model.script2"] = lib_url + "template/js/xmp.model";
    paths["UI.Model.script3"] = lib_url + "template/js/xmp.customTag";
    paths["UI.Materail.script"] = _isDebug ? _protocol + "//localhost:9009/build/xmp.material_ui" : (lib_url + "template/Material-UI/xmp.material_ui.min");

    shim["UI.Model.script2"] = shim["UI.Model.script3"] = shim["UI.Materail.script"] = {
        deps: ["jSouper"]
    };
    var jSouperTemplates = {
        "UI.Form": [
            "r_text!" + lib_url + "template/form.html",
            "r_text!" + lib_url + "template/form-input.html",
            "r_css!" + lib_url + "css/jSouper-icons.css",
            "r_css!" + lib_url + "css/metro-calendar.css"
        ],
        "UI.Input": [
            "r_css!" + lib_url + "template/css/xmp.default.css",
            "r_css!" + lib_url + "template/css/form.css"
        ],
        "UI.Model": [
            "UI.Model.script2",
            "UI.Model.script3",
            // "r_text!" + lib_url + "template/style.package/style.package.html",
            "r_text!" + lib_url + "template/xmp.customTag.html",
            "r_text!" + lib_url + "template/xmp.model.html",
            "r_css!" + lib_url + "css/icon.css",
            "r_css!" + lib_url + "template/css/xmp.customTag.css"
        ],
        "UI.Materail": [
            "UI.Materail.script",
            "r_text!" + (_isDebug ? _protocol + "//localhost:9009/build/xmp.material_ui.html" : lib_url + "template/Material-UI/xmp.material_ui.html"),
            "r_css!" + (_isDebug ? _protocol + "//localhost:9009/build/material_ui.css" : lib_url + "template/Material-UI/material_ui.min.css")
        ]
    };
    var tpl_shims;
    for (var templateName in jSouperTemplates) {
        //生成requireJS的依赖关系数组
        tpl_shims = jSouperTemplates[templateName].slice();
        tpl_shims.unshift("jSouper");;
        (function(tpl_shims) {
            //定义require的UI模块
            define(templateName, tpl_shims, function(jSouper) {
                var args = Array.prototype.slice.call(arguments);
                args.shift();
                //解析所有模板文件
                for (var i = 0, len = args.length; i < len; i += 1) {
                    if (tpl_shims[i + 1].indexOf("r_css!") !== 0 && args[i]) {
                        jSouper.parse(args[i]);
                    }
                };
                //手动触发更新页面
                jSouper.App && jSouper.App.model.touchOff(".");
            });
        }(tpl_shims));
    }
}());
/*
 * 百度地图封装
 */
;
(function() {
    var ak_key = "Noga0lSLMrk62roymqXkgaUB";
    var doc_write = document.write;
    var doc_s_write = function(HTML) {
        var dom = $("<div>" + HTML + "</div>");
        console.log(HTML);
        dom.find("script[src]").each(function(i, scriptNode) {
            scriptNode.src && require([scriptNode.src]);
            scriptNode.removeAttribute("src")
        });
        dom.appendTo(document.body);
    }
    document.write = doc_s_write;
    define("baiduMap", [_protocol + "//api.map.baidu.com/api?v=2.0&ak=" + ak_key], function() {
        document.write = doc_write;
        var fun_queue = [];
        var _is_ready = false;

        function init_map(cb) {
            if (_is_ready) {
                fun_queue.push(cb);
                for (var i = 0, len = fun_queue.length, fun; i < len; i += 1) {
                    fun = fun_queue[i];
                    if (typeof fun === "function") {
                        fun();
                    }
                }
                init_map = function(cb) {
                    if (typeof cb === "function") {
                        cb();
                    }
                    cb();
                }
            } else {
                fun_queue.push(cb);
            }
        };
        var _BMap_ti = setInterval(function() {
            if (window.BMap) {
                clearInterval(_BMap_ti);
                _is_ready = true;
                init_map();
            }
        })
        return init_map;
    });
}());

require.config(requireConfig);

//
/**
 *     __  ___
 *    /  |/  /___   _____ _____ ___   ____   ____ _ ___   _____
 *   / /|_/ // _ \ / ___// ___// _ \ / __ \ / __ `// _ \ / ___/
 *  / /  / //  __/(__  )(__  )/  __// / / // /_/ //  __// /
 * /_/  /_/ \___//____//____/ \___//_/ /_/ \__, / \___//_/
 *                                        /____/
 *
 * @description MessengerJS, a common cross-document communicate solution.
 * @author biqing kwok
 * @version 2.0
 * @license release under MIT license
 */

window.Messenger = (function() {

    // !注意 消息前缀应使用字符串类型
    var supportPostMessage = 'postMessage' in window;

    // Target 类, 消息对象
    function Target(target, name, projectName) {
        var errMsg = '';
        if (arguments.length < 2) {
            errMsg = 'target error - target and name are b`oth requied';
        } else if (typeof target != 'object') {
            errMsg = 'target error - target itself must be window object';
        } else if (typeof name != 'string') {
            errMsg = 'target error - target name must be string type';
        }
        if (errMsg) {
            throw new Error(errMsg);
        }
        this.target = target;
        this.name = name;
        this.projectName = projectName;
    }

    // 往 target 发送消息, 出于安全考虑, 发送消息会带上前缀
    if (supportPostMessage) {
        // IE8+ 以及现代浏览器支持
        Target.prototype.send = function(msg) {
            this.target.postMessage(this.projectName + msg, '*');
        };
    } else {
        // 兼容IE 6/7
        Target.prototype.send = function(msg) {
            var targetFunc = window.navigator[this.projectName + this.name];
            if (typeof targetFunc == 'function') {
                targetFunc(this.projectName + msg, window);
            } else {
                throw new Error("target callback function is not defined");
            }
        };
    }

    // 信使类
    // 创建Messenger实例时指定, 必须指定Messenger的名字, (可选)指定项目名, 以避免Mashup类应用中的冲突
    // !注意: 父子页面中projectName必须保持一致, 否则无法匹配
    var InstancesMap = Messenger.instances = {};

    function Messenger(messengerName, projectName) {
        projectName = String(projectName);
        var instance = InstancesMap[projectName]
        if (instance instanceof Messenger) {
            return instance
        }
        this.targets = {};
        this.name = messengerName;
        this.listenFunc = [];
        this.projectName = projectName;
        this.initListen();

        InstancesMap[projectName] = this;
    }

    // 添加一个消息对象
    Messenger.prototype.addTarget = function(target, name) {
        var targetObj = new Target(target, name, this.projectName);
        this.targets[name] = targetObj;
    };

    // 初始化消息监听
    Messenger.prototype.initListen = function() {
        var self = this;
        var projectName = self.projectName;
        var generalCallback = function(msg) {
            if (typeof msg == 'object' && msg.data) {
                msg = msg.data;
            }
            if (typeof msg !== "string") {
                return;
            }
            if (msg.slice(0, projectName.length) !== projectName) {
                return;
            }
            // 剥离消息前缀
            msg = msg.slice(projectName.length);
            for (var i = 0; i < self.listenFunc.length; i++) {
                self.listenFunc[i](msg);
            }
        };

        if (supportPostMessage) {
            if ('addEventListener' in document) {
                window.addEventListener('message', generalCallback, false);
            } else if ('attachEvent' in document) {
                window.attachEvent('onmessage', generalCallback);
            }
        } else {
            // 兼容IE 6/7
            window.navigator[projectName + this.name] = generalCallback;
        }
    };

    // 监听消息
    Messenger.prototype.listen = function(callback) {
        this.listenFunc.push(callback);
    };
    // 注销监听
    Messenger.prototype.clear = function() {
        this.listenFunc = [];
    };
    // 广播消息
    Messenger.prototype.send = function(msg) {
        var targets = this.targets,
            target;
        for (target in targets) {
            if (targets.hasOwnProperty(target)) {
                targets[target].send(msg);
            }
        }
    };

    return Messenger;
})();
/*
 * 跨域缓存共享核心
 */
//全局运行代码
function globalEval(code) {
    if (code && /\S/.test(code)) {
        if (window.execScript) {
            window.execScript(code)
        } else {
            var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = code;
            head.removeChild(head.appendChild(script));
        }
    }
};
(function() {

    /*自定义缓存机制*/
    ; //无本地缓存API的浏览器不搞
    if (!_isLS) {
        return;
    };
    var _load = requirejs.load;
    requirejs.load = function(context, moduleName, url) {
        var args = arguments;
        if (moduleName === "r_text") {
            return _load.apply(this, args);
        }
        var text_url = "r_text!" + url;
        var _cache = _getCache(text_url);
        if (!_cache) {
            console.log(["%c", (__isLib(url) ? "可跨域" : "当前域"), "getScript:", moduleName, url].join(" "), _isLib_color);
            require(["r_text"], function(r_text) {
                //如果是同域，使用AJAX取文本数据
                if (r_text.useXhr(url)) {
                    require([text_url], function(text_script) {
                        globalEval(text_script)
                        context.completeLoad(moduleName);
                    });
                } else {
                    //跨域的JS文件使用直接加载
                    _load.apply(this, args);
                }
            })
        } else {
            try {
                Function(_cache)();
            } catch (e) {
                console.error(e);
            }
            context.completeLoad(moduleName);
        }
    };
    /*跨域共享数据缓存*/
    var _msg_prefix = "GET CACHE BY URL:";
    var _css_info_prefix = "GET CSS FILE LIST:";
    var _LS_GET_prefix = "GET LS DATA:";
    var _LS_SET_prefix = "SET LS DATA:";
    var _LS_REM_prefix = "REM LS DATA:";
    if (_isLib) {
        var messenger = new Messenger('parent', 'O2O_lib');
        messenger.addTarget(window.parent, "parent");
        messenger.listen(function(msg) {
            if (msg.indexOf(_msg_prefix) === 0) {
                var text_url = msg.substr(_msg_prefix.length);
                console.log("收到指令下载缓存：", text_url);
                require([text_url], function() {
                    messenger.send(text_url + _msg_prefix + LS.get(text_url));
                });
            } else if (msg.indexOf(_css_info_prefix) === 0) {
                var css_files = [];
                LS.each(function(name) {
                    if (name.slice(-4) === ".css") {
                        css_files.push(name);
                    }
                });
                messenger.send("csslist:" + _css_info_prefix + JSON.stringify(css_files));
            } else if (msg.indexOf(_LS_GET_prefix) === 0) {
                var key = msg.substr(_LS_GET_prefix.length);
                var value = LS.get(key);
                messenger.send(_LS_GET_prefix + JSON.stringify({
                    key: key,
                    value: value
                }));
            } else if (msg.indexOf(_LS_SET_prefix) === 0) {
                try {
                    var info = JSON.parse(msg.substr(_LS_SET_prefix.length));
                    LS.set(info.key, info.value);
                    var success = true;
                } catch (e) {}
                messenger.send(_LS_SET_prefix + JSON.stringify({
                    msg: success ? "success" : "error",
                    key: info.key
                }));
            }
        });
        /*
         * 加载配置文件，获取版本号信息
         */
        require(["appConfigBase"], function() {
            // console.log("%c基础配置文件加载完毕:" + appConfigBase.version, "color:red");
            // console.log("%c当前版本号为:" + LS.get("appConfig.version"), "color:red");
            window.appConfig = appConfigBase;
            var _version = LS.get("appConfig.version.lib_version");
            LS.set("appConfig.version.lib_version", appConfigBase.version.lib_version || +new Date);
            // confirm(["当前版本号：", _version, appConfigBase.version.lib_version]);
            if (_version && (_version != appConfig.version.lib_version) && !_isDev) {
                //版本号不同，清除所有缓存
                LS.removeByPrefix("r_text!");
                //并重载页面
                // confirm("发现lib新版本，马上使用！");
                window.parent && window.parent.location.reload();
            };
            //清除缓存配置文件信息，这是没用的
            LS.removeByPrefix("r_text!" + require.toUrl("appConfigBase").split("?")[0]);
        });
    } else {
        //缓存请求，在iframe载入后统一处理请求
        var _before_onload_stack = [];
        var cb_map = {};
        var _LS_cb_map = {};
        var _LS_set_cb_map = {};

        function _cross_msg() {
            window._getRemoteCache_load = function(text_url, succ_cb, err_cb) {
                cb_map[text_url] = {
                    succ_cb: succ_cb,
                    err_cb: err_cb
                };
                messenger.targets["cross_iframe"].send(_msg_prefix + text_url);
            };
            var _globalGet_load = function(key, cb) {
                _LS_cb_map[key] = cb;
                messenger.targets["cross_iframe"].send(_LS_GET_prefix + key);
            };
            var _globalSet_load = function(key, value, succ_cb, err_cb) {
                _LS_set_cb_map[key] = {
                    succ_cb: succ_cb,
                    err_cb: err_cb
                };
                messenger.targets["cross_iframe"].send(_LS_SET_prefix + JSON.stringify({
                    key: key,
                    value: value
                }));
            };
            var cross_iframe = document.createElement("iframe");
            cross_iframe.id = "cross_iframe"
            cross_iframe.src = lib_url + "/data.html";
            cross_iframe.style.cssText = "position:absolute;width:0;height:0;display:none;visibility:hidden;top:0;left:0;";
            document.body.appendChild(cross_iframe);
            messenger = new Messenger('cross_iframe', 'O2O_lib');
            console.log("cross_iframe.contentWindow:", cross_iframe.contentWindow);
            cross_iframe.onload = function() {
                // console.log("%c cross_iframe contentWindow LOAD！", "color:blue;");
                //将缓存的参数进行传输
                for (var i = 0, len = _before_onload_stack.length; i < len; i += 1) {
                    var require_info = _before_onload_stack[i];
                    console.log(require_info);
                    messenger.targets["cross_iframe"].send(require_info.type + require_info.value);
                }
                //使用正常的通讯方式进行通信
                window._getRemoteCache = _getRemoteCache_load;
                window.globalGet = _globalGet_load;
                window.globalSet = _globalSet_load;
            };
            messenger.addTarget(cross_iframe.contentWindow, "cross_iframe");
            messenger.listen(function(msg) {
                if (msg.indexOf(_msg_prefix) !== -1) {
                    var res = msg.split(_msg_prefix);
                    var text_url = res[0];
                    var cache_data = res[1];
                    console.log("跨域请求数据缓存完成：", text_url);
                    if (cache_data) {
                        var succ_cb = cb_map[text_url].succ_cb;
                        succ_cb && succ_cb(cache_data);
                    } else {
                        var err_cb = cb_map[text_url].err_cb;
                        err_cb && err_cb(cache_data);
                    }
                } else if (msg.indexOf(_LS_GET_prefix) === 0) {
                    var cache_data = JSON.parse(msg.substr(_LS_GET_prefix.length));
                    var cb = _LS_cb_map[cache_data.key];
                    cb && cb(cache_data.value)
                } else if (msg.indexOf(_LS_SET_prefix) === 0) {
                    var cache_data = JSON.parse(msg.substr(_LS_SET_prefix.length));
                    if (cache_data.msg === "success") {
                        var succ_cb = _LS_set_cb_map[cache_data.key].succ_cb;
                        succ_cb && succ_cb(cache_data);
                    } else {
                        var err_cb = _LS_set_cb_map[cache_data.key].err_cb;
                        err_cb && err_cb(cache_data);
                    }
                }
            });
        };
        if (document.body) {
            _cross_msg();
        } else {
            var _ti = setInterval(function() {
                if (document.body) {
                    _cross_msg();
                    clearInterval(_ti);
                }
            }, 10);
        }
        //frame还没载入前，通知系统是无效的，frame无法收到信息
        window._getRemoteCache_unload = function(text_url, succ_cb, err_cb) {
            //缓存相应参数
            cb_map[text_url] = {
                succ_cb: succ_cb,
                err_cb: err_cb
            };
            _before_onload_stack.push({
                type: _msg_prefix,
                value: text_url
            });
        };
        var _globalGet_unload = function(key, cb) {
            _LS_cb_map[key] = cb;
            _before_onload_stack.push({
                type: _LS_GET_prefix,
                value: key
            });
        };
        var _globalSet_unload = function(key, value, succ_cb, err_cb) {
            _LS_set_cb_map[key] = {
                succ_cb: succ_cb,
                err_cb: err_cb
            };
            _before_onload_stack.push({
                type: _LS_SET_prefix,
                value: JSON.stringify({
                    key: key,
                    value: value
                })
            });
        };
        window._getRemoteCache = _getRemoteCache_unload;
        //跨域请求缓存key-value
        window.globalGet = _globalGet_unload;
        window.globalSet = _globalSet_unload;
    }
}());
