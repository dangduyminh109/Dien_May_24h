tinymce.init({
    selector: ".textarea-mce",
    height: 500,
    plugins: [
        "advlist",
        "autolink",
        "lists",
        "link",
        "image",
        "charmap",
        "preview",
        "anchor",
        "searchreplace",
        "visualblocks",
        "code",
        "fullscreen",
        "insertdatetime",
        "media",
        "table",
        "wordcount",
    ],
    toolbar:
        "| undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
    content_style: "body { font-family:'sora', sans-serif; font-size:1.6rem }",

    // Bật tính năng upload ảnh
    images_upload_url: "/admin/upload/image",
    automatic_uploads: true,
    paste_data_images: true, // hỗ trợ dán ảnh trực tiếp (từ clipboard)

    // Chấp nhận chèn ảnh từ URL
    image_title: true,
    file_picker_types: "image",
    file_picker_callback: function (callback, value, meta) {
        if (meta.filetype === "image") {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();
                reader.onload = function () {
                    const id = "blobid" + new Date().getTime();
                    const blobCache =
                        tinymce.activeEditor.editorUpload.blobCache;
                    const base64 = reader.result.split(",")[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    callback(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
            };

            input.click();
        }
    },
});
