var seaport = require('seaport-bridge');
var $ = require('zepto')
var fastclick = require('fastclick');
var common = require('../lib/common');
var spinner = common.spinner;

function showSpinner() {
  spinner.spin(document.body);
  $('.spinner').css({
    position: 'fixed'
  });
}

function hideSpinner() {
  spinner.stop()
}

function showError(msg) {
  $('.error .txt').text(msg)
  $('.error').removeClass('hide');
}

function hideError() {
  $('.error').addClass('hide');
}

seaport.connect(function dataHandler(data) {

}, init);

function init(bridge) {
  var loading = false;
  var designList = $('.design-list');
  var designTemplate = $('.design-template');
  var pageToLoad = 1;
  var pageSize = 8;
  var ids = [];

  bridge.userDefaults.get('favs', function(data) {
    ids = data || [];
    if (ids.length == 0) {
      showError('还没有任何收藏哦')
    }
    loadData(ids);
  });

  function loadData() {
    var start = (pageToLoad - 1) * pageSize;
    var end = start + pageSize;
    var idsToLoad = ids.slice(start, end);
    showSpinner();
    bridge.http.get({
      domain: common.domain,
      path: '/api/design/list',
      params: {
        ids: JSON.stringify(idsToLoad)
      }
    }, function(data) {
      hideSpinner();
      if (!data) {
        common.alert('网络连接错误');
        showError();
        return;
      }
      pageToLoad++;
      data.forEach(function(data) {
        addDesignToList(data)
      });
      if (ids.length > pageSize) {
        $('.more').removeClass('hide');
      }
    })
  }

  function addDesignToList(data) {
    var design = $(designTemplate.html());
    design.find('.title').text(data.title);
    design.find('.description').text(data.description);
    design.find('.likes .txt').text(data.favs||0);
    design.on('click', function() {
      bridge.data.send({
        segue: 'detail',
        data: data
      })
    });
    design.appendTo(designList);
    fastclick(design[0]);
    design.find('.thumb img')[0].onload = function() {
      this.style.opacity = 1;
      design.find('.loading').addClass('hide');
      setTimeout(function() {
        design.find('.likes').css('opacity', 1);
      }, 1300);
    }
    design.find('.thumb img').attr('src', data.thumb)
    return design;
  }

  $('.more').on('click', function() {
    loadData();
  });


}