function capitalize(str) {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function generateRandomNumber() {
    let otp = '';
    for ( let x = 0; x < 6; x++) {
        otp = otp + Math.floor(Math.random() * 111.111).toString();
    }
    return otp.substring(0,6);
}

function encryption(text, key) {
    const result = [];
    for (let i = 0; i < text.length; i++) {
        result.push(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return String.fromCharCode(...result);
}

module.exports = {
    capitalize: (str) => capitalize(str),
    generateRandomNumber: () => generateRandomNumber(),
    encryption: (text, key) => encryption(text, key)
}