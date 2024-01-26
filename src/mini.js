const mini = (() => {
    const routes = {};
    const render = (component, container = document.querySelector('#app')) => {
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', component.render().trim());
        component.afterRender?.();
    };
    const route = (path, component) => routes[path] = component;
    const router = () => {
        const component = routes[location.hash.slice(1) || '/'];
        if (component) render(component);
    };
    window.addEventListener('hashchange', router);
    window.addEventListener('load', router);
    return { render, route, router };
})();
export default mini;