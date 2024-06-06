import { buildPkg } from "./build";
import child_process from "child_process";
import { checkUpdatedPkgVersions, upsertPkg } from "./supabase";

const uploadPkg = async (pkgName: string) => {
  console.log(`Uploading ${pkgName}...`);

  // Use npm publish to upload package
  child_process.execSync("npm publish --public", {
    cwd: `./pkgs/${pkgName}`,
    env: process.env,
  });
};

const updatedPkgs = await checkUpdatedPkgVersions();
if (updatedPkgs.length == 0) {
  console.log("No updated packages found.");
  process.exit(0);
}
console.log("Found updated packages: ", updatedPkgs.length);
console.log(updatedPkgs.map((pkg) => pkg.name).join(", "));

for (const pkg of updatedPkgs) {
  await buildPkg(pkg.name);
  // await uploadPkg(pkg.name);
  await upsertPkg(pkg);
}
