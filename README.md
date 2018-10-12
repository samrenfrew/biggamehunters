## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You'll need both npm and git installed before development. The site is built using bootstrap and nunjucks, with some gulp tasks to help preview during dev

### Installing

To get this set up, run the following in your working directory to clone this repo

```
git clone https://github.com/samrenfrew/biggamehunters.git
```

cd into the 'biggamehunters' directory and then run

```
npm install --save-dev
```

This will install all dependencies. Alternatively, use Github desktop to clone the repo, but you'll still need to run npm to grab the dependencies.

## Building the site

All changes should be made within the 'dev' folder. Create a new branch within git, and make sure you have pulled the latest version.

The site uses nunjucks for development - site pages are held in 'pages' folder, whilst 'snippets' has the templates used to build the pages

To preview whilst you're developing, use
```
gulp watch
```
to run the build task - this will combine all the nunjucks templates, as well as load browsersync for live reloading after each file is saved

## Deployment

Deployment is currently set up to a 'release' branch. Use the following to build the files
```
gulp build
```
This will deploy all code to the 'dist' folder, which can then be pushed to the 'release' branch. The code can then be fetched by the server remotely
