# Backend README for Beast Terminal

# Beast Terminal Backend

This is the backend server for the Beast Terminal project. It is built using Node.js and Express, and it includes a Discord bot that can interact with both the backend and frontend.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Discord Bot](#discord-bot)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/beast-terminal.git
   ```

2. Navigate to the backend directory:
   ```
   cd beast-terminal/backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the backend server, run:
```
npm start
```

The server will be running on `http://localhost:5000` by default.

## API Routes

- `GET /api/example`: An example route to demonstrate the API.

## Discord Bot

The Discord bot is implemented in `src/discord-bot/bot.js`. It connects to the Discord API and can send messages to both the frontend and backend. Make sure to set up your Discord bot token in the environment variables.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.