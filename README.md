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

This will install all dependencies. Alternatively, use Github desktop to clone the repo, but you'll still need to run npm to grab the dependencies

## Building the site

There are some gulp tasks set up to help building the site. Firstly, ensure you have created a new branch in git to work on, and make sure you have pulled the latest version from master. During dev, you can use
```
gulp watch
```
to run both browsersync (live reloading of the site) and to convert any sass files to css

## Deployment

Deployment is currently set up to a 'gh-pages' branch. Use the following to build the files

```
gulp build
```

This will deploy all code to the 'dist' folder, which can then be pushed to the 'gh-pages' branch. This branch is currently locked

```
git subtree push --prefix dist origin gh-pages
```
