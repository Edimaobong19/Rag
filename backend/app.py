from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import csv
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

CSV_FILE = os.path.join(os.path.dirname(__file__), 'groups.csv')

def read_csv():
    """Read all assignments from CSV file"""
    assignments = []
    if os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'r', newline='', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                assignments.append(row)
    return assignments

def write_to_csv(name, group):
    """Append a new assignment to CSV file"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([timestamp, name, group])
    return True

def get_grouped_data():
    """Parse CSV and return grouped data"""
    grouped = {
        "North": [],
        "West": [],
        "East": [],
        "South": []
    }
    
    assignments = read_csv()
    for assignment in assignments:
        group = assignment['group']
        name = assignment['name']
        if group in grouped:
            grouped[group].append(name)
    
    return grouped

def check_user_exists(name):
    """Search CSV for name (case-insensitive)"""
    assignments = read_csv()
    name_lower = name.lower().strip()
    for assignment in assignments:
        if assignment['name'].lower().strip() == name_lower:
            return True
    return False

def get_forced_group(name):
    """Check if name should be forced to a specific group"""
    west_names = ['edimaobong', 'edima', 'edima isaac', 'jeremiah', 'jeremiah oyebode', 'oyebode']
    name_lower = name.lower().strip()
    if name_lower in west_names:
        return 'West'
    return None

def get_balanced_group(preferred_group):
    """Get a balanced group - if preferred group would create imbalance, return smaller group"""
    grouped_data = get_grouped_data()
    
    # Find min and max group sizes
    group_counts = {group: len(grouped_data[group]) for group in grouped_data}
    min_count = min(group_counts.values())
    max_count = max(group_counts.values())
    
    # If preferred group already has more people than the smallest group
    if group_counts[preferred_group] > min_count:
        # Get all groups with the minimum count
        smallest_groups = [g for g in grouped_data if group_counts[g] == min_count]
        import random
        return random.choice(smallest_groups)
    
    # If all groups are balanced (difference < 2), use preferred group
    if max_count - min_count < 2:
        return preferred_group
    
    # If there's already an imbalance, assign to smallest
    smallest_groups = [g for g in grouped_data if group_counts[g] == min_count]
    import random
    return random.choice(smallest_groups)

@app.route('/api/groups', methods=['GET'])
def get_groups():
    """Return all group assignments"""
    return jsonify(get_grouped_data())

@app.route('/api/assign', methods=['POST'])
def assign_group():
    """Assign a user to a group - saves the exact wheel result to CSV"""
    data = request.json
    name = data.get('name', '').strip()
    group = data.get('group', '').strip()
    
    # Validate input
    if not name or not group:
        return jsonify({"error": "Name and group are required"}), 400
    
    if group not in ['North', 'West', 'East', 'South']:
        return jsonify({"error": "Invalid group"}), 400
    
    # Check if user already exists
    if check_user_exists(name):
        return jsonify({"error": "This person has already been assigned!"}), 409
    
    # Check if name should be forced to West
    forced_group = get_forced_group(name)
    if forced_group:
        group = forced_group
    else:
        # Balance groups - if wheel result would create imbalance, reassign to smaller group
        group = get_balanced_group(group)
    
    # Save the (possibly rebalanced) result to CSV
    write_to_csv(name, group)
    
    # Broadcast update to all connected clients
    grouped_data = get_grouped_data()
    socketio.emit('assignment_update', {
        'name': name,
        'group': group,
        'groups': grouped_data
    })
    
    return jsonify({
        "success": True,
        "message": f"{name} assigned to {group}",
        "groups": grouped_data
    })

@app.route('/api/check-user/<name>', methods=['GET'])
def check_user(name):
    """Check if a user has already been assigned"""
    exists = check_user_exists(name)
    return jsonify({"exists": exists, "name": name})

@socketio.on('connect')
def handle_connect():
    """Send current group data to newly connected client"""
    emit('current_groups', get_grouped_data())

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    print("Starting Group Assignment Roulette Server...")
    print("Server running on http://localhost:5000")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
