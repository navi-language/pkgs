import fs from "fs";

const DEFAULT_PACKAGE_JSON = {
  private: false,
  publishConfig: {
    registry: "https://npm.pkg.github.com/",
  },
};

/**
 * Build pkg, convert navi.toml into package.json
 */
export const buildPkg = async (pkgName: string) => {
  console.log(`Building ${pkgName}...`);

  const pkgInfo = require(`../pkgs/${pkgName}/navi.toml`);
  pkgInfo.dependencies = pkgInfo.dependencies || {};
  const dependencies = {};
  for (const [name, version] of Object.entries(pkgInfo.dependencies)) {
    dependencies[`@navi-language/${name}`] = version;
  }
  const packgeJson = {
    name: `@navi-lang/${pkgName}`,
    version: pkgInfo.version,
    description: pkgInfo.description,
    repository: pkgInfo.repository,
    ...DEFAULT_PACKAGE_JSON,
    dependencies,
  };

  fs.writeFileSync(
    `./pkgs/${pkgName}/package.json`,
    JSON.stringify(packgeJson, null, 2),
  );

  console.log(`Build ${pkgName} successfully.\n`);
};

async function main() {
  const pkdName = process.argv[2];
  if (!pkdName) {
    console.error("Please provide a package name");
    process.exit(1);
  }

  await buildPkg(pkdName);
}
if (process.argv[1] === __filename) {
  await main();
}
