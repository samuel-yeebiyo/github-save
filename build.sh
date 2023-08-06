#!/bin/bash

if [[ -z "$1" ]]; then
    echo "Please speicfy for which browser you want to build this extension"
    echo "for example: build.sh firefox or build.sh chrome"
    exit 1
fi

if [[ $1 == 'chrome' ]]; then
    echo "Creating chrome extension build zip in chrome/build folder"
    npm run build:chrome
    # does not require source code
    zip -FSr chrome/build/build.zip dist/*
elif [[ $1 == 'firefox' ]]; then
    # extension code
    echo "Creating firefox extension build zip in firefox/build folder"
    npm run build:firefox
    cd dist/
    zip -FSr ../firefox/build/build.zip ./* 
    # source code
    echo "Creating source code zip in firefox/build folder"
    cd ../
    zip -FSr firefox/build/source.zip firefox/ public/ src/ .*.cjs *.html *.json *.js *.md *.ts -x firefox/build\*
else
    echo "Invalid argument $1"
    echo "Enter either chrome or firefox"
fi
