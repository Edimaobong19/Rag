# Group Assignment Roulette

A web application that randomly assigns users to groups (North, West, East, South) using a roulette wheel animation with real-time updates.

## Features

- 🎯 **Roulette Wheel Animation** - Beautiful spinning wheel with 4 groups
- 📊 **Real-time Updates** - All users see assignments instantly via WebSocket
- 📁 **CSV Storage** - All assignments stored in `backend/groups.csv`
- 🚫 **Duplicate Prevention** - Each person can only spin once
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean, gradient-based design

## Tech Stack

**Backend:**
- Python Flask
- Flask-SocketIO (WebSocket)
- CSV file storage

**Frontend:**
- React 18
- Vite
- React Router
- Socket.IO Client
- Axios

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm

### Setup

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

### Option 1: Using Batch Scripts (Windows)

1. **Start Backend** (double-click):
   ```
   start-backend.bat
   ```

2. **Start Frontend** (double-click):
   ```
   start-frontend.bat
   ```

### Option 2: Manual Start

1. **Start Backend:**
   ```bash
   cd backend
   python app.py
   ```
   Backend runs on: `http://localhost:5000`

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

3. Open your browser to `http://localhost:5173`

## Usage

1. **Enter Your Name** - Type your name on the first page
2. **Spin the Wheel** - Watch the roulette animation
3. **Get Assigned** - See which group (North, West, East, or South) you're assigned to
4. **View All Groups** - See the complete group roster in a table format
5. **Real-time Updates** - Open multiple browser windows to see live updates

## Project Structure

```
Rag/
├── backend/
│   ├── app.py              # Flask server with WebSocket
│   ├── requirements.txt    # Python dependencies
│   └── groups.csv          # Assignment database
├── frontend/
│   ├── src/
│   │   ├── api.js          # API & Socket.IO client
│   │   ├── App.jsx         # Main app with routing
│   │   ├── App.css         # Styles
│   │   ├── pages/
│   │   │   ├── NameInput.jsx    # Name entry page
│   │   │   └── RouletteSpin.jsx # Spin wheel page
│   │   └── components/
│   │       ├── RouletteWheel.jsx # Wheel animation
│   │       └── GroupTable.jsx    # Group roster table
│   ├── package.json
│   └── vite.config.js
├── start-backend.bat       # Windows backend starter
└── start-frontend.bat      # Windows frontend starter
```

## API Endpoints

- `GET /api/groups` - Get all group assignments
- `POST /api/assign` - Assign a user to a group
- `GET /api/check-user/<name>` - Check if user already spun

## WebSocket Events

- `connect` - Server sends current group data
- `assignment_update` - Broadcast new assignment to all clients

## CSV Format

```csv
timestamp,name,group
2026-04-23 10:30:15,Alice,North
2026-04-23 10:31:22,Bob,West
```

## License

MIT
