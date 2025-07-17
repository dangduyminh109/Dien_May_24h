const system = require("../../config/system.js");
const Post = require("../../models/post.model.js");
const paginationHelper = require("../../helpers/pagination.helper.js");
const {
    handleForm,
    generalHelper,
    filterAndSort,
} = require("../../helpers/post.helper.js");
const getCategoryTree = require("../../helpers/get-category-tree.helper.js");
const PostCategory = require("../../models/post-category.model.js");

class postController {
    // [GET] /admin/post
    async show(req, res) {
        const currentPath = paginationHelper(req);
        const { listPost, pagination } = await filterAndSort(req);
        const handleData = req.session.backData || {};
        const general = await generalHelper();
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post/", {
            pageTitle: "Điện Máy 24h - bài viết",
            PATH_ADMIN: system.PATH_ADMIN,
            currentPath,
            listPost,
            pagination,
            general,
            handle: handleData.formData,
            filter: req.query,
            categoryTree,
        });
    }

    // [GET] /admin/post/create
    async create(req, res) {
        const categoryTree = await getCategoryTree(PostCategory);
        res.render("./admin/page/post/create", {
            pageTitle: "Create post",
            PATH_ADMIN: system.PATH_ADMIN,
            categoryTree,
        });
    }

    // [GET] /admin/post/edit:id
    async edit(req, res) {
        const categoryTree = await getCategoryTree(PostCategory);
        const post = await Post.findOne({
            _id: req.params.id,
        }).populate("category", "name");
        res.render("./admin/page/post/edit", {
            pageTitle: "Edit post",
            PATH_ADMIN: system.PATH_ADMIN,
            post,
            categoryTree,
        });
    }

    // [GET] /admin/post/detail:id
    async detail(req, res) {
        try {
            const post = await Post.findOne({
                _id: req.params.id,
            }).populate("category", "name");
            res.render("./admin/page/post/detail", {
                pageTitle: "Post detail",
                PATH_ADMIN: system.PATH_ADMIN,
                post,
            });
        } catch (error) {
            req.flash("error", "Có lỗi xảy ra!");
            console.error("Error:", error);
            res.redirect("/admin/post");
        }
    }

    // [POST] /admin/post/create
    async createPost(req, res) {
        try {
            const formData = await handleForm(req);
            console.log("Form data:", req.body);
            const newPost = new Post(formData);
            await newPost.save();
            req.flash("success", "Tạo bài viết thành công!");
            res.redirect("/admin/post");
        } catch (error) {
            req.flash("error", "Tạo bài viết không thành công!");
            console.error("Error saving post:", error);
            res.redirect("/admin/post");
        }
    }

    // [PATCH] /admin/post/edit:id
    async editPatch(req, res) {
        try {
            const formData = await handleForm(req, true);
            await Post.updateOne({ _id: req.params.id }, formData);
            req.flash("success", "Sửa bài viết thành công!");
            res.redirect("/admin/post");
        } catch (error) {
            console.error("Error saving post:", error);
            req.flash("error", "Sửa bài viết không thành công!");
            res.redirect("/admin/post");
        }
    }

    // [PATCH] /admin/post/update-more
    async updateMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            delete req.body["list-id"];
            var dataUpdate = Object.entries(req.body).filter(([key, value]) => {
                if (value != "") return [key, value];
            });
            dataUpdate = Object.fromEntries(dataUpdate);
            req.session.backData = {
                formData: req.body,
            };
            await Post.updateMany(
                { _id: { $in: listIds } },
                { $set: dataUpdate }
            );
            req.flash("success", "Cập nhật bài viết thành công!");
            res.redirect("back");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Cập nhật bài viết không thành công!");
            res.redirect("back");
        }
    }

    // [DELETE] /admin/post/delete-post/:id
    async delete(req, res) {
        try {
            await Post.delete({ _id: req.params.id });
            req.flash("success", "Xóa bài viết thành công!");
            res.redirect("/admin/post");
        } catch (error) {
            console.error("Error saving post:", error);
            req.flash("error", "Xóa bài viết không thành công!");
            res.redirect("/admin/post");
        }
    }

    // [DELETE] /admin/post/delete-more
    async deleteMore(req, res) {
        try {
            const listIds = JSON.parse(req.body["list-id"]);
            await Post.delete({ _id: { $in: listIds } });
            req.flash("success", "Xóa bài viết thành công!");
            res.redirect("/admin/post");
        } catch (error) {
            console.error("Error saving product:", error);
            req.flash("error", "Xóa bài viết không thành công!");
            res.redirect("/admin/post");
        }
    }
}

module.exports = new postController();
