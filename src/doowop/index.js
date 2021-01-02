import { toPx } from "./toPx";

let dynamicStyles = null;
function addAnimation(body) {
  if (!dynamicStyles) {
    dynamicStyles = document.createElement("style");
    dynamicStyles.type = "text/css";
    document.head.appendChild(dynamicStyles);
  }
  dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
function assignDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        assignDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return assignDeep(target, ...sources);
}

function pinpoint(opts, target) {
  if (!target)
    return {
      x: opts.position[0] - opts.width / 2,
      y: opts.position[1] - opts.height / 2,
    };
  else {
    let possibles = getAllPositions(target);
    let match = possibles[opts.elt.anchor];
    return {
      x: match.x - opts.width / 2,
      y: match.y - opts.height / 2,
    };
  }
}

function getAllPositions(target) {
  let xS = {
    W: target.left,
    C: (target.right - target.left) / 2 + target.left,
    E: target.right,
  };
  let yS = {
    N: target.top,
    C: (target.bottom - target.top) / 2 + target.top,
    S: target.bottom,
  };
  return {
    NW: {
      x: xS.W,
      y: yS.N,
    },
    NC: {
      x: xS.C,
      y: yS.N,
    },
    NE: {
      x: xS.E,
      y: yS.N,
    },
    CW: {
      x: xS.W,
      y: yS.C,
    },
    CC: {
      x: xS.C,
      y: yS.C,
    },
    CE: {
      x: xS.E,
      y: yS.C,
    },
    SW: {
      x: xS.W,
      y: yS.S,
    },
    SC: {
      x: xS.C,
      y: yS.S,
    },
    SE: {
      x: xS.E,
      y: yS.S,
    },
  };
}

function outline(opts) {
  let settings = {
    extraWidth: 40,
    extraHeight: 40,
    offset: [0, 0],
    background: "#ff0000",
    opacity: 1,
    border: {
      width: 0,
      color: "red",
      radius: 40,
      type: "solid",
    },
    animation: {
      type: "normal",
      duration: 800,
      name: "outlineIn",
      timing: "cubic-bezier(0.16, 0, 0.84, 1)",
      infinite: false,
    },
    elt: {
      selector: null,
    },
  };
  assignDeep(settings, opts);

  let target;
  if (settings.elt.selector)
    target = document.querySelector(settings.elt.selector);
  else return null;

  const clone = target.cloneNode(true);
  const wrapper = document.createElement("div");

  document.body.appendChild(wrapper);
  wrapper.appendChild(clone);
  // let borders = ["left", "top", "right", "bottom"];
  // let borderOffsets = {};
  // borders.forEach((side) => {
  //   borderOffsets[side] = toPx(
  //     target,
  //     getComputedStyle(target)[`border-${side}-width`],
  //     `border-${side}-width`
  //   );
  // });
  // let width =
  //   target.getBoundingClientRect().width +
  //   settings.extraWidth * 2 +
  //   borderOffsets.left +
  //   borderOffsets.right +
  //   settings.border.width * 2;
  // let height =
  //   target.getBoundingClientRect().height +
  //   settings.extraHeight * 2 +
  //   borderOffsets.top +
  //   borderOffsets.bottom +
  //   settings.border.width * 2;
  // let left =
  //   target.getBoundingClientRect().left -
  //   settings.extraWidth -
  //   borderOffsets.right -
  //   borderOffsets.left;
  // let top =
  //   target.getBoundingClientRect().top -
  //   settings.extraHeight -
  //   borderOffsets.bottom -
  //   borderOffsets.top;
  // console.log("Targ:", target.getBoundingClientRect());
  // console.log("Clone:", clone.getBoundingClientRect());

  let width = target.getBoundingClientRect().width + settings.extraWidth * 2;
  let height = target.getBoundingClientRect().height + settings.extraHeight * 2;
  let left = target.getBoundingClientRect().left - settings.extraWidth;
  let top = target.getBoundingClientRect().top - settings.extraHeight;
  console.log("Targ:", target.getBoundingClientRect());
  console.log("Clone:", clone.getBoundingClientRect());

  clone.id = "clone";

  wrapper.style.cssText = `
    width: ${width}px;
    height: ${height}px;
    position: absolute;
    left: ${left}px;
    top: ${top}px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  `;

  clone.className = "";

  let leftOffset = console.log(leftOffset);

  let additionalStyles = {
    "border-width": `${settings.border.width}px`,
    "border-style": `${settings.border.style}`,
    "border-color": `${settings.border.color}`,
    color: "transparent",
  };
  cloneStyle(target, clone, Object.keys(additionalStyles));

  let realZIndex = getZIndexFromNode(target);
  console.log(realZIndex);

  clone.style.zIndex = realZIndex - 1;

  for (let key in additionalStyles) {
    clone.style[key] = additionalStyles[key];
  }

  console.log(window.getComputedStyle(target).zIndex);

  addAnimation(`
    @keyframes outlineIn {
      0% {
        border-width: 4px;
        opacity: 1;
      }
      100% {
        opacity: 0;
        border-width: 10px;
      }
    }
  `);

  clone.style.animation = `${settings.animation.name} ${settings.animation
    .duration || 800}ms ${
    settings.animation.infinite ? "infinite" : settings.animation.type
  }`;

  if (!settings.animation.infinite) {
    setTimeout(() => {
      clone.remove();
      wrapper.remove();
    }, settings.animation.duration - 10);
  }

  return {
    stop: function() {
      clone.remove();
      wrapper.remove();
    },
  };

  // console.log(clone);
}

function cloneStyle(target, clone, omittedKeys) {
  let omittedRX = new RegExp(`^(${omittedKeys.join("|")})$`);
  let style = getComputedStyle(target);
  console.log(style);
  // console.log(omittedRX);
  let string = "";
  for (let key of style) {
    if (/\D/.test(key) && !omittedRX.test(key)) {
      string += `${key}: ${style[key]};`;
      clone.style[key] = style[key];
    }
  }
}

function getZIndexFromNode(node) {
  let value;
  try {
    value = getComputedStyle(node).zIndex;
  } catch (err) {
    console.error("Tripped up on: ", node);
    return -1;
  }
  if (isNaN(+value)) {
    console.log(node.parentNode);
    return getZIndexFromNode(node.parentNode);
  } else return value;
}

function bubble(opts) {
  let settings = {
    width: 40,
    height: 40,
    position: [0, 0],
    offset: [0, 0],
    background: "#ff0000",
    opacity: 1,
    border: {
      width: 0,
      color: "transparent",
      radius: 40,
      type: "solid",
    },
    animation: {
      type: "normal",
      duration: 800,
      name: "scaleIn",
      timing: "cubic-bezier(0.16, 0, 0.84, 1)",
      infinite: false,
    },
    elt: {
      selector: null,
      anchor: "NW",
    },
  };

  assignDeep(settings, opts);
  const wrapper = document.createElement("div");
  document.body.appendChild(wrapper);
  let target;

  // console.log(getAnchorPositions(settings.elt.selector));

  if (settings.elt.selector) {
    target = document
      .querySelector(settings.elt.selector)
      .getBoundingClientRect();
    settings.position[0] = target.left;
    settings.position[1] = target.top;
  }

  let realPos = pinpoint(settings, target);
  wrapper.style.cssText = `
    width: ${settings.width}px;
    height: ${settings.height}px;
    position: absolute;
    left: ${realPos.x}px;
    top: ${realPos.y}px;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
  `;

  const bokeh = document.createElement("div");
  wrapper.appendChild(bokeh);
  bokeh.style.cssText = `
    border: ${settings.border.width}px ${settings.border.type} ${settings.border.color};
    border-radius: ${settings.width}px;
    opacity: ${settings.opacity};
    background: ${settings.background};
    pointer-events: none;
  `;

  addAnimation(`
    @keyframes scaleIn {
      0% {
        width: 0%;
        height: 0%;
        border-width: 0px;
        opacity: 0.5;
      }
      100% {
        width: 100%;
        height: 100%;
        opacity: 0;
        border-width: 2px;
      }
    }
  `);

  bokeh.style.animation = `${settings.animation.name} ${settings.animation
    .duration || 800}ms ${
    settings.animation.infinite ? "infinite" : settings.animation.type
  }`;

  if (!settings.animation.infinite) {
    setTimeout(() => {
      bokeh.remove();
      wrapper.remove();
    }, settings.animation.duration - 10);
  }

  return {
    stop: function() {
      bokeh.remove();
      wrapper.remove();
    },
  };
}

export default {
  bubble: bubble,
  outline: outline,
  pinpoint: pinpoint,
};
