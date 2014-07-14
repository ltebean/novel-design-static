var seaport = require('seaport-bridge');
$ = require('zepto')
var fastclick = require('fastclick');
var Spinner = require('spin.js');
var IScroll = require('iscroll');



var spinner = new Spinner({
  color: '#111111',
  lines: 10,
  length: 9,
  width: 3
});



function showSpinner() {
  spinner.spin(document.body);
  $('.spinner').css({
    position: 'fixed'
  });
}

function hideSpinner() {
  spinner.stop()
}


seaport.connect(function dataHandler(data) {
  console.log('receive data:' + data);
}, init);


function init(bridge) {
  var loading = false;
  var wrapper = $('.design-list');
  var template = $('.design-template');
  var more = $('.more');

  more.on('click', function() {
    loadData();
  })

  loadData();

  var domain = 'noveldesign.apiary-mock.com';

  function loadData(page) {
    if (loading) {
      return;
    }
    showSpinner();
    loading = true
    bridge.http.get({
      domain: 'noveldesign.apiary-mock.com',
      path: '/api/design'
    }, function(data) {
      hideSpinner();
      loading = false;
      if (!data) {
        alert('network error');
        return;
      }
      data.forEach(function(data) {
        generateDom(data)
      });
      more.removeClass('hide');
    })
  }

  function generateDom(data) {
    var design = $(template.html());
    design.find('.title').text(data.title);
    design.find('.description').text(data.description);
    design.on('click', function() {
      bridge.data.send({})
    });
    design.appendTo(wrapper);
    fastclick(design[0])
    design.find('.thumb img')[0].onload = function() {
      this.style.opacity = 1;
      setTimeout(function() {
        design.find('.likes').css('opacity', 1);
      }, 1300);
    }
    design.find('.thumb img').attr('src', data.pics[0]);

  }
}