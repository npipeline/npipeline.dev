# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Dependabot

This project uses [GitHub Dependabot](https://docs.github.com/en/code-security/dependabot) to automatically keep dependencies up to date. Dependabot helps maintain the security and stability of the project by:

- Automatically checking for dependency updates
- Creating pull requests for version updates
- Reducing manual maintenance overhead
- Ensuring timely security patches

### Configuration Overview

The Dependabot configuration is defined in [`.github/dependabot.yml`](.github/dependabot.yml) and includes:

#### npm Dependencies
- **Schedule**: Weekly checks on Mondays at 00:00 UTC
- **Scope**: Both production and development dependencies
- **Limits**: Maximum 5 open pull requests at a time
- **Versioning Strategy**: Increase for exact version pinning
- **Labels**: `dependencies`, `npm`, `documentation`
- **Commit Prefix**: `deps`

#### GitHub Actions
- **Schedule**: Monthly checks on the 1st of each month at 00:00 UTC
- **Scope**: Workflow files in `.github/workflows`
- **Limits**: Maximum 3 open pull requests at a time
- **Labels**: `dependencies`, `github-actions`, `ci`
- **Commit Prefix**: `ci`

### Managing Dependabot Pull Requests

When Dependabot creates a pull request:

1. **Review the changes**: Check what dependencies are being updated
2. **Run tests**: Ensure all tests pass with the new versions
3. **Check compatibility**: Verify that the updates don't break existing functionality
4. **Merge or close**: If everything looks good, merge the PR; otherwise, close and investigate

For npm updates, you can use `npm audit` to check for security vulnerabilities:
```bash
npm audit
```

### Special Considerations for This Project

This is a Docusaurus documentation site, so special attention should be paid to:

- **Docusaurus compatibility**: Ensure Docusaurus core packages remain compatible
- **Theme consistency**: Verify that UI changes don't break the documentation layout
- **Build process**: Confirm that the build process still works after updates

For more detailed information about Dependabot configuration and best practices, see [Dependabot Guide](docs/dependabot-guide.md).
