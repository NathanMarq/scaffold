const AJAX = {
  _httpPromise: (method, url) => {
    return new Promise(function(resolve, reject){
      var xhr;

      if(window.XMLHttpRequest){ xhr = new XMLHttpRequest(); } // Mozilla, Safari, IE7+ ...
      else if(window.ActiveXObject){ xhr = new ActiveXObject("Microsoft.XMLHTTP"); } // IE 6 and older

      xhr.open(method, url);

      xhr.onload = function(){
        if(this.status >= 200 && this.status < 300){
          var toSend;
          try{
            toSend = JSON.parse(xhr.response);
          }
          catch(e){
            console.log(e);
            toSend = xhr.response;
          }
          resolve(toSend);
        }
        else{
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };

      xhr.onerror = function(){
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };

      xhr.send();
    });
  },

  get: (url) => {
    return AJAX._httpPromise("GET", url);
  }
};
