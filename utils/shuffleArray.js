function shuffleArray(arr) {
    for (let i = arr.length - 1; i >= 0; i--) {
        let numRandom = Math.floor(Math.random() * (i + 1));
        tmp = arr[i];
        arr[i] = arr[numRandom];
        arr[numRandom] = tmp;
    }
    return arr;
}

module.exports = shuffleArray;
