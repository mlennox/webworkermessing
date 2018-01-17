class Demos {
  /**
   * attaches listener to a container to catch bubbled clicks
   * we will check if the click comes from a button
   * @param {*} containerId
   */
  onBubbledClick(containerId) {
    document.getElementById(containerId).addEventListener(
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
  }

  bigCalc(size) {
    const start = Date.now();
    size = size || 10000;
    for (let i = 0; i < size; i++) {
      Math.random();
    }
    console.log(`for ${size} it took ${Date.now() - start}ms`);
  }
}

const setupDemos = () => {
  //   add listeners
  const demos = new Demos();
  demos.onBubbledClick("vanillacpu");
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  setupDemos();
} else {
  document.addEventListener("DOMContentLoaded", setupDemos);
}
