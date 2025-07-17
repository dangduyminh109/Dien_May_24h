const system = require("../../config/system.js");
const Post = require("../../models/post.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    generalHelper,
    filterAndSort,
} = require("../../helpers/post.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const PostCategory = require("../../models/post-category.model.js");
class postTrashController {
    // [GET] /admin/post-trash
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listPost, pagination } = await filterAndSort(req, true);
        const handleData = req.session.backData || {};
        const general = await generalHelper(true);
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post/post-trash", {
            pageTitle: "Post trash",
            PATH_ADMIN: system.PATH_ADMIN,
            listDeletedPost: listPost,
            general,
            handle: handleData.formData,
            filter: req.query,
            pagination,
            currentPath,
            categoryTree,
        });
    }
    // [GET] /admin/post/detail:id
    async detail(req, res) {
        try {
            const post = await Post.findOneDeleted({
                _id: req.params.id,
            }).populate("category", "name");
            res.render("./admin/page/post/detail", {
                pageTitle: "Post detail",
                PATH_ADMIN: system.PATH_ADMIN,
                post,
                deleted: true,
            });
        } catch (error) {
            req.flash("error", "Có lỗi xảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/post");
        }
    }

    // [PATCH] /admin/post-trash/restore-post
    async restore(req, res) {
        try {
            await Post.restore({ _id: req.params.id });
            req.flash("success", "Khôi phục bài viết thành công!");
            res.redirect("/admin/post-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục bài viết không thành công!");
            res.redirect("/admin/post-trash");
        }
    }

    // [PATCH] /admin/post-trash/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            await Post.updateManyDeleted(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.session.backData = {
                formData: req.body,
            };
            req.flash("success", "Cập nhật bài viết thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Cập nhật bài viết không thành công!");
            res.redirect("back");
        }
    }

    // [PATCH] /admin/post-trash/restore-more
    async restoreMore(req, res) {
        const listIds = JSON.parse(req.body["list-id"]);
        try {
            await Post.restore({ _id: { $in: listIds } });
            req.flash("success", "Khôi phục bài viết thành công!");
            res.redirect("/admin/post-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Khôi phục bài viết không thành công!");
            res.redirect("/admin/post-trash");
        }
    }

    // [DELETE] /admin/post-trash/destroy-post/:id
    async destroy(req, res) {
        try {
            await Post.deleteOne({ _id: req.params.id });
            req.flash("success", "Xóa bài viết thành công!");
            res.redirect("/admin/post-trash");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa bài viết không thành công!");
            res.redirect("/admin/post-trash");
        }
    }

    // [DELETE] /admin/post-trash/destroy-more
    async destroyMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Post.deleteMany({ _id: { $in: listIds } });
            req.flash("success", "Xóa bài viết thành công!");
            res.redirect("back");
        } catch (error) {
            console.log(error);
            req.flash("error", "Xóa bài viết không thành công!");
            res.redirect("back");
        }
    }
}

module.exports = new postTrashController();
