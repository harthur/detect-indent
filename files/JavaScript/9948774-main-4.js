/* Character Count for Posts */                
function checkPostForURL(post){
    var matches = [],
        urlexp = new RegExp("(^|[ \t\r\n])((http|https):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g"),
        $linkShort = $('#linkstoshort'),
        matchIdx = 0;

    if ( post !== undefined ){
        if ( urlexp.test(post) ){
               var offset = 0;
               $('.shortenlinks').show();
               matches = post.match(urlexp);

               $linkShort.html('');

                for(; matchIdx < matches.length; matchIdx++) {
                    var match = matches[matchIdx],
                        matchOffset = match.length - 23;

                    offset += matchOffset;

                    $linkShort.append('<li>'+match+'</li>');
                }

                return offset;
        }
    }
 }

$(function(){
    var $postMsg = $('#post-msg'),
        message = $postMsg.text(),
        twstartchars = 140 - message.length,
        fbstartchars = 420 - message.length,
        $fbCount = $("#fb-char"),
        $twCount = $("#tw-char"),
        setRemainingChars = function (evt) {
            var a = $postMsg.val().length,
                post = $postMsg.val();        

            var offset = checkPostForURL(post);
            if ( offset ){
                a = a - offset;
            }

            $fbCount.text((420-a));
            $twCount.text((140-a));
            if ( a > 120 ){
                    $fbCount.css('color','red');
                    if ( a > 380 ){
                            $fbCount.css('color','red');
                    }
            }else{
                    $fbCount.css('color','#333');
                    $twCount.css('color','#333');
            }
        };

    $fbCount.text(fbstartchars);
    $twCount.text(twstartchars);

    $postMsg.on('keypress change', setRemainingChars);
});