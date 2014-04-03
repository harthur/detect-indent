/*
*fixedtable
*	包装集指定包含table的div，
*	可固定表头不动上下滚动查看(需要有thead标签)，
*	或固定指定个数的列，可左右滚动查看
* 	eg.  $('div').fixedTable('head');
*		 $('div').fixedtTable('left', num);//num为左侧需要固定的列数
*/

(function($){
	$.fn.fixedTable = function(where, num) {
		if(!where){
			return;
		}
		var mask = this.clone();
		var table = this.find("table").first();
		if(where == 'left')
		{
			this.css("overflow-x","scroll");
			var width = 0;
			for(var i=0; i<num; i++)
			{
				width += table.children().first().children().first().children().eq(i).outerWidth();
			}
			width += 2;
			mask.css({
                "overflow-x":"hidden",
                "position":"absolute",
                "width": width + "px",
                "z-index":"1",
                "background-color":"white"
            });
		}
		else if(where == 'head')
		{
			this.css("overflow-y","scroll");
			var height = table.children().first().outerHeight() + 2;
			mask.css({
                "width": this.css('width'),
                "overflow-y":"hidden",
                "position":"absolute",
                "height": height + "px",
                "z-index":"1",
                "background-color":"white"
            });
		}
		else
		{
			return;
		}
		this.append(mask);
        mask.css({top:0,left:0});
	};
})(jQuery);
