
const RouteHelper = {
    onNavigate(pathname) {
        window.history.pushState(
            {},
            pathname,
            window.location.origin + pathname
        )
        this.pathname = pathname;
        this.component?.update();
    },
    onPopState(pathname) {
        this.pathname = pathname;
        this.component?.update();
    },
    register( component ) {
        this.component = component;
    }
}

window.onpopstate = () => {
    // rootDiv.innerHTML = routes[window.location.pathname]
    RouteHelper.onPopState(window.location.pathname);
}

module.exports = RouteHelper;
