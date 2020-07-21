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

function prog() {
    const anchor = '.prog'
    this.cloneAttributes = (source, target, exclude) => {
        if(!exclude){
            exclude = [];
        }
        for (let i = 0; i < source.attributes.length; i++) {
            if (!exclude.includes(source.attributes[i].name)) {
                target.setAttribute(source.attributes[i].name, source.attributes[i].value)
            }
        }
        return target;
    }

    this.fetch_retry = (url, options, n) => {
        return fetch(url, options).catch(function (error) {
            if (n === 1) throw error;
            return fetch_retry(url, options, n - 1);
        });
    }

    const elems = document.querySelectorAll(anchor);
    const header = document.getElementsByTagName("head")[0];
    const body = document.getElementsByTagName("body")[0];

    this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const t = entry.target,
                pIn = t.getAttribute('p-in'),
                pOut = t.getAttribute('p-out'),
                pActive = t.getAttribute('p-active');
            if (entry.intersectionRatio > 0) {
                if (!t.getAttribute('p-mem')) {
                    const tag = t.tagName
                    let e;
                    let placeholder;
                    switch (tag) {
                        case 'P-IMG':
                            placeholder = t.getAttribute('placeholder');
                            const placeholderStyle = t.getAttribute('placeholder-style');
                            const url = t.innerHTML;
                            e = document.createElement('img');
                            e = this.cloneAttributes(t, e, ['placeholder','placeholder-style']);
                            if(placeholder){
                                e.setAttribute('src', placeholder)
                            }
                            if(placeholderStyle){
                                e.setAttribute('style', t.getAttribute('style')+placeholderStyle)
                            }
                            t.innerHTML = ''
                            t.appendChild(e)

                            var final = new Image();
                            final = this.cloneAttributes(t, final, ['placeholder','placeholder-style']);
                            final.onload = function () {
                                t.removeChild(e);
                                t.appendChild(final)
                            }
                            final.src = url;

                            /*e = document.createElement('img');
                            e = this.cloneAttributes(t, e);
                            if (placeholder) {
                                e.setAttribute('src', placeholder)
                            }
                            t.innerHTML = ''
                            t.appendChild(e)

                            e.setAttribute('src', t.innerHTML.trim())*/

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
                            const src = t.innerHTML.trim()
                            placeholder = t.getAttribute('placeholder')
                            const retry = t.getAttribute('retry')
                            t.innerHTML = placeholder;
                            if (src) {
                                fetch_retry(src, {}, Number(retry))
                                    .then(response => response.text())
                                    .then(data => t.innerHTML = data).catch((e) => {
                                        console.log(e)
                                    })
                            }
                            break;
                    }
                    t.setAttribute('p-mem', true)
                }

                if (pIn) {
                    (new Function('return ' + pIn))()
                }

                if (!pActive) {
                    this.observer.unobserve(t);
                }
            } else {
                if (pOut) {
                    (new Function('return ' + pOut))()
                }
            }
        });
    });

    elems.forEach(el => {
        this.observer.observe(el);
    });

    return this;
}