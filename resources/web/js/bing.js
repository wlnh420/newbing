
var kbt = (function () {
    var that = {};
    
    function decrypt(str, pwd) {
        if(str == ''){
            return '';
        }
        if(!pwd || pwd == ''){
            pwd = 'kb1234';
        }
        pwd = encodeURIComponent(pwd);
        if(str == undefined || str.length < 8) {
            return '';
        }
        if(pwd == undefined || pwd.length <= 0) {
            return '';
        }
        var prand = '';
        for(var i = 0, len = pwd.length; i < len; i += 1) {
            prand += pwd.charCodeAt(i).toString();
        }
        var sPos = Math.floor(prand.length / 5);
        var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) +
                   prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
        var incr = Math.round(pwd.length / 2);
        var modu = Math.pow(2, 31) - 1;
        var salt = parseInt(str.substring(str.length - 8, str.length), 16);
        str = str.substring(0, str.length - 8);
        prand += salt;
        while(prand.length > 10) {
            prand = (parseInt(prand.substring(0, 10)) + 
                     parseInt(prand.substring(10, prand.length))).toString();   
        }
        prand = (mult * prand + incr) % modu;
        var encChr = '';
        var encStr = '';
        for(var i = 0, len = str.length; i < len; i += 2) {
            encChr = parseInt(parseInt(str.substring(i, i + 2), 16) ^ Math.floor((prand / modu) * 255));   
            encStr += String.fromCharCode(encChr);   
            prand = (mult * prand + incr) % modu;   
        }
        return decodeURIComponent(encStr);
    }
    
   
    that.decrypt = decrypt;
    return that;
})();


  let xmlHttp = new XMLHttpRequest();
  if( !xmlHttp ){
     xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlHttp.open("HEAD",location.href,false);
  xmlHttp.send();
  var severtime=new Date(xmlHttp.getResponseHeader("Date"));
  const token = localStorage.getItem('token');
  var expStr =  kbt.decrypt(token);
  var expDate = new Date(expStr);

var result = Date.parse(expDate) > Date.parse(severtime);
if(result == false){
    window.location.href="./login.html";
}