;(function($) {
    $.ecdloy = function(el, opts){

        var base = this;

        base.$el = $(el);
        base.timer = null;
        base.curIdx = 0;
        base.endNum = -1;
        base.prevIdx = -1;
        base.$prevItem = null;
        base.$curItem = null;
        base.code = 0;
        base.interLoop = 0;
        base.isSpinning = false;

        base.$el.data("ecdloy", base);

        base.init = function () {

            base.opts = $.extend(new Object(),$.ecdloy.defaults, opts);
            base.interval = base.opts.interval;

            base.$items = base.$el.find(base.opts.cssItem);

            base.$items.each(function(i,o){
                if (!o.getAttribute('data-loysn')) {
                    o.setAttribute('data-loysn',i);
                };
            });
            $(base.opts.spinner).bind('click',function(e){
                if (!base.isSpinning) {
                    base.playLoy();
                }
            });

            base.total = base.$items.length;
            base.interLoop = base.opts.interLoop*base.total;
        }

        base.showItem = function(idx){
            idx = idx<0?1:idx;
            idx = idx>(base.total)?1:idx;

            this.prevIdx = base.curIdx;
            this.curIdx = idx;

            (base.$curItem && base.$curItem.removeClass(base.opts.clItemActive));

            base.$prevItem = base.$curItem;

            var cssSelector = '[data-loysn="%"]'.replace('%',idx+'');

            base.$curItem = base.$items.filter(cssSelector).addClass(base.opts.clItemActive);

        }

        base.stop = function(){
            clearInterval(base.timer);
            if ( $.isFunction(base.opts.onWin) ) {
                base.opts.onWin(this.code);
            }
            base.isSpinning = false;
            base.reset();
        }

        base.playLoy = function(){
            base.isSpinning = true;
            if( $.isFunction(base.opts.onStart) ){
                base.opts.onStart();
            }
            $.ajax({
                url: base.opts.sn+"&"+new Date().getTime(),
                timeout: 20000,
                dataType: "json",
                error: function(){
                    base.isSpinning = false;
                    if( $.isFunction(base.opts.error) ){
                        base.opts.error();
                    }
                },
                success: function(data){
                    var errno = data.errno;
                    var message = data.message;
                    base.code = data;
                    if (errno == 0) {//正常抽奖
                        base.run();
                        //设置抽中的奖品
                        setTimeout(function(){
                            base.endNum = data.success_code;
                        }, base.opts.interRlt);
                    } else {
                        base.isSpinning = false;
                        if( $.isFunction(base.opts.complete) ){
                            base.opts.complete(data);
                        }
                    }
                }
            });
            return false;
        }

        base.reset = function(){
            base.endNum = -1;
            base.code = 0;
            base.interval = base.opts.interval;
            base.interLoop = base.opts.interLoop*base.total;
        }

        base.run = function(){
            clearInterval(base.timer);
            base.timer = setTimeout(function(){
                base.showItem(base.curIdx+1);
                if(base.interLoop > 0){
                    base.interLoop--;
                    base.run();
                }else{
                    base.go();
                }
            },base.interval);
        }

        base.go = function(){
            clearInterval(base.timer);

            base.interval = base.interval<base.opts.intervalMin?base.opts.intervalMin:base.interval;
            base.interval = base.interval>base.opts.intervalMax?base.opts.intervalMax:base.interval;
            base.timer = setTimeout(function(){
                var a = (base.curIdx+1 > base.total) ? 1 : base.curIdx+1;
                base.showItem(a);
                base.interval+=base.opts.intervalStep;
                if(a == base.endNum){
                    base.stop();
                }else{
                    base.go();
                }
            },base.interval);

        }
        base.update = function(opts,reInit){
            base.opts = opts;
            if(reInit){
                base.init();
            }
        }

        // 初始化执行
        base.init();
    }

    $.ecdloy.defaults = {
        cssItem:'.loy_item',
        clItemActive:'loy_item_on',
        spinner: '',
        interRlt: 6000,
        interLoop: 3,
        onStart: $.noop,
        onWin : $.noop,      // 奖励提示回调函数. 包含后台抽奖接口返回的 data
        complete: $.noop,    // 抽奖未满足条件回调函数
        error: $.noop,    // 抽奖超时或报错回调函数
        sn: 0,    // 活动ID
        intervalMin:30,   // 最小的时间间隔
        intervalMax:1000,   // 最大的时间间隔
        interval:40,   // 滚动的时间间隔
        intervalStep:20  // 每次滚动后增加的时间步长。通过step控制越转越快或越转越慢
    };

    $.fn.ecdloy = function(options){
        if (this.length) {
            return this.each(function(){
                (new $.ecdloy(this, options));
            });
        }
    };

})(jQuery);