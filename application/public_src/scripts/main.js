const homepage = {
  colorOptions: [ '#002635', '#013440', '#AB1A25', '#D97925' ]
};

AJAX.get('/api/homepage/title')
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

SOCKET.on('connect', () => {
  var element = DOM.withID("io-status");
  element.style.color = "green";
  element.innerHTML = "&ofcir;&nbsp;good";
  homepage.socket = true;
});

SOCKET.on('disconnect', () => {
  var element = DOM.withID("io-status");
  element.style.color = "red";
  element.innerHTML = "&olcir;&nbsp;bad";
  homepage.socket = false;
});

SOCKET.on('reconnect', () => {
  var element = DOM.withID("io-status");
  element.style.color = "green";
  element.innerHTML = "&ofcir;&nbsp;good";
  homepage.socket = true;
});

SOCKET.on("message:down", (message) => {
  const node = document.createElement("li");
  const span = document.createElement("span");
  node.appendChild(document.createTextNode(message.message));
  span.appendChild(document.createTextNode(DOM.readableTime(new Date(message.time))));
  node.appendChild(span);
  DOM.conversation.appendChild(node);

  if(DOM.conversation.autoScroll){
    DOM.conversation.scrollTop = DOM.conversation.scrollHeight;
  }
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

DOM.on(window, "load", (loadEvent) => {
  DOM.form = DOM.withID("message-form");
  DOM.formInput = DOM.withID("message-input");
  DOM.conversation = DOM.withID("message-stream");
  DOM.conversation.autoScroll = true;

  DOM.on(DOM.form, "submit", (submitEvent) => {
    submitEvent.preventDefault();

    SOCKET.emit("message:up", { message: DOM.formInput.value, time: Date.now() });
    DOM.formInput.value = "";

    return false;
  });

  DOM.on(DOM.conversation, "scroll", function(scrollEvent){
    var scrollPos = DOM.conversation.scrollTop;
    var actualHeight = DOM.conversation.scrollHeight;
    var visibleHeight = DOM.conversation.clientHeight;

    var pxFromBottom = ( actualHeight - visibleHeight ) - scrollPos;

    DOM.conversation.autoScroll = (actualHeight > visibleHeight && pxFromBottom <= 20);

  });

});
