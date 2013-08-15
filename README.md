## Javascript转盘游戏

引入代码: jquery.ecdloy.min.js

### HTML结构范例

其中 data-loysn 成功返回code

```
<ul id="loy_panel" class="list_loy_item clearfix">
    <li>
        <div data-loysn="1" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="2" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="3" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="8" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <a id="btn_loy" href="javascript:void(0);">抽奖</a>
    </li>
    <li>
        <div data-loysn="4" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="7" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="6" class="loy_item loy_item_on"></div>
    </li>
    <li>
        <div data-loysn="5" class="loy_item loy_item_on"></div>
    </li>
</ul>
```

### javascript使用

其中 sn 为抽奖接口地址

error: 网络错误，抽奖超时的返回
complete: 接口返回正常，但是反馈抽奖条件错误
onWin: 抽奖成功，并返回后台配置里的 领取成功返回code

```
$(document).ready(function(){
    //初始化抽奖插件
    $('#loy_panel').ecdloy({
        spinner: "#btn_loy", //开始抽奖按钮
        sn: "http://xxx.com/json.php?mod=lotteryge&act=integral&sn=",
        error: function(){
            //报错
        },
        complete: function(data){
            //条件不符合
        },
        onWin: function(data){
            //成功
        }
    });
});
```