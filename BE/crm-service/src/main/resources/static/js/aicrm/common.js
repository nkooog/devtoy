 $(document).ready(function(){
     $(".btn_menu_open").off("click").on("click", function () {
         if ($(this).parent().hasClass("on")) {
             $(this).removeClass('on');
             $(".sideL_wrap").removeClass('on');
             $(".nav_list > li > a").removeClass('on');
             $(".nav_list > li > div.sub_2depth > ul > li > a").removeClass('on');
             $(".nav_list > li .sub_3depth").hide();
             $(".nav_list > li > .sub_2depth").hide();
         } else {
             $(".sideL_wrap").addClass('on');
             $(this).addClass('on');
         }
     });

     $(".nav_list").on("click", function () {
         $(".sideL_wrap").addClass('on');
         // $(document).bind('click', function (e) {
         //     var $clicked = $(e.target);
         //     if (!$clicked.parents().hasClass("on"))
         //         $(".sideL_wrap").removeClass('on');
         //     if ($(".btn_menu_open").hasClass("on")) {
         //         $(this).removeClass('on');
         //     }
         // });
     });

     $(".sideL_wrap").mouseleave(function () {
         $(".btn_menu_open").removeClass('on');
         $(".sideL_wrap").removeClass('on');
         $(".nav_list > li > a").removeClass('on');
         $(".nav_list > li > div.sub_2depth > ul > li > a").removeClass('on');
         $(".nav_list > li .sub_3depth").hide();
         $(".nav_list > li > .sub_2depth").hide();
     });

     $(".f_nt_list button").on("click", function () {
         if ($(this).hasClass("on")) {
             $(this).attr('class', 'k-icon k-i-volume-up');
             $(this).next().removeClass('on');
         } else {
             $(this).attr('class', 'k-icon k-i-volume-off on');
             $(this).next().addClass('on');
         }
     });

     $(".btn_fav").on("click", function () {
         if ($(this).hasClass("on")) {
             $(this).removeClass('on');
         } else {
             $(this).addClass('on');
         }
     });

     $(".ct_contents a, .ct_contents button,.ct_contents select,.ct_contents input,.head_top a,.mdi_top a,.mdi_top button").focus("click", function () {
         setTimeout(function () {
             $(".sideL_wrap").removeClass('on');
         }, 500);
     });

     $(".page_list .page_list_bx div a").on("click", function () {
         $(".page_list .page_list_bx div").removeClass('on');
         $(this).parent().addClass('on');
     });

     $(".members_bx a").on("click", function () {
         $(".members_bx a").removeClass('on');
         $(this).addClass('on');
     });

     $(".page_list .page_list_bx div button").on("click", function () {
         $(this).parent().remove();
     });
});
