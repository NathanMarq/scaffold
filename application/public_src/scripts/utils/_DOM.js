const DOM = {
  withID: (id) => { return document.getElementById(id); },
  withClass: (className) => { return document.getElementsByClassName(className); },
  withTagName: (name) => { return document.getElementsByTagName(name); }
};
