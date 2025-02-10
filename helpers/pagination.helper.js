module.exports = (req) => {
    let [baseUrl, queryString] = req.originalUrl.split("?");
    if (!queryString) return req.originalUrl + "?";
    let params = new URLSearchParams(queryString);
    params.delete("page");
    let newQueryString = params.toString();
    return newQueryString ? `${baseUrl}?${newQueryString}&` : baseUrl + "?";
};
