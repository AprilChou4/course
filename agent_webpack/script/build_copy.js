const fs = require('fs');
const path = require('path');

const {
  prevJSPath,
  prevCSSPath,
  distJSPath,
  distCSSPath,
  tagJSPath,
  tagCSSPath,
  tempJSPath,
  tempCSSPath,
} = require('./config');

const rootPath = process.cwd();

const resolvePath = (p) => path.join(rootPath, p);

const copyFile = async (from, to, log) => {
  const fromPath = resolvePath(from);
  const toPath = resolvePath(to);

  if (!fs.existsSync(fromPath) || !fs.existsSync(toPath)) {
    console.error(`Error: ${fromPath} 或 ${toPath}路径不存在`);
    return;
  }

  const files = fs.readdirSync(fromPath);

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const filePath = path.join(fromPath, filename);

    if (fs.statSync(filePath).isFile()) {
      // 复制文件
      const destPath = path.join(toPath, filename);
      fs.copyFileSync(filePath, destPath);
    }
  }

  if (log) {
    console.log(log);
  }
};

const deleteFiles = (namePath, log) => {
  const oldFiles = fs.readdirSync(resolvePath(namePath));
  if (!oldFiles || oldFiles.length === 0) return;

  // 删除 dist 中对应 js css 文件
  for (let i = 0; i < oldFiles.length; i++) {
    const file = oldFiles[i];

    const deletePath = resolvePath(namePath + file);
    if (fs.statSync(deletePath).isFile()) {
      fs.unlinkSync(deletePath);
    }
  }

  if (log) {
    console.log(log);
  }
};

const newDistPrevDir = () => {
  // 检测是否存在 dist_prev, 不存在时创建文件
  if (!fs.existsSync(resolvePath(prevCSSPath))) {
    fs.mkdirSync(resolvePath('/dist_prev'));
    fs.mkdirSync(resolvePath(prevJSPath));
    fs.mkdirSync(resolvePath(prevCSSPath));

    // 备份当次打包的 文件
    copyFile(distJSPath, prevJSPath);
    copyFile(distCSSPath, prevCSSPath, '拷贝 dist 文件到 dist_prev 成功');
  }

  // 检测是否存在 dist_temp, 不存在时创建文件
  if (!fs.existsSync(resolvePath(tempCSSPath))) {
    fs.mkdirSync(resolvePath('/dist_temp'));
    fs.mkdirSync(resolvePath(tempJSPath));
    fs.mkdirSync(resolvePath(tempCSSPath));
  }
};

newDistPrevDir();

const beforeBuild = () => {
  // 拷贝 dist 中上次打包的文件到临时保存文件夹 temp
  copyFile(prevJSPath, tempJSPath);
  copyFile(prevCSSPath, tempCSSPath, '拷贝 dist_prev 文件到 dist_temp 成功');
  console.log('copy successiful');
};

const afterBuild = () => {
  // 备份当次打包的 文件
  copyFile(distJSPath, prevJSPath);
  copyFile(distCSSPath, prevCSSPath, '拷贝 dist 文件到 dist_prev 成功');

  copyFile(tempJSPath, distJSPath);
  copyFile(tempCSSPath, distCSSPath, '拷贝 dist_temp 文件到 dist 成功');

  // 删除 dist_temp 中的文件
  deleteFiles(tempJSPath);
  deleteFiles(tempCSSPath, '删除 dist_temp 文件成功');

  console.log('copy successiful');
};

const mergeTags = () => {
  // 备份当次打包的 文件
  copyFile(tagJSPath, distJSPath);
  copyFile(tagCSSPath, distCSSPath, '合并 tags 成功');

  console.log('merge successiful');
};

const run = () => {
  const arr = process.env.npm_lifecycle_script.split(' ');
  const mode = arr[arr.length - 1];

  if (mode === 'before') {
    beforeBuild();
  }

  if (mode === 'after') {
    afterBuild();
  }

  if (mode === 'tags') {
    mergeTags();
  }
};

run();
