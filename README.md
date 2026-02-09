# vtolvr-atc-site

This webpage is designed to store utilities for VTOL VR ATC lobbies.

## Features

- Simple Express.js server
- EJS template rendering
- Clean and responsive design

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/TheRavenSeb/vtolvr-atc-site.git
cd vtolvr-atc-site
```

2. Install dependencies:
```bash
npm install
```

## Usage

Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

You can change the port by setting the `PORT` environment variable:
```bash
PORT=8080 npm start
```

## Project Structure

```
vtolvr-atc-site/
├── server.js           # Main Express server file
├── views/              # EJS templates directory
│   └── index.ejs      # Home page template
├── public/            # Static files (CSS, JS, images)
├── package.json       # Project dependencies
└── README.md         # This file
```

## Development

The server uses Express.js with EJS templating engine. To add new pages:

1. Create a new `.ejs` file in the `views/` directory
2. Add a route in `server.js` to render your new template
3. Restart the server to see your changes

## License

See LICENSE file for details.
