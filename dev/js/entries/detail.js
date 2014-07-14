var seaport = require('seaport-bridge');
$ = require('zepto')
var fastclick = require('fastclick');
var Spinner = require('spin.js');
var IScroll = require('iscroll');

fastclick(document.body);
//new IScroll(document.body);


var spinner = new Spinner({
  color: '#111111',
  lines: 10,
  length: 10
});


// spinner.spin(document.body);

// $('.spinner').css({
//   position:'fixed'
// });

// setTimeout(function() {
//   spinner.stop()
// }, 2000);

seaport.connect(function dataHandler(data) {

  console.log('receive data:' + data);

}, function(bridge) {

	$('.product').on('click',function(){
		bridge.data.send({})
	})




})