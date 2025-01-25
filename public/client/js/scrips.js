const category_btn__prev = document.getElementById("category-btn__prev");
const category_btn__next = document.getElementById("category-btn__next");
const category = document.querySelector(".category");
const list_category = document.getElementById("list-category");
let currentPosition = 0;
let step = 200;
category_btn__next.onclick = () => {
    if (
        category.offsetWidth + currentPosition + step <
        list_category.scrollWidth
    ) {
        currentPosition += step;
        list_category.style.transform = `translateX(-${currentPosition}px)`;
    } else if (
        list_category.scrollWidth - (category.offsetWidth + currentPosition) >
        0
    ) {
        // do bị che 1 phần nên cộng 5 để show được hết item_category
        currentPosition +=
            list_category.scrollWidth -
            (category.offsetWidth + currentPosition) + 5;
        list_category.style.transform = `translateX(-${currentPosition}px)`;
    }
};
category_btn__prev.onclick = () => {
    if (currentPosition > 0 && currentPosition - step >= 0) {
        currentPosition -= step;
        list_category.style.transform = `translateX(-${currentPosition}px)`;
    } else if (currentPosition > 0 && currentPosition - step < 0) {
        currentPosition = 0;
        list_category.style.transform = `translateX(-${currentPosition}px)`;
    }
};
