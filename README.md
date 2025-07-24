# Beast Terminal

## Overview
Beast Terminal is a full-stack application that consists of a React frontend and a Node.js backend. The project also includes a Discord bot that can post messages to both the frontend and backend, enhancing interactivity and communication.

## Project Structure
```
beast-terminal
├── backend
│   ├── src
│   │   ├── server.js          # Entry point for the backend server
│   │   └── discord-bot
│   │       └── bot.js         # Implementation of the Discord bot
│   ├── package.json            # Backend dependencies and scripts
│   └── README.md               # Backend documentation
├── frontend
│   ├── src
│   │   ├── App.jsx             # Main component of the React application
│   │   └── index.jsx           # Entry point for the React application
│   ├── public
│   │   └── index.html          # Main HTML file for the React application
│   ├── package.json            # Frontend dependencies and scripts
│   └── README.md               # Frontend documentation
└── README.md                   # General project documentation
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd beast-terminal
   ```

2. Install dependencies for the backend:
   ```
   cd backend
   npm install
   ```

3. Install dependencies for the frontend:
   ```
   cd frontend
   npm install
   ```

### Running the Application

#### Backend
To start the backend server, navigate to the backend directory and run:
```
npm start
```

#### Frontend
To start the React application, navigate to the frontend directory and run:
```
npm start
```

### Discord Bot
The Discord bot is included in the backend. Ensure you have the necessary bot token and permissions set up in `backend/src/discord-bot/bot.js`. The bot can send messages to both the frontend and backend as configured.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.