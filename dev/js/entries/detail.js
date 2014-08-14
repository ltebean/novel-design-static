var seaport = require('seaport-bridge');
var $ = require('zepto')
var fastclick = require('fastclick');
var common = require('../lib/common');

seaport.connect(function dataHandler(data) {

}, init);

function init(bridge) {
  bridge.param.get('data', drawScreen);

  function drawScreen(design) {
    var detail = $('.detail');
    var commentTemplate = $('.comment-template');
    var commentList = $('.comments');
    var commentBtn = $('.comment-btn');
    var commentDialog = $('.dialog');
    var commentInput = commentDialog.find('textarea');
    var likeBtn = $('.like-btn');
    var buyArea= $('.buy-area');
    var buyBtn = $('.buy-btn');

    $('.loading').addClass('hide');
    $('.title').text(design.title);
    $('.description').text(design.description).removeClass('hide');

    
    design.detail.forEach(function(data) {
      var img = new Image();
      img.src = data.pic;
      $(img).appendTo(detail);
      img.onload = function() {
        this.style.opacity = 1;
      }
      if (data.txt) {
        $('<p></p>').text(data.txt).appendTo(detail)
      }
    });

    design.comments && design.comments.forEach(function(data) {
      appendComment(data);
    });

    function appendComment(data) {
      var comment = $(commentTemplate.html());
      comment.find('.name').text(data.name);
      comment.find('img').attr('src', data.avatar);
      comment.find('.comment').text(data.content);
      comment.appendTo(commentList);
    }

    if(design.buyLink){
      buyArea.removeClass('hide');
      buyBtn.on('click',function(){
        bridge.url.open(design.buyLink);
      });
    }

    likeBtn.on('click', function() {
      if (likeBtn.find('span').text() == 'Liked') {
        removeFav(design);
      } else {
        addToFav(design);
      }
    });

    bridge.userDefaults.get('favs', function(data) {
      var favList = data || [];
      if (favList.indexOf(design['_id']) != -1) {
        likeBtn.find('span').text('Liked');
      }
    });

    commentBtn.on('click', function() {
      var content = common.prompt('输入评论');
      if (!content) {
        return;
      }
      bridge.http.post({
        domain: common.domain,
        path: '/api/design/' + design['_id'] + '/comment',
        body: {
          content: content
        }
      }, function(data) {
        if (!data) {
          return;
        }
        appendComment(data);
      })
    });

    function addToFav(design) {
      likeBtn.find('img').addClass('like-animation');
      setTimeout(function() {
        likeBtn.find('span').text('Liked');
        likeBtn.find('img').removeClass('like-animation');
      }, 600);

      var id = design['_id'];
      id && bridge.userDefaults.get('favs', function(data) {
        var favList = data || [];
        if (favList.indexOf(id) == -1) {
          favList.push(id);
          bridge.userDefaults.set('favs', favList);
        }
      });

      addFavCount(design);

    }

    function removeFav(design) {
      likeBtn.find('span').text('Like');
      var id = design['_id'];
      id && bridge.userDefaults.get('favs', function(data) {
        var favList = data || [];
        if (favList.indexOf(id) != -1) {
          favList.splice(favList.indexOf(id), 1);
          bridge.userDefaults.set('favs', favList);
        }
      });
    }

    function addFavCount(design) {
      bridge.http.post({
        domain: common.domain,
        path: '/api/design/' + design['_id'] + '/fav',
        body: {}
      }, function(data) {})
    }

    fastclick(document.body);
  }


}