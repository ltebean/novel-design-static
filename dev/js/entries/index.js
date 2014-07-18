var seaport = require('seaport-bridge');
var $ = require('zepto');
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

function showError() {
  $('.error').removeClass('hide');
}

function hideError() {
  $('.error').addClass('hide');
}

function showCategory(){
  $('.category-list').addClass('spread');
}

function hideCategory(){
  $('.category-list').removeClass('spread');
}

function toggleCategory(){
  $('.category-list').toggleClass('spread');
}

seaport.connect(function dataHandler(data) {
  toggleCategory();
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
  loadData();

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
      addCategoryToList('最新');
      data.forEach(function(data) {
        addCategoryToList(data);
      });
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
      bridge.data.send({
        title:$(this).text().trim()
      });
      if (categoryToLoad == '最新') {
        categoryToLoad = '';
      }
      pageToLoad=1;
      loadData();
      hideCategory();

    });
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
        common.alert('网络连接错误');
        showError();
        return;
      }
      if(data.length==0){
        common.alert('没有更多咯');
        return;
      }
      if(pageToLoad==1){
        designList.empty();
      }
      pageToLoad++;
      data.forEach(function(data) {
        addDesignToList(data)
      });
      more.removeClass('hide');
      $(window).scrollTop(0);
    })
  }


  function addDesignToList(data) {
    var design = $(designTemplate.html());
    design.find('.title').text(data.title);
    design.find('.description').text(data.description);
    design.find('.likes .txt').text(data.favs||0);
    design.on('click', function() {
      hideCategory();
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