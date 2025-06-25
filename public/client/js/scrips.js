function handleNavbar() {
    const category_btn__prev = document.getElementById("category-btn__prev");
    const category_btn__next = document.getElementById("category-btn__next");
    const category = document.getElementById("category");
    const list_category = document.getElementById("list-category");
    const categoryBtn = document.getElementById("category-group-btn");

    let currentPosition = 0;
    let step = 200;

    if (category) {
        if (category.offsetWidth < list_category.scrollWidth) {
            categoryBtn.style.display = "flex";
        } else {
            categoryBtn.style.display = "none";
        }
    }
    if (category_btn__next) {
        category_btn__next.onclick = () => {
            if (
                list_category.scrollWidth +
                    currentPosition -
                    category.offsetWidth >=
                200
            ) {
                currentPosition -= step;
                list_category.style.transform = `translateX(${currentPosition}px)`;
            } else if (
                list_category.scrollWidth +
                    currentPosition -
                    category.offsetWidth >=
                0
            ) {
                var remainder =
                    list_category.scrollWidth +
                    currentPosition -
                    category.offsetWidth;
                currentPosition -= remainder;
                list_category.style.transform = `translateX(${currentPosition}px)`;
            }
        };
    }
    if (category_btn__prev) {
        category_btn__prev.onclick = () => {
            if (currentPosition <= -200) {
                currentPosition += step;
                list_category.style.transform = `translateX(${currentPosition}px)`;
            } else if (currentPosition < 0) {
                currentPosition = 0;
                list_category.style.transform = `translateX(${currentPosition}px)`;
            }
        };
    }
}

function handleImgProduct() {
    const thumbnails = document.querySelectorAll(".product-detail__thumb");
    const carouselItem = document.querySelectorAll(".carousel-item");
    const carousel = document.querySelector(
        "#product-detail__img-preview-carousel"
    );

    if (thumbnails) {
        thumbnails.forEach((thumb) => {
            thumb.onclick = () => {
                thumbnails.forEach((thumb) => {
                    thumb.classList.remove("active");
                });
                thumb.classList.add("active");
                const carouselIndicators =
                    document.querySelectorAll(".carousel-item");

                carouselIndicators.forEach((indicator) => {
                    if (indicator.firstChild.src === thumb.firstChild.src) {
                        carouselIndicators.forEach((indicator) => {
                            indicator.classList.remove("active");
                        });
                        indicator.classList.add("active");
                    }
                });
            };
        });
    }

    if (carousel) {
        carousel.addEventListener("slid.bs.carousel", () => {
            carouselItem.forEach((item) => {
                if (item.classList.contains("active")) {
                    const src = item.firstChild.src;
                    thumbnails.forEach((thumb) => {
                        if (thumb.firstChild.src === src) {
                            thumbnails.forEach((thumb) => {
                                thumb.classList.remove("active");
                            });
                            thumb.classList.add("active");
                            return;
                        }
                    });
                }
            });
        });
    }
}

/* ============ handle quantity control =========== */
function handleQuantityControl() {
    const quantityControls = document.querySelectorAll(".quantity-control");
    if (quantityControls) {
        quantityControls.forEach((item) => {
            const quantityControlBtnDecrease = item.querySelector(
                ".quantity-control__btn--decrease"
            );
            const quantityControlBtnIncrease = item.querySelector(
                ".quantity-control__btn--increase"
            );
            const quantityControlInput = item.querySelector(
                ".quantity-control__input"
            );
            quantityControlBtnDecrease.onclick = () => {
                if (quantityControlInput.value > 1) {
                    quantityControlInput.value--;
                }
                const parentNode = item.closest(".order-item__content");
                if (parentNode) {
                    const priceText =
                        parentNode.querySelector(".order-item__price");
                    priceText.innerHTML = `${(
                        parseInt(priceText.getAttribute("data-price")) *
                        quantityControlInput.value
                    ).toLocaleString("vi-VN")}đ`;
                    // Update total price
                    const total = document.getElementById("total__price");
                    const priceItems =
                        document.querySelectorAll(".order-item__price");
                    let totalPrice = 0;
                    priceItems.forEach((price) => {
                        const quantity = price
                            .closest(".order-item__content")
                            .querySelector(".quantity-control__input");
                        totalPrice +=
                            parseInt(price.getAttribute("data-price")) *
                            quantity.value;
                    });
                    total.innerHTML = `${totalPrice.toLocaleString("vi-VN")}đ`;
                }
            };
            quantityControlBtnIncrease.onclick = () => {
                quantityControlInput.value++;
                const parentNode = item.closest(".order-item__content");
                if (parentNode) {
                    const priceText =
                        parentNode.querySelector(".order-item__price");
                    priceText.innerHTML = `${(
                        parseInt(priceText.getAttribute("data-price")) *
                        quantityControlInput.value
                    ).toLocaleString("vi-VN")}đ`;

                    // Update total price
                    const total = document.getElementById("total__price");
                    const priceItems =
                        document.querySelectorAll(".order-item__price");
                    let totalPrice = 0;
                    priceItems.forEach((price) => {
                        const quantity = price
                            .closest(".order-item__content")
                            .querySelector(".quantity-control__input");
                        totalPrice +=
                            parseInt(price.getAttribute("data-price")) *
                            quantity.value;
                    });
                    total.innerHTML = `${totalPrice.toLocaleString("vi-VN")}đ`;
                }
            };
        });
    }
}

/* ============ handle Product Filter =========== */

function handleProductFilter() {
    const productCategoryFilterSelect = document.getElementById(
        "product-category__filter__select"
    );
    if (productCategoryFilterSelect) {
        productCategoryFilterSelect.onchange = () => {
            const form = productCategoryFilterSelect.closest("form");
            form.submit();
        };
    }
}

/* ============ handle Pagination Btn =========== */
function handlePaginationBtn() {
    const btnPrev = document.getElementById("btn-prev");
    const btnNext = document.getElementById("btn-next");
    const paginationBtn = document.getElementById("pagination-btn");
    if (paginationBtn) {
        let numberOfPage = parseInt(
            paginationBtn.getAttribute("number-of-page")
        );
        let currentPage = parseInt(paginationBtn.getAttribute("current-page"));
        let currentPath = paginationBtn.getAttribute("current-path");
        if (currentPage == 1) {
            btnPrev.closest(".page-item").classList.add("disable");
        } else {
            btnPrev.closest(".page-item").classList.remove("disable");
        }
        if (currentPage == numberOfPage) {
            btnNext.closest(".page-item").classList.add("disable");
        } else {
            btnNext.closest(".page-item").classList.remove("disable");
        }
        btnNext.onclick = () => {
            if (currentPage + 1 <= numberOfPage) {
                window.location.href = `${currentPath}page=${currentPage + 1}`;
            }
        };
        btnPrev.onclick = () => {
            if (currentPage - 1 >= 1) {
                window.location.href = `${currentPath}page=${currentPage - 1}`;
            }
        };
    }
}

function handleSearch() {
    const searchBoxInput = document.getElementById("search-box__input");
    if (searchBoxInput) {
        const suggestBox = document.getElementById("search-box__suggest");
        const searchResetBtn = document.getElementById(
            "search-box__btn--reset"
        );
        let debouncedTimeout = null;
        document.addEventListener("click", (e) => {
            if (
                !searchBoxInput.contains(e.target) &&
                !suggestBox.contains(e.target)
            ) {
                suggestBox.style.display = "none";
            }
        });
        searchBoxInput.onfocus = () => {
            const suggestList = suggestBox.getElementsByTagName("ul")[0];
            if (suggestList.children.length !== 0) {
                suggestBox.style.display = "block";
            }
        };
        searchResetBtn.onclick = () => {
            searchBoxInput.value = "";
            suggestBox.style.display = "none";
            const suggestList = suggestBox.getElementsByTagName("ul")[0];
            suggestList.innerHTML = "";
            searchBoxInput.focus();
        };

        searchBoxInput.onkeyup = (e) => {
            if (debouncedTimeout) {
                clearTimeout(debouncedTimeout);
            }
            if (e.key === "Enter" || searchBoxInput.value.trim() === "") {
                suggestBox.style.display = "none";
                return;
            }
            debouncedTimeout = setTimeout(async () => {
                searchResetBtn.firstChild.innerHTML =
                    "<i class='fa-solid fa-spinner'></i>";
                searchResetBtn.classList.add("active");
                searchResetBtn.disabled = true;

                await fetch(
                    `/product/suggest?keyword=${searchBoxInput.value}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                )
                    .then((res) => res.json())
                    .then((data) => {
                        const suggestList =
                            suggestBox.getElementsByTagName("ul")[0];
                        suggestList.innerHTML = "";
                        if (data.length === 0) {
                            suggestBox.firstChild.textContent =
                                "Không có sản phẩm nào";
                            suggestList.style.display = "none";
                        } else {
                            data.forEach((item) => {
                                suggestList.innerHTML += `
                                    <li class="suggest-item">
                                        <a href="/product/detail/${
                                            item.slug
                                        }" class="suggest-item__link">
                                            <div class="suggest-item__wrapper">
                                                <div class="suggest-item__thumbnail">
                                                    <img class="suggest-item__img" src="${
                                                        item.thumbnails[0]
                                                    }" alt="${item.name}">
                                                </div>
                                                <div class="suggest-item__desc">
                                                    <h4 class="suggest-item__title">
                                                        ${item.name}
                                                    </h4>
                                                    <div class="suggest-item__price-group">
                                                        <span class="suggest-item__price">${item.price.toLocaleString(
                                                            "vi-VN"
                                                        )}</span>
                                                        <span class="suggest-item__original-price">${item.price.toLocaleString(
                                                            "vi-VN"
                                                        )}</span>
                                                        <strong class="suggest-item__discount">(-${
                                                            item.discount
                                                        }%)</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                `;
                                suggestBox.firstChild.textContent =
                                    "Gợi ý tìm kiếm";
                                suggestBox.style.display = "block";
                                suggestBox.firstChild.style.display = "block";
                                suggestList.style.display = "block";
                            });
                        }
                    });
                searchResetBtn.firstChild.innerHTML =
                    "<i class='fa-solid fa-xmark'></i>";
                searchResetBtn.classList.remove("active");
                searchResetBtn.disabled = false;
            }, 500);
        };
    }
}

async function handleAuth() {
    const passwordIcon = document.querySelectorAll(".password__icon");
    if (passwordIcon) {
        passwordIcon.forEach((element) => {
            element.onclick = () => {
                const passwordInput = element
                    .closest(".password__group")
                    .querySelector("input");
                if (passwordInput.type === "password") {
                    passwordInput.type = "text";
                    element.firstChild.classList.remove("fa-eye-slash");
                    element.firstChild.classList.add("fa-eye");
                } else {
                    passwordInput.type = "password";
                    element.firstChild.classList.remove("fa-eye");
                    element.firstChild.classList.add("fa-eye-slash");
                }
            };
        });
    }

    const registerLinkBtn = document.getElementById("register-link__btn");
    const loginLinkBtnRegister = document.getElementById(
        "login-link__btn--register"
    );
    const loginLinkBtnForgot = document.getElementById(
        "login-link__btn--forgot"
    );
    const forgotLinkBtn = document.getElementById("forgot-link__btn");
    if (
        registerLinkBtn &&
        loginLinkBtnRegister &&
        forgotLinkBtn &&
        loginLinkBtnForgot
    ) {
        const auth = document.getElementById("auth");
        loginLinkBtnRegister.onclick = () => {
            auth.style.transform = "translateX(calc(-200% / 3))";
        };
        registerLinkBtn.onclick = () => {
            auth.style.transform = "translateX(calc(-100% / 3))";
        };
        forgotLinkBtn.onclick = () => {
            auth.style.transform = "translateX(calc(-100% / 3))";
        };
        loginLinkBtnForgot.onclick = () => {
            auth.style.transform = "translateX(0)";
        };
    }

    const authFrom = document.querySelectorAll(".authForm");
    if (authFrom) {
        authFrom.forEach((item) => {
            const inputData = item.querySelectorAll("input");
            inputData.forEach((input) => {
                input.onkeyup = () => {
                    if (input.value.trim() != "") {
                        input.classList.remove("error");
                        if (
                            input.name !== "password" &&
                            input.name !== "passwordConfirm"
                        ) {
                            input.nextElementSibling.style.visibility =
                                "hidden";
                        } else {
                            input.parentNode.nextElementSibling.style.visibility =
                                "hidden";
                        }
                    }
                };
            });
        });
    }

    const btnSubmit = document.querySelectorAll(".btn-submit-auth");
    if (btnSubmit) {
        btnSubmit.forEach((item) => {
            item.onclick = async (e) => {
                const form = item.closest("form");
                const inputData = form.querySelectorAll("input");
                inputData.forEach((input) => {
                    if (input.value.trim() === "") {
                        e.preventDefault();
                        input.classList.add("error");
                        if (
                            input.name !== "password" &&
                            input.name !== "passwordConfirm"
                        ) {
                            input.nextElementSibling.style.visibility =
                                "visible";
                        } else {
                            input.parentNode.nextElementSibling.style.visibility =
                                "visible";
                        }
                    }
                    if (
                        (input.name === "password" ||
                            input.name === "passwordConfirm") &&
                        input.value.length < 8
                    ) {
                        e.preventDefault();
                        alert("error", "Mật khẩu phải có ít nhất 8 kí tự!!!");
                        input.classList.add("error");
                    }
                });
                const passwordInput = form.querySelectorAll(
                    "input[type=password]"
                );
                if (
                    passwordInput.length == 2 &&
                    passwordInput[0].value !== passwordInput[1].value
                ) {
                    e.preventDefault();
                    alert(
                        "error",
                        "Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại."
                    );
                    passwordInput[1].classList.add("error");
                }
            };
        });
    }

    const btnConfirm = document.querySelectorAll(".btn-confirm");
    if (btnConfirm) {
        btnConfirm.forEach((btn) => {
            btn.onclick = async () => {
                const form = btn.closest("form");
                const inputEmail = form.querySelector("input[type=email]");
                let isValid = true;
                if (inputEmail && inputEmail.value.trim() === "") {
                    isValid = false;
                    inputEmail.classList.add("error");
                    inputEmail.nextElementSibling.style.visibility = "visible";
                }
                if (isValid) {
                    const emailInput = form.querySelector(".email");
                    await fetch(`/auth/verify`, {
                        method: "post",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: emailInput.value,
                            isForgot:
                                emailInput.getAttribute("isForgot") === "true",
                        }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                alert("success", data.message);
                                btn.disabled = true;
                                let seconds = 60 * 3;
                                let time = setInterval(() => {
                                    var minutes = Math.floor(seconds / 60);
                                    var second = String(
                                        Math.floor(seconds-- - minutes * 60)
                                    ).padStart(2, "0");
                                    btn.innerText = `gửi mã(${minutes}:${second})`;
                                    if (seconds <= 0) {
                                        btn.innerText = "Gửi mã";
                                        btn.disabled = false;
                                        clearInterval(time);
                                    }
                                }, 1000);
                            } else if (data.minutesLeft) {
                                alert("error", data.message);
                                btn.disabled = true;
                                let seconds = data.minutesLeft;
                                let time = setInterval(() => {
                                    var minutes = Math.floor(seconds / 60);
                                    var second = String(
                                        Math.floor(seconds-- - minutes * 60)
                                    ).padStart(2, "0");
                                    btn.innerText = `gửi mã(${minutes}:${second})`;
                                    if (seconds <= 0) {
                                        btn.innerText = "Gửi mã";
                                        btn.disabled = false;
                                        clearInterval(time);
                                    }
                                }, 1000);
                            } else {
                                alert(
                                    "error",
                                    data.message || "Có lỗi xảy ra!"
                                );
                            }
                            return data;
                        })
                        .then((data) => {
                            if (data.reload) {
                                window.location.reload();
                            }
                        })
                        .catch((err) => {
                            alert("error", "Không thể kết nối đến server!");
                            console.log("Lỗi Fetch API:", err);
                        });
                }
            };
        });
    }
}
/* ============ handle Add Quantity =========== */
function handleAddQuantity() {
    const submitBtn = document.querySelectorAll(".product-detail__btn");
    submitBtn.forEach((element) => {
        element.onclick = (e) => {
            e.preventDefault();
            const quantity = document.getElementById("quantity-control__input");
            const form = e.target.closest("form");
            const quantityInput = form.querySelector("input[name='quantity']");
            const quantityValue = parseInt(quantity.value);
            if (quantityValue < 1) {
                quantityInput.value = 1;
            } else {
                quantityInput.value = quantityValue;
            }
            form.submit();
        };
    });
}
/* ============ alert =========== */
function alert(type = "success", message) {
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert-container", type);
    let icon = `<i class="fa-solid fa-circle-info"></i>`;
    if (type == "error") {
        icon = `<i class="fa-solid fa-bug"></i>`;
    } else if (type == "warning") {
        icon = `<i class="fa-solid fa-triangle-exclamation"></i>`;
    }
    alertDiv.innerHTML = `
                            <span class="alert-icon">
                                ${icon}
                            </span>
                            <p class="alert-content">${message}</p>
                            <span class="alert-icon-close">
                                <i class="fa-solid fa-xmark"></i>
                            </span>
                        `;
    document.querySelector("body").appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.classList.add("active");
        alertDiv.querySelector(".alert-icon-close").onclick = () => {
            alertDiv.classList.remove("active");
        };
        setTimeout(() => {
            alertDiv.classList.remove("active");
        }, 5000);

        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 7000);
    }, 100);
}

function handleDOMContentLoaded() {
    const searchBoxInput = document.getElementById("search-box__input");
    if (searchBoxInput) {
        searchBoxInput.value = searchBoxInput.getAttribute("searchValue");
    }
}
// Initialize all handlers
function init() {
    handleDOMContentLoaded();
    handleNavbar();
    handleImgProduct();
    handleProductFilter();
    handlePaginationBtn();
    handleSearch();
    handleAuth();
    handleQuantityControl();
    handleAddQuantity();
}
document.addEventListener("DOMContentLoaded", init);
