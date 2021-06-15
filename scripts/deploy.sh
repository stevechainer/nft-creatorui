#!/usr/bin/env sh

# abort on errors
set -e

# build
yarn build

# navigate into the build output directory
cd dist

# add domain
awk -F'"' '/"domain": ".+"/{ print $4; exit; }' ../package.json > CNAME

git init
git add -A
git commit -m 'deploy'
git push -f $(awk -F'"' '/"repoURL": ".+"/{ print $4; exit; }' ../package.json) main:gh-pages

cd -