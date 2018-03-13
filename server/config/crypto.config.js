const cryptoConfig = {
    secret: process.env.SECRET,
    iterations: 1000,
    digest: 'sha512',
    jwtValid: '1d'
};

export {cryptoConfig};