const searchBox = document.getElementById("search-box");
const searchIcon = document.getElementById("search__icon");
const searchCloseIcon = document.getElementById("search-box__close-icon");
const screenIconExpand = document.getElementById("screen__icon--expand");
const screenIconCompress = document.getElementById("screen__icon--compress");
const toggleNav = document.getElementById("toggle__nav");
const navbar = document.getElementById("navbar");
const rightBoxBtnDropdown = document.getElementById("right-box__btn-dropdown");
const rightBox = document.getElementById("right-box");

/* ======================================= admin header ======================================= */
/* ============ left box =========== */
// search box
searchIcon.onclick = () => {
    if (searchBox.classList.contains("active")) {
        console.log("ok");
    } else {
        searchBox.classList.add("active");
    }
};
searchCloseIcon.onclick = () => {
    searchBox.classList.remove("active");
};

// screen btn
screenIconExpand.onclick = () => {
    screenIconExpand.classList.remove("active");
    screenIconCompress.classList.add("active");
};
screenIconCompress.onclick = () => {
    screenIconExpand.classList.add("active");
    screenIconCompress.classList.remove("active");
};

toggleNav.onclick = () => {
    if (toggleNav.checked) {
        toggleNav.checked = true;
        navbar.style.transform = "translateX(0)";
    } else {
        toggleNav.checked = false;
        navbar.style.transform = "translateX(-100%)";
    }
};

rightBoxBtnDropdown.onclick = () => {
    if (rightBoxBtnDropdown.classList.contains("active")) {
        rightBoxBtnDropdown.classList.remove("active");
        rightBox.style.top = "0";
    } else {
        rightBoxBtnDropdown.classList.add("active");
        rightBox.style.top = "80px";
    }
};
/* ============ right box =========== */
/* ======================================= nav ======================================= */
const navigationItemBtn = document.getElementById("navigation-item__btn");

navigationItemBtn.onclick = () => {
    if (navigationItemBtn.classList.contains("active")) {
        navigationItemBtn.classList.remove("active");
    } else {
        navigationItemBtn.classList.add("active");
    }
};

/* ============ box =========== */
/* ======================================= block ======================================= */
