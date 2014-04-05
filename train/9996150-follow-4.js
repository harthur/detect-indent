//Last folllowing: 950 @ 4/3/14 10:00PM to 5281
function subscribe(count,start){
    start = typeof start == 'undefined' ? 0 : start;
    var buffer = '';
    var followed = 0;
    $.each($('.js-stream-item'),function(i,item){
        if(i < start){
            buffer = buffer + 'Start not hit yet' + "\n";
        }else if(followed <= count){
            if($(item).find('.user-actions.not-following').size()){
                buffer = buffer + 'Followed' + "\n";
                followed++;
                $(item).find('.follow-button').click();
            }else{
                buffer = buffer + 'Already following' + "\n";
            }
        }else{
            buffer = buffer + 'Hit max' + "\n";
            return false;
        }
        return true;
    });
    return buffer + "\n" + 'Followed: ' + followed;
}
subscribe(930);


