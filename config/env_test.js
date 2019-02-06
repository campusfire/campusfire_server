let config = {
    env: 'env_test',
    port: process.env.PORT || 10410,
    baseUrl: process.env.BASE_URL || 'localhost',
    textFile: './tests/postedText.txt',
    qrRegister: './tests/QRCodeRegister.json',
};


module.exports = config;
