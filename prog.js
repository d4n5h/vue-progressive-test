// Create custom elements
function link() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}
link.prototype = Object.create(HTMLElement.prototype);
link.prototype.constructor = link;
Object.setPrototypeOf(link, HTMLElement);

link.prototype.connectedCallback = function () {

    const shadow = this.attachShadow({ mode: 'open' });
    this.setAttribute('class', 'prog')
};

function script() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}
script.prototype = Object.create(HTMLElement.prototype);
script.prototype.constructor = script;
Object.setPrototypeOf(script, HTMLElement);

script.prototype.connectedCallback = function () {

    const shadow = this.attachShadow({ mode: 'open' });
    this.setAttribute('class', 'prog')
};

function img() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}
img.prototype = Object.create(HTMLElement.prototype);
img.prototype.constructor = img;
Object.setPrototypeOf(img, HTMLElement);

img.prototype.connectedCallback = function () {
    this.setAttribute('class', 'prog')
};

function content() {
    return Reflect.construct(HTMLElement, [], this.constructor);
}
content.prototype = Object.create(HTMLElement.prototype);
content.prototype.constructor = content;
Object.setPrototypeOf(content, HTMLElement);

content.prototype.connectedCallback = function () {
    this.setAttribute('class', 'prog')
};
customElements.define('p-link', link);
customElements.define('p-script', script);
customElements.define('p-img', img);
customElements.define('p-content', content);


function prog(anchor) {
    this.cloneAttributes = (source, target) => {
        for (let i = 0; i < source.attributes.length; i++) {
            target.setAttribute(source.attributes[i].name, source.attributes[i].value)
        }
        return target;
    }

    const elems = document.querySelectorAll(anchor);
    const header = document.getElementsByTagName("head")[0];
    const body = document.getElementsByTagName("body")[0];
    const prog_style = document.createElement('style');
    prog_style.setAttribute('id', 'prog_style');
    header.appendChild(prog_style);
    const generalStyle = document.getElementById('prog_style');

    observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const t = entry.target,
                pIn = t.getAttribute('p-in'),
                pOut = t.getAttribute('p-out'),
                pActive = t.getAttribute('p-active');
            if (entry.intersectionRatio > 0) {
                if (!t.getAttribute('p-mem')) {
                    const tag = t.tagName
                    let e;
                    switch (tag) {
                        case 'P-IMG':
                            e = document.createElement('img');
                            e = this.cloneAttributes(t, e)
                            t.appendChild(e)
                            break;
                        case 'P-LINK':
                            e = document.createElement('link');
                            elem = this.cloneAttributes(t, e)
                            header.appendChild(e)
                            break;
                        case 'P-SCRIPT':
                            e = document.createElement('script');
                            e = this.cloneAttributes(t, e)
                            e.innerHTML = t.innerHTML;
                            body.appendChild(e)
                            break;
                        case 'P-CONTENT':
                            const src = t.getAttribute('src');
                            if (src) {
                                fetch(src)
                                    .then(response => response.text())
                                    .then(data => t.innerHTML = data);
                            }
                            break;
                    }
                    t.setAttribute('p-mem', true)
                }

                if (pIn) {
                    (new Function('return ' + pIn))()
                }

                if (!pActive) {
                    observer.unobserve(t);
                }
            } else {
                if (pOut) {
                    (new Function('return ' + pOut))()
                }
            }
        });
    });

    elems.forEach(el => {
        observer.observe(el);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    prog('.prog')
});
