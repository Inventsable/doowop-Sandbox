<template>
  <div class="home" @click="triggerDoowop">
    <div
      class="test-space"
      @mouseenter="hover = true"
      @mouseleave="hover = false"
    >
      <div class="toolbar">
        <div class="toolbar-button" v-for="i in 3" :key="i"></div>
      </div>
      <div class="test-footer">
        <span class="test-button" id="create" @click="buildDooWops"
          >Create</span
        >
        <span class="test-button" id="important" @click="removeDoowop"
          >Delete</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import doowop from "../doowop";

export default {
  name: "Home",
  components: {},
  data: () => ({
    hover: false,
    mousePos: [200, 200],
    dooWops: [],
    timer: null,
  }),
  mounted() {
    if (!this.dooWops.length) this.buildDooWops();

    let opts = {
      animation: {
        duration: 1200,
        infinite: true,
      },
      border: {
        width: 2,
      },
      elt: {
        selector: "#create",
      },
    };
    doowop.outline(opts);
  },
  methods: {
    buildDooWops() {
      let opts = {
        animation: {
          duration: 1200,
          infinite: true,
        },
        elt: {
          selector: "#important",
        },
      };

      let anchors = ["NW", "NC", "NE", "CW", "CC", "CE", "SW", "SC", "SE"];
      let colors = [
        "violet",
        "blueviolet",
        "indigo",
        "blue",
        "green",
        "greenyellow",
        "yellow",
        "orange",
        "red",
      ];
      let index = -1;

      this.timer = setInterval(() => {
        if (index > anchors.length) clearInterval(this.timer);
        index++;
        let newOpts = {};
        Object.assign(newOpts, opts);
        newOpts["background"] = colors[index];
        newOpts.elt["anchor"] = anchors[index];
        if (anchors[index]) this.dooWops.push(doowop.bubble(newOpts));
        else clearInterval(this.timer);
      }, 100);
    },
    removeDoowop() {
      this.dooWops.forEach((doo) => {
        doo.stop();
      });
      for (var i = this.dooWops.length - 1; i >= 0; i--) this.dooWops.pop();
    },
    triggerSpark(evt) {
      this.mousePos = [evt.clientX, evt.clientY];
      this.$refs.spark.trigger();
    },
    triggerDoowop(evt) {
      if (this.hover) return false;
      let opts = {
        width: 100,
        height: 100,
        position: [evt.clientX, evt.clientY],
        animation: {
          duration: 800,
        },
      };
      doowop.bubble(opts);
    },
  },
};
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap");

.home {
  font-family: "Lexend Deca", sans-serif;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  margin-top: 200px;
  box-sizing: border-box;
}

.test-space {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  /* padding: 10px 20px; */
  overflow: hidden;
  margin: auto;
  max-width: 200px;
  border: 2px solid #666;
  border-radius: 20px 5px 5px 5px;
}

.toolbar {
  width: 100%;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.toolbar-button {
  width: 6px;
  height: 6px;
  border-radius: 6px;
  background: #444;
  margin: 0px 3px;
}

.toolbar-button:first-of-type {
  margin-left: 20px;
}

.test-footer {
  display: flex;
}

.test-button {
  padding: 4px 8px;
  margin: 10px;
  border: 2px solid #231f20;
  border-radius: 6px;
  cursor: pointer;
  z-index: 5;
}

.test-button:hover {
  background: #231f20;
  color: white;
}
</style>