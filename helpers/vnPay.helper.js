require("dotenv").config();
const querystring = require("qs");
const crypto = require("crypto");
const moment = require("moment");

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
            /%20/g,
            "+"
        );
    }
    return sorted;
}

function buildVnpParams({
    amount,
    orderDescription,
    orderType,
    bankCode,
    ipAddr,
}) {
    let tmnCode = process.env.VNP_TMNCODE;
    let returnUrl = process.env.VNP_RETURNURL;

    let date = new Date();
    let createDate = moment(date).format("YYYYMMDDHHmmss");
    let orderId = moment(date).format("DDHHmmss");
    let locale = "vn";
    let currCode = "VND";

    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderDescription,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode !== null && bankCode !== "") {
        vnp_Params["vnp_BankCode"] = bankCode;
    }
    vnp_Params = sortObject(vnp_Params);
    return vnp_Params;
}

function generateVnpUrl(vnp_Params) {
    let secretKey = process.env.VNP_HASHSECRET;
    let vnpUrl = process.env.VNP_URL;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;
    vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
    return vnpUrl;
}

function handleVnPayReturnData(req) {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];
    vnp_Params = sortObject(vnp_Params);
    let secretKey = process.env.VNP_HASHSECRET;
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    return {
        vnp_Params,
        secureHash,
        signed,
    };
}

module.exports = {
    buildVnpParams,
    generateVnpUrl,
    handleVnPayReturnData,
};
