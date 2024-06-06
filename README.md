# Navi Package Repository

Repository for publish Navi pkg into official registry.

## Usage

### Add a new pkg

Fork this repository, and clone it to your local machine.

The `script/add-pkg.sh` script is used to add a new pkg. You can run it with the following command:

```bash
$ ./script/add-pkg.sh <pkg-name> <git-url>
```

### Update a pkg

Wen you want to update your pkg to the latest version, you can run the following command:

```bash
$ ./script/update-pkg.sh <pkg-name>
```

Or you can specify the git tag:

```bash
$ ./script/update-pkg.sh unindent v0.0.1
```

Or a git commit sha:

```bash
$ ./script/update-pkg.sh unindent 1a2b3c4d
```

This will update your pkg submodule to the latest version.
