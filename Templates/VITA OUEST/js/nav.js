const $dropDownP = $("li.drop-down-p a");
const $dropDownList = $("ul.drop-down-list").hide();

const $dropDownBolts = $("li.drop-down-p > a img");
const $2chainz = $("div.chain");

$("li.drop-down-p").hover(function(){
  $dropDownList.slideDown();
  $dropDownBolts.addClass("rotate-bolt");
},function(){
  $dropDownList.slideUp();
  $dropDownBolts.removeClass("rotate-bolt");
});
