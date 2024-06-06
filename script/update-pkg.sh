#!/bin/bash
# Update the package submodule
#
# This will update the package submodule to the latest version of the package.
#
# Usage:
#
# ./script/update-pkg.sh <pkg-name> <tag-or-commit-sha>

PKG_NAME=$1
VERSION=$2

if [ -z "$PKG_NAME" ]; then
    echo "Usage: $0 <pkg-name>"
    exit 1
fi

echo "Updating pkg/$PKG_NAME submodule ..."
if [ -z "$VERSION" ]; then
    git submodule update --remote pkgs/$PKG_NAME
else
    git submodule update --remote --rebase --checkout pkgs/$PKG_NAME
    git -C pkgs/$PKG_NAME checkout $VERSION
fi
git submodule status pkgs/$PKG_NAME
