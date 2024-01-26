
const mini = (() => {
    const routes = {};
    const renderComponent = (component) => {
        const template = document.createElement('template');
        template.innerHTML = component.render().trim();
        return template.content.firstChild;
    };

    const render = (component, container) => {
        const element = renderComponent(component);
        container.innerHTML = '';
        container.appendChild(element);
        if (component.afterRender) {
            component.afterRender();
        }
    };

    const route = (path, component) => {
        routes[path] = component;
    };

    const router = () => {
        const path = location.hash.slice(1) || '/';
        const component = routes[path];
        if (component) {
            render(component, document.querySelector('#app'));
        }
    };

    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);

    return { render, route, router };
})();

export default mini;