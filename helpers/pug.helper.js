module.exports = {
    sort: (name, _sort) => {
        var _sortType = name === _sort.filed ? _sort.type : "default";
        const icon = {
            default: "fa-solid fa-sort",
            asc: "fa-solid fa-arrow-down-short-wide",
            desc: "fa-solid fa-arrow-up-wide-short",
        };
        const type = {
            default: "asc",
            asc: "desc",
            desc: "default",
        };
        return `
            <a href="?_sort&filed=${name}&type=${type[_sortType]}">
                <span class="list-product__sort-icon">
                    <i class="${icon[_sortType]}"></i>
                </span>
            </a>
        `;
    },
};
