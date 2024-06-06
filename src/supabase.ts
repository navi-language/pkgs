import { createClient } from "@supabase/supabase-js";
import semver from "semver";
import fs from "fs";

export interface Metadata {
  pkgs: MetadataPkg[];
  last_updated: string;
}

export interface MetadataPkg {
  name: string;
  version: string;
}

export interface PkgInfo {
  name: string;
  version: string;
  description?: string;
  repository?: string;
}

const supabaseKey = process.env.SUPABASE_KEY || "";

export const supabase = createClient(
  "https://yxjllrbhbozzeycippdk.supabase.co",
  supabaseKey,
);

function chunk(array: any[], size = 1) {
  let temp: any[] = [];
  const result: any[] = [];
  for (let i = 0; i < array.length; i++) {
    temp.push(array[i]);
    if (temp.length === size || i === array.length - 1) {
      result.push(temp);
      temp = [];
    }
  }
  return result;
}

const iteratePkgs = async (callback: (pkg: PkgInfo) => void) => {
  fs.readdirSync("./pkgs").forEach((pkgName) => {
    const pkgInfo = require(`../pkgs/${pkgName}/navi.toml`);
    callback({
      name: pkgInfo.name,
      version: pkgInfo.version,
      description: pkgInfo.description,
      repository: pkgInfo.repository,
    });
  });
};

export const checkUpdatedPkgVersions = async (): Promise<PkgInfo[]> => {
  const pkgs: PkgInfo[] = [];
  iteratePkgs((pkg) => pkgs.push(pkg));
  console.log(`Checking ${pkgs.length} packages...`);

  const updatedPkgs: PkgInfo[] = [];

  // Chunk pkgs into 1000 items per request
  const chunks: PkgInfo[][] = chunk(pkgs, 1000);
  console.log(`Chunked into ${chunks.length} requests...`);
  for (const items of chunks) {
    console.log(`Checking sub items ${items.length} packages...`);
    const names = items.map((item) => item.name);
    const { data, error } = await supabase
      .from("pkgs")
      .select("name, version")
      .in("name", names);
    if (error) {
      console.error(error);
      throw error;
    }

    for (const pkg of items) {
      const remotePkg = data.find((d) => d.name === pkg.name);
      if (!remotePkg) {
        updatedPkgs.push(pkg);
        continue;
      }

      if (semver.gt(pkg.version, remotePkg.version)) {
        updatedPkgs.push(pkg);
      }
    }
  }

  return updatedPkgs;
};

export const upsertPkg = async (pkg: PkgInfo) => {
  console.log(`Upserting ${pkg.name}...`);
  const { error } = await supabase
    .from("pkgs")
    .upsert(
      {
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,
        repository: pkg.repository,
      },
      {
        onConflict: "name",
      },
    )
    .select();
  if (error) {
    console.error(error);
    throw error;
  }
};
