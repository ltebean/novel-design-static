var seaport = require('seaport-bridge');
$ = require('zepto')
var fastclick = require('fastclick');

//fastclick(document.body);


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

  design.comments.forEach(function(data) {
    var comment = $(commentTemplate.html());
    comment.find('.name').text(data.name);
    comment.find('img').attr('src', data.avatar);
    comment.find('.comment').text(data.content);
    comment.appendTo(commentList)
  });


  $('textarea').on('keydown', function(event) {
    if (event.which != 13) return;
    alert($(this).val());
  });

}