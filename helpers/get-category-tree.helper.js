const getCategoryTree = async (Model, parentId = "") => {
    const categories = await Model.find({
        parentId,
    });
    for (let category of categories) {
        category.children = await getCategoryTree(Model, category._id);
    }
    return [...categories];
};

module.exports = getCategoryTree;
