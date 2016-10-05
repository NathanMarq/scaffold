const DOM = {
  withID: (id) => { return document.getElementById(id); },
  withClass: (className) => { return document.getElementsByClassName(className); },
  withTagName: (name) => { return document.getElementsByTagName(name); },
  relativeTime: (dateObj) => {
    var currentTime = new Date();
    var diff = currentTime - dateObj;

    var leftOver = diff / 1000;
    var seconds = leftOver % 60;
    leftOver /= 60;
    var minutes = leftOver % 60;
    leftOver /= 60;
    var hours = leftOver % 24;
    leftOver /= 24;
    var days = leftOver;

    if(days >= 1){
      var d = Math.round(days);
      return d + " day" + ( (d === 1) ? "" : "s" ) + " ago";
    }
    else if(hours >= 1){
      var h = Math.round(hours);
      return h + " hour" + ( (h === 1) ? "" : "s" ) + " ago";
    }
    else if(minutes >= 1){
      var m = Math.round(minutes);
      return m + " minute" + ( (m === 1) ? "" : "s" ) + " ago";
    }
    else if(seconds >= 1){
      var s = Math.round(seconds);
      return s + " second" + ( (s === 1) ? "" : "s" ) + " ago";
    }
    else{
      return "now";
    }
  },
  readableTime: (date) => {
    var year = date.getFullYear(),
        month = date.getMonth()+1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
       seconds = date.getSeconds();
    return hour + ":" + minute + ":" + seconds;
  },
  on: (element, ev, callback) => {
    element.addEventListener(ev, callback);
  }
};
