# Group Assignment Roulette

## Tech Stack
- Frontend: React with Vite, React Router
- Backend: Python Flask with Flask-SocketIO for WebSocket real-time communication
- Database: CSV file (`groups.csv`) to store all assignments
- CSS animations for roulette spinner

## Project Structure
```
Rag/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── groups.csv
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── App.css
│       ├── api.js
│       ├── pages/
│       │   ├── NameInput.jsx
│       │   └── RouletteSpin.jsx
│       └── components/
│           ├── RouletteWheel.jsx
│           └── GroupTable.jsx
```

## Task 1: Initialize Backend (Python Flask)
- Create `backend/` directory
- Create `backend/requirements.txt` with:
  - flask==3.0.0
  - flask-socketio==5.3.6
  - python-socketio==5.10.0
- Create `backend/groups.csv` with headers: `timestamp,name,group`
- Create `backend/app.py` with:
  - Flask app with CORS enabled
  - Flask-SocketIO for WebSocket connections
  - API endpoints:
    - `GET /api/groups` - Return all group assignments from CSV
    - `POST /api/assign` - Accept {name, group}, append to CSV, emit WebSocket event
    - `GET /api/check-user/<name>` - Check if user already spun (search CSV)
  - WebSocket events:
    - `connect` - Send current group data to new client
    - `assignment_update` - Broadcast new assignment to all connected clients

## Task 2: Initialize Frontend (React + Vite)
- Run `npm create vite@latest frontend -- --template react` in workspace root
- Install dependencies: `npm install react-router-dom socket.io-client axios`
- Configure `vite.config.js` to proxy API requests to Flask backend (`http://localhost:5000`)

## Task 3: Create API Client (`frontend/src/api.js`)
- Axios instance configured to connect to Flask backend
- Functions:
  - `checkUser(name)` - Check if user already spun
  - `submitAssignment(name, group)` - Submit new assignment
  - `getAllGroups()` - Fetch all group assignments
- Socket.IO client setup:
  - Connect to Flask-SocketIO server
  - Listen for `assignment_update` events
  - Emit `get_groups` on connection

## Task 4: Create Name Input Page (`frontend/src/pages/NameInput.jsx`)
- Form with text input for user's name
- Validation to ensure name is not empty
- "Next" button that:
  - Calls `checkUser(name)` API to verify user hasn't spun
  - If duplicate: show error "This person has already been assigned!"
  - If new: navigate to `/spin` route with name as state
- Clean, centered UI with modern styling

## Task 5: Create Roulette Spin Page (`frontend/src/pages/RouletteSpin.jsx`)
- Receive user's name from navigation state
- Display the roulette wheel component
- Show "Spin" button to trigger animation
- After spin completes:
  - Randomly select group (North, West, East, or South)
  - Call `submitAssignment(name, group)` API
  - API saves to CSV and broadcasts via WebSocket
- Display success message: "[Name] has been assigned to [Group]!"
- Show GroupTable component with real-time data
- Button to "Add Another Person" that navigates back to name input

## Task 6: Create Roulette Wheel Component (`frontend/src/components/RouletteWheel.jsx`)
- Circular wheel divided into 4 colored sections:
  - North (blue) - 0-90 degrees
  - West (green) - 90-180 degrees
  - East (orange) - 180-270 degrees
  - South (red) - 270-360 degrees
- CSS animation for spinning effect with cubic-bezier easing (starts fast, slows down)
- Fixed pointer/arrow at top to indicate selected segment
- Spin duration: ~4 seconds
- Accepts `onSpinComplete` callback that returns the selected group
- Disable spin button during animation

## Task 7: Create Group Table Component (`frontend/src/components/GroupTable.jsx`)
- Receives group data as props from Socket.IO or API
- Display data in responsive table format:
  ```
  | North  | West   | East   | South  |
  |--------|--------|--------|--------|
  | Alice  | Charlie| Diana  | Eve    |
  | Bob    |        |        | Frank  |
  ```
- Auto-updates in real-time when Socket.IO receives `assignment_update` event
- Color-coded column headers matching wheel sections
- Scrollable if many users in a group

## Task 8: Setup Routing (`frontend/src/App.jsx`)
- Configure React Router with two routes:
  - `/` → NameInput page
  - `/spin` → RouletteSpin page
- Pass user's name via router state
- Initialize Socket.IO connection on app mount
- Setup global state for group data (useState + useEffect with Socket.IO listener)

## Task 9: Styling (`frontend/src/App.css`)
- Modern, clean design with gradient background
- Responsive layout for group rosters
- Smooth transitions and hover effects
- Color-coded group badges (North: blue, West: green, East: orange, South: red)
- Centered, visually appealing wheel design
- Table styling with alternating row colors
- Mobile-responsive grid for group columns

## Task 10: CSV File Structure (`backend/groups.csv`)
- Format:
  ```csv
  timestamp,name,group
  2026-04-23 10:30:15,Alice,North
  2026-04-23 10:31:22,Bob,North
  2026-04-23 10:32:45,Charlie,West
  2026-04-23 10:33:10,Diana,East
  2026-04-23 10:34:55,Eve,South
  ```
- Backend reads this file to check for duplicate names
- Backend appends new rows on each assignment
- Backend parses this file to return grouped data to frontend

## Implementation Details

### Backend Flask API (app.py)
```python
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

CSV_FILE = 'groups.csv'

def read_csv():
    # Read all assignments from CSV
    # Return list of dicts: [{timestamp, name, group}, ...]

def write_to_csv(name, group):
    # Append new row to CSV
    # Return success status

def get_grouped_data():
    # Parse CSV and return:
    # {"North": [...], "West": [...], "East": [...], "South": [...]}

def check_user_exists(name):
    # Search CSV for name (case-insensitive)
    # Return True/False

@app.route('/api/groups', methods=['GET'])
def get_groups():
    return jsonify(get_grouped_data())

@app.route('/api/assign', methods=['POST'])
def assign_group():
    # Validate request
    # Check if user already exists
    # Write to CSV
    # socketio.emit('assignment_update', {...})
    # Return success

@app.route('/api/check-user/<name>', methods=['GET'])
def check_user(name):
    return jsonify({"exists": check_user_exists(name)})

@socketio.on('connect')
def handle_connect():
    emit('current_groups', get_grouped_data())

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
```

### Roulette Wheel Logic
- Wheel is divided into 4 equal segments (90 degrees each)
- Random rotation: `360 * 5 + random(0, 360)` (5 full rotations + random landing)
- Calculate final position to determine which group is selected:
  - 0-90° → North
  - 90-180° → West
  - 180-270° → East
  - 270-360° → South
- Disable spin button during animation

### WebSocket Real-time Flow
1. User spins wheel and gets assigned to group
2. Frontend calls `POST /api/assign` with {name, group}
3. Backend saves to CSV
4. Backend emits `assignment_update` event with new assignment
5. All connected clients receive event via Socket.IO
6. GroupTable component updates automatically in real-time
7. All users see the new assignment instantly

### Duplicate Prevention
- On NameInput page: call `GET /api/check-user/<name>`
- Backend searches CSV for matching name (case-insensitive)
- If exists, show error: "This person has already been assigned!"
- Only allow navigation to spin page if name is new

## File Paths to Create
- `c:\Users\Edi\Desktop\Rag\backend\app.py`
- `c:\Users\Edi\Desktop\Rag\backend\requirements.txt`
- `c:\Users\Edi\Desktop\Rag\backend\groups.csv`
- `c:\Users\Edi\Desktop\Rag\frontend\index.html`
- `c:\Users\Edi\Desktop\Rag\frontend\package.json`
- `c:\Users\Edi\Desktop\Rag\frontend\vite.config.js`
- `c:\Users\Edi\Desktop\Rag\frontend\src\main.jsx`
- `c:\Users\Edi\Desktop\Rag\frontend\src\App.jsx`
- `c:\Users\Edi\Desktop\Rag\frontend\src\App.css`
- `c:\Users\Edi\Desktop\Rag\frontend\src\api.js`
- `c:\Users\Edi\Desktop\Rag\frontend\src\pages\NameInput.jsx`
- `c:\Users\Edi\Desktop\Rag\frontend\src\pages\RouletteSpin.jsx`
- `c:\Users\Edi\Desktop\Rag\frontend\src\components\RouletteWheel.jsx`
- `c:\Users\Edi\Desktop\Rag\frontend\src\components\GroupTable.jsx`

## Running the Application
1. **Backend**: `cd backend` → `pip install -r requirements.txt` → `python app.py`
2. **Frontend**: `cd frontend` → `npm install` → `npm run dev`
3. Backend runs on `http://localhost:5000`
4. Frontend runs on `http://localhost:5173`
5. Open multiple browser windows to see real-time WebSocket updates
