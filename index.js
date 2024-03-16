// synergy.js
const Synergy = (() => {
    const routes = {};
    let currentComponent = null;
    const globalState = {};

    const createElement = (html) => {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild || document.createTextNode('');
    };

    const updateDOM = (parent, newComponent, oldComponent, index = 0) => {
        if (!oldComponent && newComponent) {
            parent.appendChild(createElement(newComponent.render()));
        } else if (oldComponent && !newComponent) {
            if (parent.childNodes[index]) {
                parent.removeChild(parent.childNodes[index]);
            }
        } else if (newComponent && oldComponent && hasChanged(newComponent, oldComponent)) {
            parent.replaceChild(createElement(newComponent.render()), parent.childNodes[index]);
        } else if (newComponent && oldComponent) {
            const maxLength = Math.max(newComponent.children.length, oldComponent.children.length);
            for (let i = 0; i < maxLength; i++) {
                updateDOM(oldComponent, newComponent.children[i], oldComponent.children[i], i);
            }
        }
    };

    const hasChanged = (component1, component2) => {
        return component1.type !== component2.type;
    };

    const render = (component, containerId) => {
        const container = document.querySelector(containerId || '#app');
        const oldComponent = currentComponent;
        if (!oldComponent) {
            container.appendChild(createElement(component.render()));
        } else {
            updateDOM(container, component, oldComponent);
        }
        currentComponent = component;
    };

    const route = (path, component) => {
        routes[path] = component;
    };

    const router = () => {
        const path = location.hash.slice(1) || '/';
        const component = routes[path];
        if (component && component !== currentComponent) {
            render(component);
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

    return { createElement, render, route, router, setState, getState };
})();

export default Synergy;