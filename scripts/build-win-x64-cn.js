#!/usr/bin/env node

/**
 * 国内镜像构建脚本 - Windows x64
 * 自动配置国内镜像源以加速依赖下载
 */

import { spawn } from 'child_process';
import { platform } from 'os';

// 设置国内镜像环境变量
const env = {
  ...process.env,
  // Electron 镜像
 ELECTRON_MIRROR: 'https://npmmirror.com/mirrors/electron/',
  ELECTRON_BUILDER_BINARIES_MIRROR: 'https://npmmirror.com/mirrors/electron-builder-binaries/',
  // Sharp 镜像
  SHARP_BINARY_HOST: 'https://npmmirror.com/mirrors/sharp',
  SHARP_LIBVIPS_BINARY_HOST: 'https://npmmirror.com/mirrors/sharp-libvips',
  // NPM 镜像
  npm_config_registry: 'https://registry.npmmirror.com/',
  npm_config_disturl: 'https://npmmirror.com/mirrors/node',
  
  // 平台特定配置
  npm_config_target_arch: 'x64',
  npm_config_target_platform: 'win32'
};

console.log('🚀 开始国内镜像构建 - Windows x64');
console.log('📦 使用国内镜像源：');
console.log(`   Electron: ${env.ELECTRON_MIRROR}`);
console.log(`   Sharp: ${env.SHARP_BINARY_HOST}`);
console.log(`   NPM: ${env.npm_config_registry}`);

// 执行构建命令
const buildProcess = spawn('pnpm', ['run', 'build:win:x64'], {
  env,
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  if (code === 0) {
    console.log('✅ 构建完成！');
  } else {
    console.error(`❌ 构建失败，退出码: ${code}`);
    process.exit(code);
  }
});

buildProcess.on('error', (error) => {
  console.error('❌ 构建过程出错:', error);
  process.exit(1);
});