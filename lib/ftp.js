const ftp = require("basic-ftp");
const progressbar = require("progressbar");
const { geFileList } = require("./utils/fileList");

class Client {
  constructor(cfg) {
    this.client = new ftp.Client();
  }
}

function createProcess() {}

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
async function upload({
  source = '',
  target = '/',
  ...ftpOptions
}) {
  try {
    const { site: siteConfig } = pkg;
    if (source.length === 0) {
      console.info("相关参数为空");
      return;
    }
    if (target.length === 0) {
      console.info("相关参数为空");
      return;
    }
    if (!ftpOptions) {
      console.info("相关参数为空");
      return;
    }

    const progress = progressbar
      .create()
      .step("上传中");

    const files = geFileList(path.join(cwd, source));
    progress.setTotal(files.length);

    await client.access(ftpOptions);
    const currentTotal = 0;
    client.trackProgress(info => {
      progress.addTick();
    });
    progress.finish();
    console.log('上传完成');

    await client.ensureDir(target);
    await client.clearWorkingDir();
    await client.uploadDir(path.join(cwd, source));
    client.trackProgress();
    client.close();
  } catch (err) {
    console.error('上传失败:');
    console.error(err);
  }
  client.close();
}

module.exports = {
  upload,
}
