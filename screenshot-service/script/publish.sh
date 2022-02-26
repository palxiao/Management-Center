#!/bin/bash
# project_path=$(cd `dirname $0`; pwd)
project_path=$PWD
project_name="${project_path##*/}"

# 发布参数：
current_dir="Management-Center"
current_branch="main" # 当前分支
publish_branch="publish" # 发布分支

# 脚本参数
cache_dir="_cache_"
install="yarn"
build_script="npm run build"
set -e

cd ../../
mkdir ${cache_dir}

cd ${current_dir}
cd ${project_name}
${install}
${build_script}
cp -f package_build.json ./dist/package.json
zip -r dist.zip dist
cp -f .drone.yml ../../${cache_dir}
mv -f dist.zip ../../${cache_dir}

cd ../
git checkout ${publish_branch}
mv -f ../${cache_dir}/.drone.yml ./ # 指定转移配置
mv -f ../${cache_dir}/* ./
rm -rf ../${cache_dir}
git add .
git commit -m 'add build files'
git push origin ${publish_branch}
git checkout ${current_branch}
cd $project_name

echo -e "\n发布成功\n"
exit