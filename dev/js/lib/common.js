exports.domain = 'localhost:3000';

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