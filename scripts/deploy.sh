#!/usr/bin/env sh

# abort on errors
set -e

# clean dist folder
rm -rf dist

git worktree add dist gh-pages

# build
yarn build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
awk -F'"' '/"domain": ".+"/{ print $4; exit; }' ../package.json > CNAME

git add --all
git commit -m "Deploy to gh-pages"
git push origin gh-pages

cd -