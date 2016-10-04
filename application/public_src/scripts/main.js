const homepage = {
  colorOptions: [ '#002635', '#013440', '#AB1A25', '#D97925' ]
};

AJAX.get('/api/getData/title')
      .then((results) => {
        homepage.title = results.title;
        homepage.subtitle = results.subtitle;
        updateContent("title", homepage.title);
        updateContent("subtitle", homepage.subtitle);
        DOM.withID("title-input").value = results.title;
        DOM.withID("subtitle-input").value = results.subtitle;
      })
      .catch((error) => {
        console.log(error);
      });

var updateSize = (id, value) => {
  if(value.target){ value = value.target.value; }

  var element = DOM.withID(id);
  element.style["font-size"] = (!!value) ? value + "px" : "";
};

var updateBackgroundColor = (id, value) => {
  if(value.target){ value = value.target.value; }

  var element = DOM.withID(id);
  element.style["background-color"] = value;
};

var updateContent = (id, value) => {
  if(value.target){ value = value.target.value; }

  var element = DOM.withID(id);
  element.innerHTML = value;
};

var toggleConnection = () => {
  if(homepage.socket){ SOCKET.disconnect(); }
  else{ SOCKET.connect(); }
};

SOCKET.on('connect', function(){
  var element = DOM.withID("io-status");
  element.style.color = "green";
  element.innerHTML = "&ofcir;&nbsp;good";
  homepage.socket = true;
});

SOCKET.on('disconnect', function(){
  var element = DOM.withID("io-status");
  element.style.color = "red";
  element.innerHTML = "&olcir;&nbsp;bad";
  homepage.socket = false;
});

SOCKET.on('reconnect', function(){
  var element = DOM.withID("io-status");
  element.style.color = "green";
  element.innerHTML = "&ofcir;&nbsp;good";
  homepage.socket = true;
});

// now let's set up the other stuff:
updateBackgroundColor('title-container', homepage.colorOptions[0]); // default background-color:
updateBackgroundColor('button-0', homepage.colorOptions[0]);
updateBackgroundColor('button-1', homepage.colorOptions[1]);
updateBackgroundColor('button-2', homepage.colorOptions[2]);
updateBackgroundColor('button-3', homepage.colorOptions[3]);
updateContent('button-0', homepage.colorOptions[0]);
updateContent('button-1', homepage.colorOptions[1]);
updateContent('button-2', homepage.colorOptions[2]);
updateContent('button-3', homepage.colorOptions[3]);

DOM.withID("io-status").style.color = "red";
