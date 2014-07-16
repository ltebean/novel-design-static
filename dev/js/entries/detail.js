var seaport = require('seaport-bridge');
$ = require('zepto')
var fastclick = require('fastclick');


function prompt(title) {
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  var val=window.frames[0].window.prompt(title);
  iframe.parentNode.removeChild(iframe);
  return val;
}

seaport.connect(function dataHandler(data) {
  console.log('receive data:' + data);
}, init);

function init(bridge) {
  bridge.param.get('data', drawScreen);
}

function drawScreen(design) {
  var detail = $('.detail');
  var commentTemplate = $('.comment-template');
  var commentList = $('.comments');
  var commentDialog = $('.dialog');
  var commentInput = commentDialog.find('textarea');
  var likeBtn=$('.like-btn');

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

  likeBtn.on('click',function(){
    likeBtn.find('img').addClass('like-animation');
    setTimeout(function() {
      likeBtn.find('span').text('Liked');
      likeBtn.find('img').removeClass('like-animation');
    }, 600);
  })

  $('.comment-btn').on('click', function() {
      var content=prompt('输入评论');
      //alert(val)
  });

  fastclick(document.body);

}