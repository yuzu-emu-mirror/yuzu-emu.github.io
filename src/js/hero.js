const navbar = document.getElementById('hero-navbar');
const navbarBaseColor = 'is-dark';

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            navbar.classList.add('is-freestanding');
            navbar.classList.add(navbarBaseColor);
        } else {
            navbar.classList.remove('is-freestanding');
            navbar.classList.remove(navbarBaseColor);
        }
    });
}

// Handle random switch colors
const colors = ["orangered", "deepskyblue", "yellow", "deeppink", "lime", "gray"];
document.getElementById('LeftJoy').classList.add("switch-" + colors[Math.floor(Math.random() * colors.length)]);
document.getElementById('RightJoy').classList.add("switch-" + colors[Math.floor(Math.random() * colors.length)]);