const Otp = require("../../models/otp.model.js");
const User = require("../../models/user.model.js");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../../utils");

class AuthController {
    async register(req, res) {
        try {
            const formData = req.body;
            const emailExisted = await User.findOne({
                email: formData.email,
            });
            if (emailExisted) {
                req.flash("error", "Email này đã được đăng ký!");
                req.flash("openModal", true);
                return res.redirect("/");
            }
            const otpValid = await Otp.findOne({
                email: formData.email,
                otp: formData.confirm,
            });

            if (otpValid && otpValid.expiresAt > Date.now()) {
                formData.password = await bcrypt.hash(formData.password, 10);
                delete formData.confirm;
                const user = new User({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                });
                await user.save();
                req.flash("openModal", true);
                req.flash("success", "Đăng kí thành công!");
                await Otp.deleteOne({ email: formData.email });
                res.redirect("/");
            } else {
                req.flash("openModal", true);
                req.flash(
                    "error",
                    "Đăng kí không thành công! Mã OTP không hợp lệ hoặc đã hết hạn!"
                );
                return res.redirect("/");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Đăng kí không thành công! có lỗi xảy ra!");
            res.redirect("back");
        }
    }

    async verify(req, res) {
        try {
            const { email, isForgot } = req.body;
            const emailValid = await User.findOne({ email });

            if (isForgot && !emailValid) {
                return res.json({
                    error: true,
                    message:
                        "Email này chưa được đăng ký! Vui lòng đăng ký tài khoản trước.",
                });
            } else if (!isForgot && emailValid) {
                return res.json({
                    error: true,
                    message: "Email này đã được đăng ký!",
                });
            }
            const otpValid = await Otp.findOne({ email });
            if (otpValid) {
                const minutesLeft = Math.floor(
                    (otpValid.expiresAt - Date.now()) / 1000
                );
                return res.json({
                    error: true,
                    message: `Mã xác nhận đã được gửi trước đó! Gửi lại sau ${minutesLeft}s!!!`,
                    minutesLeft,
                });
            } else {
                const otp = Math.floor(
                    100000 + Math.random() * 900000
                ).toString();
                await Otp.create({
                    email,
                    otp,
                    expiresAt: new Date(Date.now() + 3 * 60000),
                });
                const info = await sendOTP(email, otp);
                return res.json({
                    success: true,
                    message: "Đã gửi mã xác nhận!",
                });
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Gữi mã không thành công! có lỗi xảy ra!");
            res.redirect("back");
        }
    }

    async login(req, res) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                req.flash(
                    "error",
                    "Đăng nhập thất bại! Tài khoản hoặc mật khẩu không hợp lệ!"
                );
                req.flash("openModal", true);
                return res.redirect("/");
            }
            const match = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if (!match) {
                req.flash(
                    "error",
                    "Đăng nhập thất bại! Tài khoản hoặc mật khẩu không hợp lệ!"
                );
                req.flash("openModal", true);
                return res.redirect("/");
            }
            req.session.user = {
                _id: user._id,
                name: user.name,
                email: user.email,
            };
            req.flash("success", "Đăng nhập thành công!");
            res.redirect("/");
        } catch (error) {
            console.log(error);
            req.flash("error", "Đăng nhập không thành công! có lỗi xảy ra!");
            res.redirect("back");
        }
    }

    async forgot(req, res) {
        try {
            const formData = req.body;
            const otpValid = await Otp.findOne({
                email: formData.email,
                otp: formData.confirm,
            });
            if (!otpValid || otpValid?.expiresAt < Date.now()) {
                req.flash("openModal", true);
                req.flash(
                    "error",
                    "Đổi mật khẩu không thành công! Mã OTP không hợp lệ hoặc đã hết hạn!"
                );
                return res.redirect("/");
            } else if (formData.password !== formData.passwordConfirm) {
                req.flash("openModal", true);
                req.flash(
                    "error",
                    "Đổi mật khẩu không thành công! Mật khẩu xác nhận không trùng khớp!"
                );
                return res.redirect("/");
            } else {
                const password = await bcrypt.hash(formData.password, 10);
                await User.updateOne(
                    { email: formData.email },
                    {
                        password: password,
                    }
                );
                req.flash("openModal", true);
                req.flash("success", "Đổi mật khẩu thành công!");
                await Otp.deleteOne({ email: formData.email });
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
            req.flash("error", "Đổi mật khẩu không thành công! có lỗi xảy ra!");
            res.redirect("/");
        }
    }

    logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                res.json("đăng xuất không thành công có lỗi xãy ra!!!");
                console.log(err);
                return res.redirect("/");
            }
            res.redirect("/");
        });
    }

    callbackGG(req, res, next) {
        passport.authenticate("google", (err, user) => {
            if (err || !user) {
                req.flash("error", "Đăng nhập không thành công!");
                req.flash("openModal", true);
                return res.redirect("/");
            }
            req.logIn(user, (err) => {
                if (err) {
                    req.flash("error", "Đăng nhập không thành công!");
                    req.flash("openModal", true);
                    return res.redirect("/");
                }
                req.flash("success", "Đăng nhập thành công!");
                return res.redirect("/");
            });
        })(req, res, next);
    }

    callbackFB(req, res, next) {
        passport.authenticate("facebook", (err, user) => {
            if (err || !user) {
                req.flash("error", "Đăng nhập không thành công!");
                req.flash("openModal", true);
                return res.redirect("/");
            }
            req.logIn(user, (err) => {
                if (err) {
                    req.flash("error", "Đăng nhập không thành công!");
                    req.flash("openModal", true);
                    return res.redirect("/");
                }
                req.flash("success", "Đăng nhập thành công!");
                return res.redirect("/");
            });
        })(req, res, next);
    }
}

module.exports = new AuthController();
