class Demos {
  constructor() {
    this.someDoc = this.generateDoc(1000);
    this.notifier = document.getElementById("notifier");
  }

  setupTabbing() {
    this.tabber = document.getElementById("tabber");
    const tabs_nav = this.tabber.getElementsByTagName("li");
    const tabs_content = document
      .getElementById("code")
      .getElementsByTagName("article");
    this.tabs = {};
    for (let tab of tabs_nav) {
      let target = tab.dataset.target;
      this.tabs[target] = {
        nav: tab
      };
    }
    for (let tab of tabs_content) {
      let target = tab.id;
      this.tabs[target].content = tab;
    }
    this.tabListeners();
  }

  notify(message) {
    if (this.notifier) {
      this.notifier.innerText = message || "...";
    }
  }

  tabListeners() {
    this.tabber.addEventListener("click", event => {
      if (event.target.tagName === "LI") {
        let tab_to_focus = event.target.dataset.target;
        this.changeTab(tab_to_focus);
      }
    });
  }

  changeTab(focus_tab) {
    for (let tab of Object.keys(this.tabs)) {
      console.log(tab);
      this.tabs[tab].nav.className = "";
      this.tabs[tab].content.className = "hidden";
    }
    this.tabs[focus_tab].nav.className = "open";
    this.tabs[focus_tab].content.className = "";
  }

  /**
   * attaches listener to a container to catch bubbled clicks
   * we will check if the click comes from a button
   * @param {*} containerId
   */
  onBubbledClick(containerIds) {
    containerIds.forEach(id => {
      document.getElementById(id).addEventListener(
        "click",
        event => {
          if (event.target.tagName === "BUTTON") {
            let size = event.target.dataset.size;
            let handlerName = event.target.dataset.handler;
            this[handlerName](size);
          }
        },
        false
      );
    });
  }

  bigCalc(size) {
    this.notify();
    const start = Date.now();
    size = size || 10000;
    for (let i = 0; i < size; i++) {
      Math.random();
    }
    this.notify(`bigCalc : for ${size} it took ${Date.now() - start}ms`);
  }

  bigCalcPromised(size) {
    this.notify();
    const start = Date.now();
    size = size || 10000;
    new Promise((res, rej) => {
      for (let i = 0; i < size; i++) {
        Math.random();
      }
      res();
    }).then(() => {
      this.notify(
        `bigCalcPromised : for ${size} it took ${Date.now() - start}ms`
      );
    });
  }

  generateDoc(limit) {
    this.notify();
    let doc = {};
    for (let i = 0; i < limit; i++) {
      doc[`node-${i}`] = {
        namer: `name ${i}`,
        somedata: Math.random()
      };
    }
    return JSON.stringify(doc);
  }

  storeIt(size) {
    this.notify();
    const start = Date.now();
    size = size || 1000;
    for (let i = 0; i < size; i++) {
      localStorage.setItem(`${size}`, this.someDoc);
    }
    this.notify(`storeIt : for ${size} it took ${Date.now() - start}ms`);
  }

  junkFetch(size) {
    const start = Date.now();
    size = size || 100;
    for (let i = 0; i < size; i++) {
      fetch("/junk/").then(data => {});
    }
    this.notify(`junkFetch : for ${size} it took ${Date.now() - start}ms`);
  }

  xhrReq(size) {
    this.notify();
    const start = Date.now();
    size = size || 1000;
    let request = new XMLHttpRequest();
    for (let i = 0; i < size; i++) {
      request.open("GET", "/junk/", true);
      request.send(null);
    }
    this.notify(`xhrReq : for ${size} it took ${Date.now() - start}ms`);
  }
}

const setupDemos = () => {
  console.log("setting the listeners");
  const demos = new Demos();
  demos.setupTabbing();
  demos.onBubbledClick([
    "vanillacpu",
    "vanillastorage",
    "vanillaajax",
    "vanillafetch",
    "promisescpu"
  ]);
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  setupDemos();
} else {
  document.addEventListener("DOMContentLoaded", setupDemos);
}
