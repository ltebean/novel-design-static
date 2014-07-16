var seaport = require('seaport-bridge');
var $ = require('zepto')
var fastclick = require('fastclick');
var common = require('../lib/common');

window.onerror = function(msg, url, line) {
  alert(line + ':' + msg)
}

seaport.connect(function dataHandler(data) {
  console.log('receive data:' + data);
}, init);

function init(bridge) {
  bridge.param.get('data', drawScreen);

  function drawScreen(design) {
    var detail = $('.detail');
    var commentTemplate = $('.comment-template');
    var commentList = $('.comments');
    var commentDialog = $('.dialog');
    var commentInput = commentDialog.find('textarea');
    var likeBtn = $('.like-btn');

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


    $('.loading').addClass('hide');
    $('.title').text(design.title);
    $('.description').text(design.description);

    design.comments && design.comments.forEach(function(data) {
      var comment = $(commentTemplate.html());
      comment.find('.name').text(data.name);
      comment.find('img').attr('src', data.avatar);
      comment.find('.comment').text(data.content);
      comment.appendTo(commentList);
    });

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

    $('.comment-btn').on('click', function() {
      var content = common.prompt('输入评论');
      //alert(val)
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
      })
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

    fastclick(document.body);
  }


}