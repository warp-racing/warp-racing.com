const NAV_LINKS = [
    { "name": "Home", "url": "/" },
    { "name": "Our Journey", "url": "/our-journey/" },
    { "name": "Sponsors", "url": "/sponsors/" },
]
const PAGE_URL = window.location.href;
const URL_PARSED = new URL(PAGE_URL);

var html;
var nav;
var nav_links;
var copyright;

function updateTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.dataset.theme = "dark";
    } else {
        html.dataset.theme = "light";
    }
}

function setupNavbar() {
    if (nav === null) {
        throw new Error("Navbar not found");
    }

    for (let i = 0; i < NAV_LINKS.length; i++) {
        let link = NAV_LINKS[i];

        let li = document.createElement("li");
        let a = document.createElement("a");

        a.href = link.url;
        a.innerText = link.name;
        a.setAttribute("data-umami-event", `Navbar; ${link.name}`)

        if (link.url == URL_PARSED.pathname) {
            a.id = "current";
        }

        li.appendChild(a);
        nav_links.appendChild(li);
    }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    updateTheme();
});

window.addEventListener("load", function () {
    html = document.getElementsByTagName("html")[0];
    nav = document.getElementsByTagName("nav")[0];
    nav_links = nav.getElementsByTagName("ul")[0];
    copyright = document.getElementById("copyright");

    if (URL_PARSED.pathname.endsWith("/index.html")) {
        window.location.replace(URL_PARSED.origin);
    }
    
    updateTheme();
    setupNavbar();

    copyright.innerHTML = copyright.innerHTML.replace("{current_year}", new Date().getFullYear());
})

function checkForLinksHash() {
  if (location.hash === '#links') {
    document.getElementById('social-modal').classList.add('open');
  }
}

document.addEventListener('DOMContentLoaded', checkForLinksHash);

document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('social-modal').classList.remove('open');
  history.replaceState(null, '', location.pathname);
});

document.getElementById('social-modal').addEventListener('click', e => {
  if (e.target.id === 'social-modal') {
    document.getElementById('social-modal').classList.remove('open');
    history.replaceState(null, '', location.pathname);
  }
});