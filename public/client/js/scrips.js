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

// Initialize all handlers
function init() {
    handleNavbar();
    handleImgProduct();
    handleProductFilter();
    handlePaginationBtn();
}
document.addEventListener("DOMContentLoaded", init);
