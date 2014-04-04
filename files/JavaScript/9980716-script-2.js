/*
伍峰杰 
2014-04-02 
*/
//参数有slid为选择器，width为图片宽度，height为高度，time为自动播放时间间隔，单位毫秒，默认3秒间隔
$(function(){
  jQuery.focus=function(slid,width,height,time){
    var num = $(slid).find("ul li").length;
    var index = 0;
    var picTimer;
    //设置宽度和高度
    $(slid+" ul").css("width",width*num);
    $(slid+" ul").css("height",height);
    $(slid+" ul li").css("height",height);
    $(slid+" ul li").css("width",width);
    $(slid).css("width",width);
    $(slid).css("height",height);
    $(slid+" .pre").css("height",height);
    $(slid+" .pre").css("line-height",height+"px");
    $(slid+" .next").css("height",height);
    $(slid+" .next").css("line-height",height+"px");
    $(slid+" .next").css("left",width-50);
    //增加底部页数按钮
    $(slid).append('<div class="btmBtn"></div>');
    for(var j=0;j<num;j++){
      $(slid+" .btmBtn").append("<span>·</span>");
    }
    //翻页方法
    function showPic(i){
      var left=-i*width;
      $(slid+" ul").stop(true,false).animate({"left":left},300);
      index=i;
      $(slid+" span").removeClass("on");
      $(slid+" span:eq("+i+")").addClass("on");
    }
    //上一页点击事件绑定
    $(slid+" .pre").bind("click",function(){
      if(index==0){
        showPic(num-1);
      }else
        showPic(index-1);
    });
    //下一页点击事件绑定
    $(slid+" .next").bind("click",function(){
      if(index==(num-1)){
        showPic(0);
      }else
        showPic(index+1);
    });
    //鼠标悬停事件绑定
    $(slid).bind("mouseover",function(){
      $(slid+" .pre").css("opacity",0.2);
      $(slid+" .next").css("opacity",0.2);
    });
    //鼠标悬停离开绑定
    $(slid).bind("mouseout",function(){
      $(slid+" .pre").css("opacity",0);
      $(slid+" .next").css("opacity",0);
    });
    //自动播放
    $(slid).hover(function() {
      clearInterval(picTimer);
      },function() {
      picTimer = setInterval(function() {
      index++;
      if(index == num) {index = 0;}
      showPic(index);
      },time || 3000); //此3000代表自动播放的间隔，单位：毫秒
      }).trigger("mouseleave"); 
    //底部按钮滑入
    $(slid+" span").bind("mouseenter",function(){
      var i=$(slid+" span").index(this);
      showPic(i);
    });
  };
  
});
$(document).ready(function(){
  $.focus("#img-slid",400,200);
  $.focus("#img-slid2",300,300,2000);
});
