window.addEventListener("DOMContentLoaded", () => {
    const ROOT = document.getElementById("root");
    
    /**
     *
     * @param {Structure} page
     */
    function renderPage(page) {
        ROOT.innerHTML = "";
        ROOT.appendChild(page.build().getElement());
    }
    
    renderPage(mainPage);
}, {once: true});