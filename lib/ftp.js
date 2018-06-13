const { join } = require('path');
const ftp = require('basic-ftp');
const progressbar = require('progressbar');
const { geFileList } = require('./utils/fileList');

const cwd = process.cwd();

/**
 *
 * @param {object} params - 上传参数
 * @param {string} params.source - 待上传路径
 * @param {string} [params.target='/'] - ftp 路径，缺省为根目录
 * @param {string} params.host - Host to connect to {@link https://github.com/patrickjuchli/basic-ftp#client-api}
 * @param {string} [params.port=21] - Host to connect to
 * @param {string} params.user - Port to connect to
 * @param {string} params.password - Username for login
 */
async function upload({ source = '', target = '/', ...ftpOptions }) {
  try {
    const client = new ftp.Client();
    if (source.length === 0) {
      console.info('相关参数 source 为空');
      return;
    }
    if (target.length === 0) {
      console.info('相关参数 target 为空');
      return;
    }
    if (!ftpOptions) {
      console.info('相关参数 ftpOptions 为空');
      return;
    }

    const progress = progressbar.create().step('上传中');

    const files = geFileList(join(cwd, source));
    progress.setTotal(files.length);

    await client.access(ftpOptions);
    let currentIndex = 0;
    let lastFileName = '';
    client.trackProgress((file) => {
      if (lastFileName === '' || lastFileName !== file.name) {
        currentIndex++;
        lastFileName = file.name;
        if (currentIndex === files.length) {
          progress.finish();
          console.log('上传完成');
        } else {
          progress.addTick();
        }
      }
    });

    await client.ensureDir(target);
    await client.clearWorkingDir();
    await client.uploadDir(join(cwd, source));
    client.trackProgress();
    client.close();
    return 0;
  } catch (err) {
    console.error('上传失败:');
    console.error(err);
  }
  return 1;
}

module.exports = {
  upload,
};
