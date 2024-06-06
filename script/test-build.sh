#!/bin/bash

# Glob pkgs/* to run `bun run build` on each package
for pkg in pkgs/*; do
  if [ -d "$pkg" ]; then
    pkg=$(basename $pkg)
    echo "Building $pkg"
    bun run build $pkg
  fi
done
