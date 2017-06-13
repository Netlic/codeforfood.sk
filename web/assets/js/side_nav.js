var lastScroll = 0;
var lastDefinedItem;
var automatedScroll = false;
activateNavbarItems(scrollToId);

$('.nav-li').click(function(){
    if(typeof($(this).attr('data-directory')) === "undefined") {
        activateNavbarItems(parseInt($(this).attr('data-id')));
    }
});

function activateNavbarItems(itemId, scroll = true) {
    var navBar = $('.details-navbar-wrapper');
    navBar.find('.nav-li-active').removeClass('nav-li-active');
    
    var li = $('.details-navbar-wrapper').find('a').filter(function () {
        return parseInt($(this).attr('data-id')) === itemId;
    });
    li.addClass('nav-li-active');
    var nodeLi = li.parents('ul').prev();
    nodeLi.addClass('nav-li-active');
    var detailItem = $('.detail-item').filter(function(){
        return parseInt($(this).attr('data-id')) === itemId;
    });
    if (scroll) {
        automatedScroll = true;
        $('html, body').animate({
            scrollTop: detailItem.offset().top
        }, 500, function(){
            automatedScroll = false;
        });
    }
}

$(document).scroll(function(e){
    if(!automatedScroll) {
        var navBar = $('.details-navbar-wrapper');
        var scrolledToItem = navBar.find('a.nav-li-active').last().attr('data-id');
        var detailItem = $('.detail-item').filter(function(){
            return parseInt($(this).attr('data-id')) === parseInt(scrolledToItem);
        });
        if (parseInt(detailItem.length) === 1) {
            lastDefinedItem = detailItem;
        } else {
            detailItem = lastDefinedItem;
        }
        var itemSpan = parseInt(detailItem.offset().top) + parseInt(detailItem.height()) + 35;
        if ((parseInt($(this).scrollTop()) > parseInt(itemSpan)) && (lastScroll < parseInt($(this).scrollTop()))) {
            var detailNext = detailItem.next();
            var nextItem = detailNext.attr('class') === 'detail-item' ? detailNext : detailNext.next();
            activateNavbarItems(parseInt(nextItem.attr('data-id')), false);
        } else if((parseInt($(this).scrollTop()) < (parseInt(detailItem.offset().top)) && (lastScroll > parseInt($(this).scrollTop())))) {
            var detailPrev = detailItem.prev();
            var prevItem = detailPrev.attr('class') === 'detail-item' ? detailPrev : detailPrev.prev();
            if (detailPrev.index() > 0) {
                activateNavbarItems(parseInt(prevItem.attr('data-id')), false);
            }
        }
        lastScroll = $(this).scrollTop();
    }
});