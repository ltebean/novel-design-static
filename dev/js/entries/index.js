var seaport = require('seaport-bridge');
var $ = require('zepto');
var fastclick = require('fastclick');
var IScroll = require('iscroll');
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

function showError() {
  $('.error').removeClass('hide');
}

function hideError() {
  $('.error').addClass('hide');
}

seaport.connect(function dataHandler(data) {
  console.log('receive data:' + data);
}, init);


function init(bridge) {
  var screenWidth = $(document).width();
  var loading = false;
  var designList = $('.design-list');
  var designTemplate = $('.design-template');
  var categoryList = $('.category-list');
  var categoryTemplate = $('.category-template');
  var more = $('.more');
  var pageToLoad = 1;
  var categoryToLoad = '';

  more.on('click', function() {
    loadData();
  })

  loadCategory();

  function loadCategory() {

    showSpinner()
    bridge.http.get({
      domain: common.domain,
      path: '/api/category'
    }, function(data) {
      if (!data) {
        hideSpinner();
        showError();
        return;
      }
      var totalWidth = 0;
      data.forEach(function(data) {
        totalWidth += addCategoryToList(data).width() + 1;
      });
      if (totalWidth > screenWidth) {
        categoryList.css('width', totalWidth + 'px');
      }
      categoryList.css('margin-top', '0px');
      setTimeout(function() {
        loadData();
      }, 300);
    })
  }

  function addCategoryToList(data) {
    var category = $(categoryTemplate.html());
    category.text(data);
    category.appendTo(categoryList);
    fastclick(category[0]);
    category.on('click', function() {
      $('.category').removeClass('active');
      $(this).addClass('active');
      categoryToLoad = $(this).text().trim();
      if (categoryToLoad == '最新') {
        categoryToLoad = '';
      }
      loadData()
    });
    return category;
  }

  function loadData() {
    if (loading) {
      return;
    }
    hideError();
    showSpinner();
    loading = true;
    bridge.http.get({
      domain: common.domain,
      path: '/api/design',
      params: {
        page: pageToLoad,
        category: categoryToLoad
      }
    }, function(data) {
      hideSpinner();
      loading = false;
      if (!data) {
        common.alert('Network Error');
        showError();
        return;
      }
      pageToLoad++;
      data.forEach(function(data) {
        addDesignToList(data)
      });
      more.removeClass('hide');
    })
  }


  function addDesignToList(data) {
    var design = $(designTemplate.html());
    design.find('.title').text(data.title);
    design.find('.description').text(data.description);
    design.find('.likes .txt').text(design.favs||0);
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


}