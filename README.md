## Prerequisites

[Node.js], which also installs [npm].

## Installation

    npm install

Note that if you get any warnings about vulnerabilities, you can choose to fix them or not.  Either way the app will run.

### Creating the Download Folder

From the top-level of the project directory, create an `experiments` directory.  This is where the runtime will place created experiments that are then available for download.

If you change the location from the default location of `PROJECT_ROOT/experiments/`, then you must tell the runtime where it is when launching node.  For example,

    DOWNLOAD_DIR=./dist/dev/ node ./server/app.js

This tells the runtime to download the files into `PROJECT_ROOT/dist/dev/experiments`.

In additions, you **must** also change the location of the download directory in the front-end code in `./client/component/config.js`.  For example, continuing with the same location from the above example:

    const DOWNLOAD_PATH = `${HOST}:${DOWNLOAD_PORT}`;

Should be changed to:

    const DOWNLOAD_PATH = `${HOST}:${DOWNLOAD_PORT}/dist/dev`;

### SQL Server Database

You'll find the database schema in `db/schema`.  Assuming that SQL Server is already installed and running on the machine, you can import by issuing the following command in the same directory:

    sqlcmd -S localhost -U SA -i schema

Note that I'm running Debian Linux, and I'm not sure if the `sqlcmd` tool is platform-agnostic.

## Starting with Webpack

### Unix

    npm start
    or
    make serve

Note that this backgrounds the Node process.  All logging to `stdout` is from [webpack].

### Windows

If you have trouble starting the application on Windows, you'll need to run the commands manually from the root of the project directory:

    node ./server/app.js &

    Running with webpack as a server:
        npx webpack-dev-server --open

    Running with a pre-built file (also, see the section below, `Starting without Webpack`):
        npx webpack

    This creates a `dist` directory from which you'll copy the `serial_number_generator` script to your node server.

## Starting without Webpack

### Get the Build
- Build either by running `make prod` on Unix or `npx webpack` on Windows.
- Grab the build in the `./dist/dev/` directory.

1. Put `index.html` and `serial_number_generator.js` in the same directory wherever your webserver is serving files.
2. Start the Express webserver, which will communicate with the backend SQL Server database.  This command can be run in the root project directory (wherever you `git` cloned the project):

        node server/app.js

3. Simply point your browser at the `index.html` file.

## Type Checking

This project uses [Flow] for static type checking.  Running:

    npm run flow

will check every file with `// @flow` in the head of the file.

If you receive errors when checking that resemble the following, use [flow-typed] to install a library definition for the module:

    Cannot resolve module react-router-dom.

To do this, simply run:

    npx flow-typed install react-router-dom

## Environment Variables

This project uses the [dotenv] module to load all environment variables needed by the runtime for the `SQL Server` database.  This file is called `.env` and is located in the root of the project.

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

