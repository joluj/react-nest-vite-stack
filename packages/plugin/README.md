# react-nest-vite-stack

This library contains NX generators to set up React and NestJS applications.
The setup follows my subjective preferences and is not a one-size-fits-all solution.

## Features
- **React**: Generates a React application with Vite, TypeScript, and Tailwind CSS.
- **NestJS**: Generates a NestJS application with TypeScript and OpenAPI specification.

## Usage

To use this library, you can run the following command:

```bash
nx generate react-nest-vite-stack:nest [name] [options,...]
nx generate react-nest-vite-stack:nest [name] [options,...]

# Get help via --help
nx generate react-nest-vite-stack:nest --help
nx generate react-nest-vite-stack:react --help

# Dry runs are supported to preview changes without applying them
nx generate react-nest-vite-stack:nest my-nest-app --dry-run
nx generate react-nest-vite-stack:react my-react-app --dry-run
```
