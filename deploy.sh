#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 执行构建，生成静态文件
npm run docs:build

# 进入构建目录（生成的文件夹），准备发布
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io
git push -f XieChi0.github.io.git master

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -