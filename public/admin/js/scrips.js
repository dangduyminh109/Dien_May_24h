const searchBox = document.getElementById("search-box");
const searchIcon = document.getElementById("search__icon");
const searchCloseIcon = document.getElementById("search-box__close-icon");
const screenIconExpand = document.getElementById("screen__icon--expand");
const screenIconCompress = document.getElementById("screen__icon--compress");

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
/* ============ right box =========== */




/* ============ box =========== */
/* ======================================= block ======================================= */ 