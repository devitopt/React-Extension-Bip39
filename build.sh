#!/bin/bash

build() {
    echo 'building react'

    # rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false

    npx react-app-rewired build

    # mkdir -p dist
    # cp -r build/* dist

    # mv dist/index.html dist/popup.html
}

build