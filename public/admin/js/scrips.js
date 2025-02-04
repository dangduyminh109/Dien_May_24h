const searchBox = document.querySelectorAll(".search-box");
const searchIcon = document.querySelectorAll(".search__icon");
const searchCloseIcon = document.querySelectorAll(".search-box__close-icon");
const screenIconExpand = document.querySelectorAll(".screen__icon--expand");
const screenIconCompress = document.querySelectorAll(".screen__icon--compress");
const toggleNav = document.getElementById("toggle__nav");
const navbar = document.getElementById("navbar");
const rightBoxBtnDropdown = document.getElementById("right-box__btn-dropdown");
const rightBox = document.getElementById("right-box");
const main = document.getElementById("main");
const filterBtn = document.getElementById("filter-btn");
const toolbarFilterBox = document.getElementById("toolbar__filter-box");

/* ======================================= admin header ======================================= */
/* ============ left box =========== */
// search box
searchIcon.forEach((element) => {
    element.onclick = () => {
        searchBox.forEach((element) => {
            if (element.classList.contains("active")) {
                console.log("ok");
            } else {
                element.classList.add("active");
            }
        });
    };
});

searchCloseIcon.forEach((element) => {
    element.onclick = () => {
        searchBox.forEach((element) => {
            element.classList.remove("active");
        });
    };
});

// screen btn
screenIconExpand.forEach((element) => {
    element.onclick = () => {
        screenIconCompress.forEach((element) => {
            element.classList.add("active");
        });
        screenIconExpand.forEach((element) => {
            element.classList.remove("active");
        });
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    };
});

if (screenIconCompress) {
    screenIconCompress.forEach((element) => {
        element.onclick = () => {
            screenIconExpand.forEach((element) => {
                element.classList.add("active");
            });
            screenIconCompress.forEach((element) => {
                element.classList.remove("active");
            });
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
        };
    });
}

// toggle navbar
toggleNav.onclick = () => {
    if (toggleNav.checked) {
        toggleNav.checked = true;
        navbar.style.transform = "translateX(0)";
        if (main.offsetWidth > 575.98) {
            main.style.padding = "103px 30px 20px 280px";
        }
    } else {
        toggleNav.checked = false;
        navbar.style.transform = "translateX(-100%)";
        if (main.offsetWidth > 575.98) {
            main.style.padding = "103px 30px 20px";
        }
    }
};
// right box dropdown btn
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

/* ======================================= main ======================================= */
if (filterBtn) {
    filterBtn.onclick = () => {
        if (toolbarFilterBox.style.height == "100%") {
            toolbarFilterBox.style.height = "0";
            return;
        }
        toolbarFilterBox.style.height = "100%";
    };
}
/* ============ upload file =========== */
const imageGroup = document.getElementById("image-group");
const uploadFile = document.querySelector("input[type='file']");
const MAX_IMAGES = 10;
if (uploadFile) {
    uploadFile.onchange = (e) => {
        var files = [...uploadFile.files];
        if (files.length == 0) return;
        if (files.length > MAX_IMAGES) {
            alert(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh!`);
            files = files.slice(0, MAX_IMAGES);
        }
        files.forEach((file) => {
            var thumbnailPreview = document.createElement("div");
            var imgPreview = document.createElement("img");
            var closeIcon = document.createElement("span");
            imgPreview.src = URL.createObjectURL(file);

            closeIcon.classList.add("image__close-icon");

            closeIcon.innerHTML += `<i
                class="fa-solid fa-circle-xmark"
                style="
                    background-color: #fff;
                    border-radius: 50%;
                    display: block;
                "
            ></i>`;

            thumbnailPreview.append(imgPreview, closeIcon);
            thumbnailPreview.classList.add("image-group__preview");

            // Giải phóng bộ nhớ sau khi ảnh load xong
            imgPreview.onload = () => URL.revokeObjectURL(imgPreview.src);

            imageGroup.prepend(thumbnailPreview);
            closeIcon.onclick = (e) => {
                e.target.closest(".image-group__preview").remove();
            };
        });
    };
}

/* ============ box =========== */
/* ======================================= block ======================================= */
if (window.matchMedia("(max-width: 575.98px)").matches) {
    toggleNav.checked = false;
    navbar.style.transform = "translateX(-100%)";
}
window.addEventListener("resize", () => {
    if (window.matchMedia("(max-width: 575.98px)").matches) {
        toggleNav.checked = false;
        navbar.style.transform = "translateX(-100%)";
    } else {
        toggleNav.checked = true;
        navbar.style.transform = "translateX(0)";
    }
});
