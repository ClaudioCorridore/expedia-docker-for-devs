#!/bin/bash --login

git checkout --orphan gh-pages

rvm use 2.2.1
#if `bundle --version > /dev/null 2>&1`; then echo "bundler is installed"; else gem install bundler; fi

#bundler install
OUTPUT_DIR="$PWD/public"
rm -f $OUTPUT_DIR/*.html


echo "Generate asciidoctor documentation"

lessons=("lesson-0" "lesson-1" "lesson-2" "lesson-3" "lesson-4" "lesson-5" "lesson-6")

for i in "${lessons[@]}"
do
rake generate_lesson[$OUTPUT_DIR,$i,true]
rake generate_lesson[$OUTPUT_DIR,$i,false]
done

rake generate_course[$OUTPUT_DIR,true]
rake generate_course[$OUTPUT_DIR,false]

echo "Publish to ewegithub pages"
git add public/
git commit public/ -m "Publish new version"
git push origin `git subtree split --prefix public gh-pages`:refs/heads/gh-pages --force
git checkout master
git branch -D gh-pages
