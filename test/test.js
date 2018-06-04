const ftp = require('../lib/ftp');

const { ftp: fitConfig } = {
  ftp: {
    host: '192.168.8.130',
    user: 'admin',
    password: 'admin',
    source: './_site',
    target: '/',
  },
};
ftp.upload(fitConfig).then(resultState => console.log(resultState));
