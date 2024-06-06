#!/bin/bash
# Add new pkg submodule into pkgs/
#
# Usage:
#
#  ./script/add-pkg.sh <pkg-name> <git-url>

set -e

PKG_NAME=$1
PKG_URL=$2

if [ -z "$PKG_NAME" ]; then
    echo "No package name provided"
    echo "Usage: $0 <pkg-name> <git-url>"
    exit 1
fi
if [ -z "$PKG_URL" ]; then
    echo "No package URL provided"
    echo "Usage: $0 <pkg-name> <git-url>"
    exit 1
fi

# Add submodule
git submodule add $PKG_URL pkgs/$PKG_NAME
