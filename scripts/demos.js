class Demos {
  constructor() {
    this.someDoc = this.generateDoc(1000);
    this.notifier = document.getElementById("notifier");
    this.worker = new Worker("worker.js");
    this.worker.onmessage = handleWorkerMessage;
    // = function(e) {
    // 	result.textContent = e.data;
    // 	console.log('Message received from worker');
    // };
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
      this.tabs[tab].nav.className = "";
      this.tabs[tab].content.className = "";
    }
    this.tabs[focus_tab].nav.className = "active";
    this.tabs[focus_tab].content.className = "active";
  }

  /**
   * attaches listener to a container to catch bubbled clicks
   * we will check if the click comes from a button
   * @param {*} containerId
   */
  onBubbledClick(containerIds) {
    containerIds.forEach(id => {
      document.getElementById(id).addEventListener("click", event => {
        if (event.target.tagName === "BUTTON") {
          let handler_prefix = event.currentTarget.id;
          let handler_suffix = event.target.parentElement.dataset.handler;
          let size = event.target.dataset.size;
          this[`${handler_prefix}_${handler_suffix}`](size);
        }
      });
    });
  }

  promiser(fn, name, size) {
    this.notify();
    const start = Date.now();
    size = size || 10000;
    new Promise((res, rej) => {
      fn.call(this, size);
      res();
    }).then(() => {
      this.notify(`${name} : for ${size} it took ${Date.now() - start}ms`);
    });
  }

  async asyncifier(fn, name, size) {
    this.notify();
    const start = Date.now();
    size = size || 10000;
    await fn.call(this, size);
    this.notify(`${name} : for ${size} it took ${Date.now() - start}ms`);
  }

  workerify(fn, name, size) {
    let message = {
      start: Date.now(),
      fn: data => fn,
      size: size,
      name: name
    };
    this.worker.postMessage(message);
  }

  handleWorkerMessage(message) {
    this.notify(message.data.reply);
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

  // base operations --------------------

  bigCalc(size) {
    size = size || 10000;
    for (let i = 0; i < size; i++) {
      Math.random();
    }
  }

  storeIt(size) {
    size = size || 1000;
    for (let i = 0; i < size; i++) {
      localStorage.setItem(`${size}`, this.someDoc);
    }
  }

  xhrReq(size) {
    size = size || 1000;
    let request = new XMLHttpRequest();
    for (let i = 0; i < size; i++) {
      request.open("GET", "/junk/", true);
      request.send(null);
    }
  }

  junkFetch(size) {
    size = size || 100;
    for (let i = 0; i < size; i++) {
      fetch("/junk/").then(data => {});
    }
  }

  // example tester functions --------------------

  vanilla_cpu(size) {
    this.notify();
    const start = Date.now();
    this.bigCalc(size);
    this.notify(`vanilla_cpu : for ${size} it took ${Date.now() - start}ms`);
  }

  vanilla_storage(size) {
    this.notify();
    const start = Date.now();
    this.storeIt(size);
    this.notify(
      `vanilla_storage : for ${size} it took ${Date.now() - start}ms`
    );
  }

  vanilla_ajax(size) {
    this.notify();
    const start = Date.now();
    this.xhrReq(size);
    this.notify(`vanilla_ajax : for ${size} it took ${Date.now() - start}ms`);
  }

  promises_cpu(size) {
    this.promiser(this.bigCalc, "promises_cpu", size);
  }

  promises_storage(size) {
    this.promiser(this.storeIt, "promises_storage", size);
  }

  promises_ajax(size) {
    this.promiser(this.xhrReq, "promises_ajax", size);
  }

  promises_fetch(size) {
    this.notify();
    const start = Date.now();
    this.junkFetch(size);
    this.notify(`vanilla_fetch : for ${size} it took ${Date.now() - start}ms`);
  }

  async async_cpu(size) {
    await this.asyncifier(this.bigCalc, "async_cpu", size);
  }

  async async_storage(size) {
    await this.asyncifier(this.storeIt, "async_storage", size);
  }

  async async_ajax(size) {
    await this.asyncifier(this.xhrReq, "async_ajax", size);
  }

  async async_fetch(size) {
    await this.asyncifier(this.junkFetch, "async_fetch", size);
  }

  workers_cpu(size) {
    let fn = data => {
      this.bigCalc(data.size);
      return `${data.name} : for ${data.size} it took ${Date.now() -
        data.start}ms`;
    };
    this.workerify(this.bigCalc, "workers_cpu", size);
  }
}

const setupDemos = () => {
  console.log("setting the listeners");
  const demos = new Demos();
  demos.setupTabbing();
  demos.onBubbledClick(["vanilla", "promises", "async"]);
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  setupDemos();
} else {
  document.addEventListener("DOMContentLoaded", setupDemos);
}
