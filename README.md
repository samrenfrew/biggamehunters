## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You'll need both node and git installed before running this

### Installing

To get this set up, run the following in your working directory to clone this repo

```
git clone https://github.com/samrenfrew/biggamehunters.git
```

cd into the 'biggamehunters' directory and then run

```
npm install --save-dev
```

This will install all dependencies.

## Building the site

There are some gulp tasks set up to help building the site...they may or may not work currently

```
gulp watch
```

Running this task should run both browsersync (live reloading of the site) and convert any sass files to css

## Deployment

Deployment is currently set up to a 'dist' branch. Use the following to build the files

```
gulp build
```

This will deploy all code to the 'dist' folder, which can then be pushed to the dist branch

```
git subtree push --prefix dist origin dist
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
