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
    const productDetailQuantityBtnPrev = document.getElementById(
        "product-detail__quantity-btn-prev"
    );
    const productDetailQuantityBtnNext = document.getElementById(
        "product-detail__quantity-btn-next"
    );
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

    if (productDetailQuantityBtnPrev) {
        productDetailQuantityBtnPrev.onclick = () => {
            const productDetail__quantity = document.getElementById(
                "product-detail__quantity-input"
            );
            if (productDetail__quantity.value > 1) {
                productDetail__quantity.value--;
            }
        };
    }
    if (productDetailQuantityBtnNext) {
        productDetailQuantityBtnNext.onclick = () => {
            const productDetail__quantity = document.getElementById(
                "product-detail__quantity-input"
            );
            const max = productDetail__quantity.getAttribute("max");
            if (parseInt(productDetail__quantity.value) < max) {
                productDetail__quantity.value++;
            }
        };
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
}
document.addEventListener("DOMContentLoaded", init);
