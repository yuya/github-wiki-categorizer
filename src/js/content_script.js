;(function (window, document) {
if (!/(\/_edit|\/_new)/.test(location.href)) {
  chrome.runtime.sendMessage({}, function (response) {});
}

var stash = {};

function scrapingAnchors() {
  var elements = document.getElementsByClassName("wiki-page-link");
  var regex = /^\[(.*)\]\s?(.*)$/;
  var matched, category, pageName;

  [].forEach.call(elements, function (el) {
    matched = regex.exec(el.innerText);

    if (matched) {
      category = matched[1];
      pageName = matched[2];

      if (stash[category] == null) {
        stash[category] = [];
      }

      stash[category].push({ "name": pageName, "href": el.href });
    }
  });
}

function appendCategories() {
  var objectKeys = Object.keys(stash);

  if (!objectKeys.length) {
    return;
  }

  var target   = document.querySelector(".new-discussion-timeline");
  var element  = document.createElement("div");
  var fragment = document.createDocumentFragment();

  var _dl = document.createElement("dl");
  var _dt = document.createElement("dt");
  var _dd = document.createElement("dd");
  var _ul = document.createElement("ul");
  var _li = document.createElement("li");
  var _a  = document.createElement("a");
  var dl, dt, dd, ul, li, a;

  objectKeys.forEach(function (key) {
    dl = _dl.cloneNode();
    dt = _dt.cloneNode();
    dd = _dd.cloneNode();
    ul = _ul.cloneNode();

    stash[key].forEach(function (obj) {
      li = _li.cloneNode();
      a  = _a.cloneNode();

      a.innerText = obj.name;
      a.href = obj.href;

      li.appendChild(a);
      ul.appendChild(li);
    });

    dt.innerText = key;
    dd.appendChild(ul);

    dl.appendChild(dt);
    dl.appendChild(dd);

    fragment.appendChild(dl);
  });

  element.className = "__github-wiki-categorizer__";
  element.appendChild(fragment);

  target.appendChild(element);
}

function initialize() {
  scrapingAnchors();
  appendCategories();
}

initialize();

})(this, this.document);
