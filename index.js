// mini.js
const mini = (() => {
    const routes = {};
    let currentComponent = null;
    const globalState = {};

    const createVNode = (html) => {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild || document.createTextNode('');
    };

    const updateElement = (parent, newNode, oldNode, index = 0) => {
        if (!oldNode && newNode) {
            parent.appendChild(newNode);
        } else if (oldNode && !newNode) {
            if (parent.childNodes[index]) {
                parent.removeChild(parent.childNodes[index]);
            }
        } else if (newNode && oldNode && changed(newNode, oldNode)) {
            parent.replaceChild(newNode, parent.childNodes[index]);
        } else if (newNode && oldNode && newNode.nodeType === Node.ELEMENT_NODE) {
            updateAttributes(oldNode, newNode);
            const maxLength = Math.max(newNode.childNodes.length, oldNode.childNodes.length);
            for (let i = 0; i < maxLength; i++) {
                updateElement(oldNode, newNode.childNodes[i], oldNode.childNodes[i], i);
            }
        }
    };

    const updateAttributes = (oldNode, newNode) => {
        const oldAttributes = oldNode.attributes;
        const newAttributes = newNode.attributes;
        for (let i = 0; i < newAttributes.length; i++) {
            const attrName = newAttributes[i].name;
            const attrValue = newAttributes[i].value;
            if (oldNode.getAttribute(attrName) !== attrValue) {
                oldNode.setAttribute(attrName, attrValue);
            }
        }
        for (let i = 0; i < oldAttributes.length; i++) {
            const attrName = oldAttributes[i].name;
            if (!newNode.hasAttribute(attrName)) {
                oldNode.removeAttribute(attrName);
            }
        }
    };

    const changed = (node1, node2) => {
        return typeof node1 !== typeof node2 ||
            node1.nodeType === Node.TEXT_NODE && node1.textContent !== node2.textContent ||
            node1.nodeName !== node2.nodeName;
    };

    const renderComponent = (component) => {
        component.beforeRender?.();
        const newVNode = createVNode(component.render());
        const container = document.querySelector('#app');
        const oldVNode = container.childNodes[0];
        if (!currentComponent) {
            container.appendChild(newVNode);
        } else {
            updateElement(container, newVNode, oldVNode);
        }
        currentComponent = component;
        component.afterRender?.();
    };

    const route = (path, component) => {
        routes[path] = component;
    };

    const router = () => {
        const path = location.hash.slice(1) || '/';
        const component = routes[path];
        if (component && component !== currentComponent) {
            currentComponent?.beforeDestroy?.();
            renderComponent(component);
        }
    };

    const linkHandler = (e) => {
        const link = e.target.closest('a[data-route]');
        if (link) {
            e.preventDefault();
            history.pushState(null, '', link.href);
            router();
        }
    };

    const setState = (newState) => {
        Object.assign(globalState, newState);
        router();
    };
    
    const getState = () => globalState;
    document.addEventListener('click', linkHandler);
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
    return { route, router, setState, getState };
})();

export default mini;