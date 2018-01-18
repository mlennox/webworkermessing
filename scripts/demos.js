class Demos {
  constructor() {
    this.someDoc = this.generateDoc(1000);
    this.notifier = document.getElementById("notifier");
  }

  notify(message) {
    if (this.notifier) {
      this.notifier.innerText = message || "...";
    }
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

  //   reqFetch(size) {
  //     function reqListener () {
  //         console.log(this.responseText);
  //       }

  //       var oReq = new XMLHttpRequest();
  //       oReq.addEventListener("load", reqListener);
  //       oReq.open("GET", "http://www.example.org/example.txt");
  //       oReq.send();
  //   }
}

const setupDemos = () => {
  console.log("setting the listeners");
  const demos = new Demos();
  demos.onBubbledClick(["vanillacpu", "vanillastorage", "vanillaajax"]);
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  setupDemos();
} else {
  document.addEventListener("DOMContentLoaded", setupDemos);
}
