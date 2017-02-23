$(function(){
    $(document).scroll(function (event) {
        if($(document).scrollTop()>=234){
            $('#backToTop').fadeIn(400)
        }else{
            $('#backToTop').fadeOut(400)
        }
    })
    $('#backToTop').on('click',function(){
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    });
});
