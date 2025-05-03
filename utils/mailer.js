const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendOTP = async (gmail, otp) => {
    return (info = await transporter.sendMail({
        from: `"electronics store" <${process.env.EMAIL_USER}>`,
        to: gmail,
        subject: "Mã xác thực đăng ký",
        html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                        <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Electronics Store</a>
                        </div>
                        <p style="font-size:1.1em">Xin Chào,</p>
                        <p>Cảm ơn bạn đã chọn Electronics Store. Sử dụng OTP sau để hoàn tất thủ tục Đăng ký của bạn. OTP có hiệu lực trong 3 phút:</p>
                        <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                        <p style="font-size:0.9em;">Trân trọng,<br />Electronics Store</p>
                    </div>
                </div>`,
    }));
};
