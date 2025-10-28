#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// HTTP服务器配置
const HTTP_SERVER_BASE = 'http://192.168.201.114:8822/runtime';

// 获取当前平台和架构
function getCurrentPlatform() {
  const platform = os.platform();
  const arch = os.arch();
  
  return {
    platform: platform === 'win32' ? 'win32' : (platform === 'darwin' ? 'darwin' : 'linux'),
    arch: arch === 'x64' ? 'x64' : (arch === 'arm64' ? 'arm64' : 'x64')
  };
}

// 创建目录
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 下载文件
function downloadFile(url, dest) {
  console.log(`正在下载: ${url}`);
  
  try {
    // 使用 curl 下载，添加失败检测
    const curlCommand = `curl -L -f -o "${dest}" "${url}"`;
    execSync(curlCommand, { stdio: 'inherit' });
    
    // 检查文件大小和内容
    const stats = fs.statSync(dest);
    if (stats.size < 1000) {
      const content = fs.readFileSync(dest, 'utf8');
      if (content.includes('Error code: 404') || content.includes('File not found')) {
        console.error('文件未找到 (404)');
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`下载失败: ${error.message}`);
    return false;
  }
}

// 解压文件
function extractFile(filePath, destDir) {
  console.log(`正在解压: ${filePath}`);
  
  try {
    if (filePath.endsWith('.zip')) {
      // 创建一个临时目录来解压，然后移动文件
      const tempDir = path.join(destDir, 'temp_extract');
      ensureDir(tempDir);
      
      if (os.platform() === 'win32') {
          // Windows 使用 PowerShell 解压到临时目录
          execSync(`powershell -Command "Expand-Archive -Path '${filePath}' -DestinationPath '${tempDir}' -Force"`, { stdio: 'inherit' });
          
          // 查找解压后的实际内容目录
          const extractedItems = fs.readdirSync(tempDir);
          if (extractedItems.length === 1 && fs.statSync(path.join(tempDir, extractedItems[0])).isDirectory()) {
            // 如果zip文件包含一个顶层目录，移动其内容到目标目录
            const sourceDir = path.join(tempDir, extractedItems[0]);
            // 先删除目标目录中已存在的同名目录，然后移动内容
            const moveCommand = `powershell -Command "Get-ChildItem -Path '${sourceDir}\\*' | ForEach-Object { $dest = Join-Path '${destDir}' $_.Name; if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }; Move-Item $_.FullName '${destDir}' -Force }"`;
            execSync(moveCommand, { stdio: 'inherit' });
            
            // 清理空目录
            fs.rmSync(sourceDir, { recursive: true, force: true });
          } else {
            // 如果zip文件内容直接是文件，移动到目标目录
            const moveCommand = `powershell -Command "Get-ChildItem -Path '${tempDir}\\*' | ForEach-Object { $dest = Join-Path '${destDir}' $_.Name; if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }; Move-Item $_.FullName '${destDir}' -Force }"`;
            execSync(moveCommand, { stdio: 'inherit' });
          }
        } else {
        // macOS/Linux 使用 unzip
        execSync(`unzip -o "${filePath}" -d "${tempDir}"`, { stdio: 'inherit' });
        
        // 查找解压后的实际内容目录
        const extractedItems = fs.readdirSync(tempDir);
        if (extractedItems.length === 1 && fs.statSync(path.join(tempDir, extractedItems[0])).isDirectory()) {
          // 如果zip文件包含一个顶层目录，移动其内容到目标目录
          const sourceDir = path.join(tempDir, extractedItems[0]);
          const moveCommand = `mv "${sourceDir}"/* "${destDir}"/ 2>/dev/null || true`;
          execSync(moveCommand, { stdio: 'inherit' });
          
          // 清理空目录
          fs.rmSync(sourceDir, { recursive: true, force: true });
        } else {
          // 如果zip文件内容直接是文件，移动到目标目录
          const moveCommand = `mv "${tempDir}"/* "${destDir}"/ 2>/dev/null || true`;
          execSync(moveCommand, { stdio: 'inherit' });
        }
      }
      
      // 清理临时目录
      fs.rmSync(tempDir, { recursive: true, force: true });
    } else if (filePath.endsWith('.tar.gz')) {
      // Unix 系统使用 tar
      execSync(`tar -xzf "${filePath}" -C "${destDir}" --strip-components=1`, { stdio: 'inherit' });
    }
    
    return true;
  } catch (error) {
    console.error(`解压失败: ${error.message}`);
    return false;
  }
}

// 获取平台架构路径
function getPlatformPath(platform, arch) {
  const platformMap = {
    'darwin': 'mac',
    'win32': 'win',
    'linux': 'linux'
  };
  
  const archMap = {
    'arm64': 'arm64',
    'x64': 'x64',
    'arm': 'arm'
  };
  
  const platformName = platformMap[platform] || platform;
  const archName = archMap[arch] || arch;
  
  return `${platformName}_${archName}`;
}

// 主函数
async function main(targetDir) {
  console.log('🚀 从HTTP服务器安装Runtime...');
  
  // 获取当前平台和架构
  const { platform, arch } = getCurrentPlatform();
  console.log(`平台: ${platform}, 架构: ${arch}`);
  
  // 获取平台架构路径
  const platformPath = getPlatformPath(platform, arch);
  
  // 构建下载URL
  const downloadUrl = `${HTTP_SERVER_BASE}/${platformPath}/runtime.zip`;
  
  // 使用指定的目标目录
  const runtimeDir = path.resolve(process.cwd(), targetDir);
  ensureDir(runtimeDir);
  
  const filename = 'runtime.zip';
  const filePath = path.join(runtimeDir, filename);
  
  // 清理旧的压缩包（如果存在）
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  
  // 下载文件
  console.log(`准备从 ${downloadUrl} 下载Runtime...`);
  console.log(`目标目录: ${runtimeDir}`);
  
  const success = downloadFile(downloadUrl, filePath);
  
  if (!success || !fs.existsSync(filePath)) {
    console.error('\n❌ 下载失败！');
    console.error('可能的原因：');
    console.error('1. HTTP服务器未启动或地址错误');
    console.error('2. 文件路径不存在: ' + platformPath + '/runtime.zip');
    console.error('3. 网络连接问题');
    console.error('\n请确保HTTP服务器上有以下文件：');
    console.error(`   ${HTTP_SERVER_BASE}/mac_arm64/runtime.zip (macOS ARM64)`);
    console.error(`   ${HTTP_SERVER_BASE}/mac_x64/runtime.zip (macOS Intel)`);
    console.error(`   ${HTTP_SERVER_BASE}/win_x64/runtime.zip (Windows)`);
    console.error(`   ${HTTP_SERVER_BASE}/linux_x64/runtime.zip (Linux)`);
    process.exit(1);
  }
  
  // 解压文件
  console.log('正在解压Runtime...');
  const extractSuccess = extractFile(filePath, runtimeDir);
  if (!extractSuccess) {
    console.error('❌ 解压失败');
    console.error('请确保已安装 unzip 工具');
    process.exit(1);
  }
  console.log('✅ 解压完成');
  
  // 清理压缩包
  fs.unlinkSync(filePath);
  
  // 设置可执行权限（非 Windows）
  if (platform !== 'win32') {
    // 查找可执行文件并设置权限
    const files = fs.readdirSync(runtimeDir);
    for (const file of files) {
      const filePath = path.join(runtimeDir, file);
      const stat = fs.statSync(filePath);
      if (stat.isFile() && !file.startsWith('.')) {
        fs.chmodSync(filePath, '755');
      }
    }
  }
  
  console.log('✅ Runtime安装完成！');
  console.log(`路径: ${runtimeDir}`);
}

// 错误处理
process.on('unhandledRejection', (error) => {
  console.error('未处理的错误:', error);
  process.exit(1);
});

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  let targetDir = './runtime';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && i + 1 < args.length) {
      targetDir = args[i + 1];
      i++; // 跳过下一个参数
    }
  }
  
  return { targetDir };
}

// 解析命令行参数
function parseArgs() {
  const args = process.argv.slice(2);
  let targetDir = './runtime';
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dir' && i + 1 < args.length) {
      targetDir = args[i + 1];
      i++; // 跳过下一个参数
    }
  }
  
  return { targetDir };
}

// 运行主函数
const { targetDir } = parseArgs();
main(targetDir).catch(console.error);