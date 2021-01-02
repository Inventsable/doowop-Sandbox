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

function getRealPos(opts, target) {
  if (!target)
    return {
      x: opts.position[0] - opts.width / 2,
      y: opts.position[1] - opts.height / 2,
    };
  else {
    console.log(target);
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

export default function(opts) {
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
  if (settings.elt.selector) {
    target = document
      .querySelector(settings.elt.selector)
      .getBoundingClientRect();
    settings.position[0] = target.left;
    settings.position[1] = target.top;
  }

  let realPos = getRealPos(settings, target);

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

  bokeh.style.animation = `scaleIn ${settings.animation.duration || 800}ms ${
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
