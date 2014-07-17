var Spinner = require('spin.js');

exports.domain = 'localhost:8090';

exports.alert = function alert(words) {
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(words);
  iframe.parentNode.removeChild(iframe);
}

exports.prompt = function prompt(title) {
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  var val = window.frames[0].window.prompt(title);
  iframe.parentNode.removeChild(iframe);
  return val;
}

exports.spinner= new Spinner({
  color: '#111111',
  lines: 12,
  length: 9,
  width: 2
});

window.onerror=function(err,file,line){
  alert(line+':'+err)
}