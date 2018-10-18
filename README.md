## Prerequisites

[Node.js], which also installs [npm].

## Installation

    npm install

> If you get any warnings about vulnerabilites, you can choose to fix them or not.  Either way the app will run.

## Starting

    npm start
    or
    make serve

Note that this backgrounds the Node process.  All logging to `stdout` is from [webpack].

## Windows

If you have trouble starting the application on Windows, you'll need to run the commands manually from the root of the project directory:

    node ./server/app.js &
	./node_modules/.bin/webpack-dev-server --open

# Type Checking

This project uses [Flow] for static type checking.  Running:

    npm run flow

will check every file with `// @flow` in the head of the file.

If you receive errors when checking that resemble the following, use [flow-typed] to install a library definition for the module:

    Cannot resolve module react-router-dom.

To do this, simply run:

    npx flow-typed install react-router-dom

## Environment Variables

This project uses the [dotenv] module to load all environment variables needed by the runtime.  For obvious reasons, we are not versioning this file.

## Misc

The UI is bootstrapped using webpack on port 3000.  To view, simply:

    http://localhost:3000

The [Express] web framework is handling the network requests and runs on port 3001.

[Node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[webpack]: https://webpack.js.org/
[Flow]: https://flow.org/
[flow-typed]: https://github.com/flow-typed/flow-typed
[dotenv]: https://www.npmjs.com/package/dotenv
[Express]: https://expressjs.com/

