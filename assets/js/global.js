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

window.addEventListener("load", function () {
	html = document.getElementsByTagName("html")[0];
	nav = document.getElementsByTagName("nav")[0];
	nav_links = nav.getElementsByTagName("ul")[0];
	copyright = document.getElementById("copyright");

	document.querySelector('.close-modal').addEventListener('click', () => {
		document.getElementById('social-modal').classList.remove('open');

		history.replaceState(null, '', window.location.pathname);
	});

	document.getElementById('social-modal').addEventListener('click', event => {
		if (event.target.id === 'social-modal') {
			document.getElementById('social-modal').classList.remove('open');
			history.replaceState(null, '', window.location.pathname);
		}
	});

	if (URL_PARSED.pathname.endsWith("/index.html")) {
		window.location.replace(URL_PARSED.origin);
	}

	setupNavbar();

	copyright.innerHTML = copyright.innerHTML.replace("{current_year}", new Date().getFullYear());
})

function checkForLinksHash() {
	const url = new URL(window.location.href);
	const params = url.searchParams;

	// Handle #l
	if (url.hash === '#l') {
		url.hash = '';
		params.set('show_links', 'true');
		window.history.replaceState({}, '', url.toString());
	}

	if (params.get('show_links') === 'true') {
		document.getElementById('social-modal')?.classList.add('open');
	}
}

document.addEventListener('DOMContentLoaded', checkForLinksHash);
