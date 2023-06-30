# Contribute to nextlint

Start by forking the project's repository on GitHub.
This creates a copy of the project under your GitHub account, allowing you to make changes without directly affecting the original project.

## Setup environment:

We recommend installing Node.js using [Volta(JavaScript Tool Manager)](https://volta.sh/) and [pnpm](https://pnpm.io/) for managing dependencies.

Install Volta and node:

```sh
# install Volta
curl https://get.volta.sh | bash

# install Node
volta install node

```

Install pnpm:

```
volta install pnpm

```

## Fork and clone nextlint repository

```sh
git clone git@github.com:{your-username}/nextlint.git
```

Change working directory to nextlint:

```
// 1. install dependencies
pnpm install
// 2.1 start in development mode
pnpm dev
// 2.2 playground with editor
pnpm run --filter=svelte playground

```

## Create a Pull Request

Nextlint using [changeset](https://github.com/changesets/changesets) to release and manage versions, [more detail about versioning with changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)

Here are steps to create a pull request with a changeset release:

1. Create feature/fix branch:

```sh
git branch -b feat/bubble_menu
```

2. Commit your change

```sh
git add .
git commit -m "feat(bubble_menu): fix style...."
```

3. Create a changeset if you want to publish a version of this change:

```sh
pnpm changeset
```

4. Push Code and create PR into nextlint
