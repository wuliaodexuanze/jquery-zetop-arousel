// 借助于zetop.js实现，图片预加载
(function($) {
    function _screen_all_load() { // 所有方法执行完之后执行的方法
        $("#preloadLoading").hide();
    }
    function _screen_each_load(count, len) { // 每个方法执行完之后执行的方法
        $("#preloadNum").text(((count+1)/len).toFixed(1)*100 + '%');
    };
    Preload.DETAULT = {
        each: _screen_each_load, // 每一张图片加载完后执行此方法
        all: _screen_all_load, // 所有图片加载完后执行此方法
        flag: true
    };
    Preload.prototype._screen_load = function() { // 页面追加等待框
        var ele = '<div id="preloadLoading" style="position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;background-color:#f2f2f2;">';
        ele += '<span id="preloadNum" style="display:block;font-size:40px;color#333;text-align:center;margin-top:300px;">0%</span>';
        ele += '</div>';

        $('body').append(ele);
    };
    Preload.prototype._unoredered = function() { // 无序加载
        var imgs = this.imgs;
        var opts = this.opts;
        var count = 0;
        var len = imgs.length;

        $.each(imgs, function(i, src) {
            if(typeof src != 'string') return;

            var imgObj = new Image();
            $(imgObj).on('load error', function() {
                opts.each && opts.each(count, len);

                if(count >= len -1) {
                    opts.all && opts.all();
                }
                count++;
            });
            imgObj.src = src;
        });
    }
    function Preload(imgs, options) {
        this.imgs = (typeof imgs === 'string') ? [imgs] : imgs;
        this.opts = $.extend({}, Preload.DETAULT, options); // 合并默认参数和传入参数，返回新的参数
        if(this.opts.flag) {
            this._screen_load();
        }
        this._unoredered();
    };
    try{
        if($.prototype.jquery) {
            $.extend({
                preload: function(imgs, opts) {
                    new Preload(imgs, opts);
                }
            });
        }else {
            throw "There is no current method";
        }
    }catch(e) {
        $.preload = function(imgs, opts) {
            new Preload(imgs, opts);
        }
    }
})($)
