var entryClassCarImage;
var devClassCarImage;
var devClassCarImageNats;
var carSlide = 0;

function debounce(fn, delay = 250) {
    let t;

    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

function preloadImages(basePath, count, suffix = '.webp') {
    for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = `${basePath}/${i}${suffix}`;
    }
}

function fillTrack(track) {
    const originals = Array.from(track.children);
    if (!originals.length) return;

    const itemWidth = originals[0].offsetWidth;
    if (!itemWidth) return;

    const requiredWidth = window.innerWidth * 2;
    let totalWidth = track.scrollWidth;

    const MAX_CLONES = 8;
    let clones = 0;

    while (totalWidth < requiredWidth && clones < MAX_CLONES) {
        originals.forEach(item => {
            track.appendChild(item.cloneNode(true));
        });

        totalWidth += originals.length * itemWidth;
        clones++;
    }
}

function createCarousel({ element, imagePath, imageCount, speed = 0.4 }) {
    const track = element.querySelector('.image-carousel-track');

    /* build slides */
    for (let i = 2; i <= imageCount; i++) {
        const item = document.createElement('div');
        item.className = 'carousel-item';

        const img = document.createElement('img');
        img.src = `${imagePath}/${i}-small.webp`;
        img.alt = `Carousel image ${i}`;

        item.appendChild(img);
        track.appendChild(item);
    }

    /* click -> full image */
    Array.from(track.children).forEach((item, i) => {
        item.addEventListener('click', () => {
            window.open(`${imagePath}/${i + 1}.jpg`, '_blank');
        });
    });

    /* safe fill */
    const safeFill = debounce(() => fillTrack(track), 300);
    requestAnimationFrame(safeFill);
    window.addEventListener('resize', safeFill);

    /* smooth motion */
    let x = 0;
    let velocity = 0;
    let targetVelocity = -speed;

    function animate() {
        velocity += (targetVelocity - velocity) * 0.08;
        x += velocity;

        const first = track.children[0];
        const w = first && first.offsetWidth;

        if (w && Math.abs(x) >= w) {
            track.appendChild(first);
            x += w;
        }

        track.style.transform = `translate3d(${x}px, 0, 0)`;
        requestAnimationFrame(animate);
    }

    animate();

    /* hover pause (smooth) */
    element.addEventListener('mouseenter', () => {
        targetVelocity = 0;
    });

    element.addEventListener('mouseleave', () => {
        targetVelocity = -speed;
    });

    /* touch support */
    let lastX = 0;

    element.addEventListener('touchstart', e => {
        lastX = e.touches[0].clientX;
        targetVelocity = 0;
    });

    element.addEventListener('touchmove', e => {
        const xNow = e.touches[0].clientX;
        const dx = xNow - lastX;
        lastX = xNow;

        x += dx;
        track.style.transform = `translate3d(${x}px, 0, 0)`;
    });

    element.addEventListener('touchend', () => {
        targetVelocity = -speed;
    });
}

function changeCar() {
    if (carSlide++ === 4) carSlide = 1;

    entryClassCarImage.style.backgroundImage =
        `url(../assets/img/entry-class-car/${carSlide}.webp)`;
    devClassCarImage.style.backgroundImage =
        `url(../assets/img/dev-class-car/${carSlide}.webp)`;
    devClassCarImageNats.style.backgroundImage =
        `url(../assets/img/dev-class-car/${carSlide}-nats.webp)`;

    setTimeout(changeCar, 5000);
}

window.addEventListener('load', () => {
    entryClassCarImage = document.getElementById('entry-class-car-image');
    devClassCarImage = document.getElementById('dev-class-car-image');
    devClassCarImageNats = document.getElementById('dev-class-car-image-nats');

    /* preload car images */
    preloadImages('../assets/img/entry-class-car', 4);
    preloadImages('../assets/img/dev-class-car', 4);
    preloadImages('../assets/img/dev-class-car', 4, '-nats.webp');

    /* carousels */
    const carousels = [
        {
            id: 'dev-class-2024_london-south-regionals',
            path: '../assets/img/our-journey/dev-class-2024_london-south-regionals',
            count: 6
        },
        {
            id: 'dev-class-2024_uk-nationals',
            path: '../assets/img/our-journey/dev-class-2024_uk-nationals',
            count: 11
        }
    ];

    carousels.forEach(c => {
        preloadImages(c.path, c.count, "-small.webp");
        createCarousel({
            element: document.getElementById(c.id),
            imagePath: c.path,
            imageCount: c.count
        });
    });

    changeCar();
});
