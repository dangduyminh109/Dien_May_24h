const PATH_ADMIN = "/admin";

/* ======================================= admin header ======================================= */
/* ============ left box =========== */
// search box
function handleSearchBox() {
    const searchBox = document.querySelectorAll(".search-box");
    const searchIcon = document.querySelectorAll(".search__icon");
    const searchCloseIcon = document.querySelectorAll(
        ".search-box__close-icon"
    );

    searchIcon.forEach((element) => {
        element.onclick = () => {
            searchBox.forEach((element) => {
                if (!element.classList.contains("active")) {
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
}

// screen btn
function handleScreenButtons() {
    const screenIconExpand = document.querySelectorAll(".screen__icon--expand");
    const screenIconCompress = document.querySelectorAll(
        ".screen__icon--compress"
    );

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
function handleToggleNav() {
    const toggleNav = document.getElementById("toggle__nav");
    const navbar = document.getElementById("navbar");
    const main = document.getElementById("main");

    toggleNav.onclick = () => {
        if (toggleNav.checked) {
            navbar.style.transform = "translateX(0)";
            if (main.offsetWidth > 575.98) {
                main.style.padding = "103px 30px 20px 280px";
            }
        } else {
            navbar.style.transform = "translateX(-100%)";
            if (main.offsetWidth > 575.98) {
                main.style.padding = "103px 30px 20px";
            }
        }
    };
}

// right box dropdown btn
function handleRightBoxDropdown() {
    const rightBoxBtnDropdown = document.getElementById(
        "right-box__btn-dropdown"
    );
    const rightBox = document.getElementById("right-box");

    rightBoxBtnDropdown.onclick = () => {
        if (rightBoxBtnDropdown.classList.contains("active")) {
            rightBoxBtnDropdown.classList.remove("active");
            rightBox.style.top = "0";
        } else {
            rightBoxBtnDropdown.classList.add("active");
            rightBox.style.top = "80px";
        }
    };
}

/* ======================================= nav ======================================= */
function handleNavigationItem() {
    const navigationItemBtn = document.getElementById("navigation-item__btn");

    navigationItemBtn.onclick = () => {
        navigationItemBtn.classList.toggle("active");
    };
}

/* ======================================= main ======================================= */
function handleFilterButton() {
    const filterBtn = document.getElementById("advanced-filter-btn");
    const handleBtn = document.getElementById("advanced-handle-btn");
    const toolBarAdvancedFilterBox = document.getElementById(
        "toolbar__advanced-filter-box"
    );
    const toolBarAdvancedHandleBox = document.getElementById(
        "toolbar__advanced-handle-box"
    );
    if (filterBtn) {
        filterBtn.onclick = () => {
            var height = localStorage.getItem("filterBoxHeight");
            toolBarAdvancedFilterBox.style.height =
                height === "100%" ? "0" : "100%";

            localStorage.setItem(
                "filterBoxHeight",
                toolBarAdvancedFilterBox.style.height
            );
            if (
                localStorage.getItem("handleBoxHeight") === "100%" &&
                localStorage.getItem("filterBoxHeight") === "100%"
            ) {
                toolBarAdvancedHandleBox.style.height = "0";
                localStorage.setItem("handleBoxHeight", "0");
            }
        };
    }
    if (handleBtn) {
        handleBtn.onclick = () => {
            var height = localStorage.getItem("handleBoxHeight");
            toolBarAdvancedHandleBox.style.height =
                height === "100%" ? "0" : "100%";

            localStorage.setItem(
                "handleBoxHeight",
                toolBarAdvancedHandleBox.style.height
            );
            if (
                localStorage.getItem("handleBoxHeight") === "100%" &&
                localStorage.getItem("filterBoxHeight") === "100%"
            ) {
                toolBarAdvancedFilterBox.style.height = "0";
                localStorage.setItem("filterBoxHeight", "0");
            }
        };
    }
}

/* ============ upload file =========== */
function handleFileUpload() {
    const imageGroup = document.getElementById("image-group");
    const uploadFile = document.querySelector("input[type='file']");
    const MAX_IMAGES = 12;

    if (uploadFile) {
        uploadFile.onchange = (e) => {
            var files = [...uploadFile.files];
            if (files.length === 0) return;
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
                closeIcon.innerHTML += `<i class="fa-solid fa-circle-xmark" style="background-color: #fff; border-radius: 50%; display: block;"></i>`;

                thumbnailPreview.append(imgPreview, closeIcon);
                thumbnailPreview.classList.add("image-group__preview");

                imgPreview.onload = () => URL.revokeObjectURL(imgPreview.src);

                imageGroup.prepend(thumbnailPreview);
                closeIcon.onclick = (e) => {
                    e.target.closest(".image-group__preview").remove();
                };
            });
        };
    }
}

/* ============ product change =========== */
function handleProductItemChange() {
    const productItemIcon = document.querySelectorAll(".product-item__icon");

    if (productItemIcon) {
        productItemIcon.forEach((item) => {
            item.onclick = () => {
                let parent = item.parentNode;
                let ProductItemInput = parent.nextSibling;

                parent.style.display = "none";
                ProductItemInput.style.display = "block";
                ProductItemInput.focus();

                ProductItemInput.onblur = debounce(() => {
                    parent.firstChild.textContent = `${parseFloat(
                        ProductItemInput.value
                    ).toLocaleString("vi-VN")}đ`;
                    parent.style.display = "block";
                    ProductItemInput.style.display = "none";
                    fetch(`${PATH_ADMIN}/product/update-price?_method=PATCH`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            field: ProductItemInput.getAttribute("field"),
                            value: ProductItemInput.value,
                            _id: ProductItemInput.getAttribute("_id"),
                        }),
                    }).catch((error) => console.error("Lỗi cập nhật:", error));
                }, 300);
            };
        });
    }
}

/* ============ handle status =========== */
function handleStatusInput() {
    const btnStatusInput = document.querySelectorAll(".btn-status__input");

    if (btnStatusInput) {
        window.onload = () => {
            btnStatusInput.forEach((element) => {
                let btnStatusDesc = element.parentNode.parentNode.nextSibling;
                if (element.value == "on") {
                    element.checked = true;
                    btnStatusDesc.textContent = "Hoạt động";
                } else {
                    element.checked = false;
                    btnStatusDesc.textContent = "Không hoạt động";
                }
            });
        };
        btnStatusInput.forEach((element) => {
            element.onchange = debounce(() => {
                let btnStatusDesc = element.parentNode.parentNode.nextSibling;
                if (element.checked) {
                    element.value = "on";
                    btnStatusDesc.textContent = "Hoạt động";
                } else {
                    element.value = "off";
                    btnStatusDesc.textContent = "Không hoạt động";
                }
                fetch(`${PATH_ADMIN}/product/update-status?_method=PATCH`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        value: element.value,
                        _id: element.getAttribute("_id"),
                    }),
                })
                    .then((data) => console.log(data))
                    .catch((error) => console.error("Lỗi cập nhật:", error));
            }, 300);
        });
    }
}

/* ============ handle waring form =========== */
function handleWarningFormProduct() {
    const btnDelete = document.querySelectorAll(".btn-delete");
    const btnDestroy = document.querySelectorAll(".btn-destroy");
    const formProductDelete = document.getElementById("form-product-delete");
    const warningDeleteModalBtn = document.getElementById(
        "warning-delete-modal-btn"
    );
    const warningDeleteMultipleModalBtn = document.getElementById(
        "warning-delete-multiple-modal-btn"
    );
    const warningRestoreMultipleModalBtn = document.getElementById(
        "warning-restore-multiple-modal-btn"
    );
    const warningUpdateMultipleModalBtn = document.getElementById(
        "warning-update-multiple-modal-btn"
    );

    if (formProductDelete && warningDeleteModalBtn) {
        if (btnDelete) {
            btnDelete.forEach((btn) => {
                btn.onclick = () => {
                    const idProduct = btn.getAttribute("data-bs-id");
                    formProductDelete.action = `${PATH_ADMIN}/product/delete-product/${idProduct}?_method=DELETE`;
                };
            });
        }
        if (btnDestroy) {
            btnDestroy.forEach((btn) => {
                btn.onclick = () => {
                    const idProduct = btn.getAttribute("data-bs-id");
                    formProductDelete.action = `${PATH_ADMIN}/product-trash/destroy-product/${idProduct}?_method=DELETE`;
                };
            });
        }
        warningDeleteModalBtn.onclick = () => {
            formProductDelete.submit();
        };
    }

    if (warningDeleteMultipleModalBtn) {
        warningDeleteMultipleModalBtn.onclick = () => {
            document.getElementById("handle-delete-form").submit();
        };
    }

    if (warningRestoreMultipleModalBtn) {
        warningRestoreMultipleModalBtn.onclick = () => {
            document.getElementById("handle-restore-form").submit();
        };
    }

    if (warningUpdateMultipleModalBtn) {
        warningUpdateMultipleModalBtn.onclick = () => {
            document.getElementById("handle-update-form").submit();
        };
    }
}

/* ============ handle status form =========== */
function handleStatusForm() {
    const btnStatusInFrom = document.querySelector(".btn-status-form");
    const btnStatusDesc = document.querySelector(".btn-status__desc");

    if (btnStatusInFrom && btnStatusDesc) {
        btnStatusInFrom.onchange = () => {
            if (btnStatusInFrom.checked) {
                btnStatusInFrom.value = "on";
                btnStatusDesc.textContent = "Hoạt động";
            } else {
                btnStatusInFrom.value = "off";
                btnStatusDesc.textContent = "Không hoạt động";
            }
        };
    }
}

/* ============ handle edit form =========== */
function handleEditForm() {
    const thumbnailDeleted = document.getElementById("thumbnail-deleted");
    const imgCloseIcon = document.querySelectorAll(".image__close-icon");
    var arr = [];

    if (imgCloseIcon) {
        imgCloseIcon.forEach((item) => {
            item.onclick = (e) => {
                let imgGroupPreview = e.target.closest(".image-group__preview");
                arr = [
                    ...arr,
                    `${imgGroupPreview.firstChild.src}`.replace(
                        /^.*?(\/uploads)/,
                        "$1"
                    ),
                ];

                thumbnailDeleted.value = JSON.stringify(arr);
                imgGroupPreview.remove();
            };
        });
    }
}
/* ============ handle sort product =========== */
function handleSortProduct() {
    const listProductSortIcon = document.querySelectorAll(
        ".list-product__sort-link"
    );
    listProductSortIcon.forEach((item) => {
        item.onclick = (e) => {
            e.preventDefault();
            var href = item.getAttribute("href");
            document
                .querySelectorAll("#filter-form input[type='text']")
                .forEach((node) => {
                    href += `&${encodeURIComponent(
                        node.name
                    )}=${encodeURIComponent(node.value)}`;
                });

            document.querySelectorAll("#filter-form select").forEach((node) => {
                href += `&${encodeURIComponent(node.name)}=${encodeURIComponent(
                    node.value
                )}`;
            });

            var valueRadio = "";
            document
                .querySelectorAll("#filter-form input[type='radio']")
                .forEach((node) => {
                    if (node.checked == true) {
                        valueRadio = node.value;
                    }
                });
            href += `&status=${encodeURIComponent(valueRadio)}`;

            document
                .querySelectorAll("#filter-form input[type='number']")
                .forEach((node) => {
                    href += `&${encodeURIComponent(
                        node.name
                    )}=${encodeURIComponent(node.value)}`;
                });

            window.location.href = href;
        };
    });
}

/* ============ handle Filter Form =========== */
function handleFilterFrom() {
    const FilterFromResetBtn = document.querySelectorAll(
        ".handle-from-reset-btn"
    );
    if (FilterFromResetBtn) {
        FilterFromResetBtn.forEach((item) => {
            item.onclick = () => {
                item.closest("form")
                    .querySelectorAll("input[type='text'],input[type='number']")
                    .forEach((input) => {
                        input.value = "";
                    });

                item.closest("form")
                    .querySelectorAll("input[type='radio']")
                    .forEach((radio) => {
                        radio.checked = false;
                    });
                item.closest("form")
                    .querySelectorAll("select")
                    .forEach((select) => {
                        select.selectedIndex = 0;
                    });
            };
        });
    }
}

/* ============ handle select Product Item =========== */
function handleSelectProductItem() {
    const productItem = document.querySelectorAll(".product-item__select");
    const productItemSelectAll = document.getElementById(
        "product-item__select-all"
    );
    const listId = document.querySelectorAll(".list-id");
    if (productItem && productItemSelectAll) {
        var arr = [];
        productItem.forEach((item) => {
            item.onchange = () => {
                productItemSelectAll.checked = [...productItem].reduce(
                    (value, item2) => item2.checked && value,
                    true
                );
                arr = JSON.parse(listId[0].value);
                var idProduct = item.getAttribute("id-product");
                if (item.checked) {
                    arr = [...arr, idProduct];
                } else {
                    arr = arr.filter((item) => item != idProduct);
                }
                listId.forEach((item) => {
                    item.value = JSON.stringify(arr);
                });
            };
        });
        productItemSelectAll.onclick = () => {
            arr = [];
            productItem.forEach((item) => {
                item.checked = productItemSelectAll.checked;
            });
            if (productItemSelectAll.checked) {
                productItem.forEach((item) => {
                    var idProduct = item.getAttribute("id-product");
                    arr = [...arr, idProduct];
                });
            } else {
                arr = [];
            }
            listId.forEach((item) => {
                item.value = JSON.stringify(arr);
            });
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

/* ======================================= handle responsive ======================================= */
function handleResponsiveNav() {
    const toggleNav = document.getElementById("toggle__nav");
    const navbar = document.getElementById("navbar");

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
}

// Utility function
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// window load
function handleWindowOnload() {
    const toolBarAdvancedFilterBox = document.getElementById(
        "toolbar__advanced-filter-box"
    );
    const toolBarAdvancedHandleBox = document.getElementById(
        "toolbar__advanced-handle-box"
    );
    var filterHeight = localStorage.getItem("filterBoxHeight") || 0;
    var handleHeight = localStorage.getItem("handleBoxHeight") || 0;
    toolBarAdvancedFilterBox.style.height = filterHeight;
    toolBarAdvancedHandleBox.style.height = handleHeight;
}

// Initialize all handlers
function init() {
    handleWindowOnload();
    handleSearchBox();
    handleScreenButtons();
    handleToggleNav();
    handleRightBoxDropdown();
    handleNavigationItem();
    handleFilterButton();
    handleFileUpload();
    handleProductItemChange();
    handleStatusInput();
    handleStatusForm();
    handleEditForm();
    handleResponsiveNav();
    handleWarningFormProduct();
    handleSortProduct();
    handleFilterFrom();
    handleSelectProductItem();
    handlePaginationBtn();
}
document.addEventListener("DOMContentLoaded", init);
