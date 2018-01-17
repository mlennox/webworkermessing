class Demos {
  constructor() {
    this.someDoc = this.generateDoc(1000);
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
    const start = Date.now();
    size = size || 10000;
    for (let i = 0; i < size; i++) {
      Math.random();
    }
    console.log(`bigCalc : for ${size} it took ${Date.now() - start}ms`);
  }

  generateDoc(limit) {
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
    const start = Date.now();
    size = size || 1000;
    for (let i = 0; i < size; i++) {
      localStorage.setItem(`${size}`, this.someDoc);
    }
    console.log(`storeIt : for ${size} it took ${Date.now() - start}ms`);
  }
}

const setupDemos = () => {
  //   add listeners
  const demos = new Demos();
  demos.onBubbledClick(["vanillacpu", "vanillastorage"]);
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  setupDemos();
} else {
  document.addEventListener("DOMContentLoaded", setupDemos);
}
