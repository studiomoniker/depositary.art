import { defineInterface } from '@directus/extensions-sdk';
import { openBlock, createElementBlock, Fragment, renderList, createElementVNode, normalizeStyle, createTextVNode, toDisplayString } from 'vue';

var script = {
	props: {
		value: {
			type: String,
			default: null,
		},
	},
	computed: {},
	emits: ['input'],
	setup(props) {
		console.log(Object.keys(props.value));
	},
};

const _hoisted_1 = { class: "overview" };

function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (openBlock(), createElementBlock("div", _hoisted_1, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(Object.keys($props.value), (item) => {
      return (openBlock(), createElementBlock("div", {
        key: item,
        class: "color"
      }, [
        createElementVNode("div", {
          class: "swatch",
          style: normalizeStyle({
					background: `rgb(${$props.value[item][0]}, ${$props.value[item][1]}, ${$props.value[item][2]})`,
				})
        }, null, 4 /* STYLE */),
        createTextVNode(" " + toDisplayString(item), 1 /* TEXT */)
      ]))
    }), 128 /* KEYED_FRAGMENT */))
  ]))
}

var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

var css = "\n.overview[data-v-64969d30] {\n\tdisplay: grid;\n\tgrid-template-columns: 1fr 1fr 1fr;\n}\n.swatch[data-v-64969d30] {\n\tdisplay: inline-block;\n\twidth: 20px;\n\theight: 20px;\n\tborder-radius: 5px;\n\tmargin-right: 5px;\n}\n.color[data-v-64969d30] {\n\tdisplay: flex;\n\talign-items: center;\n\tmargin-bottom: 5px;\n}\n";
n(css,{});

script.render = render;
script.__scopeId = "data-v-64969d30";
script.__file = "src/interface.vue";

console.log("interface");
var index = defineInterface({
  id: "palette",
  name: "Palette",
  icon: "palette",
  description: "Displays Vibrant palette of image",
  component: script,
  options: null,
  types: ["json", "text"]
});

export { index as default };
