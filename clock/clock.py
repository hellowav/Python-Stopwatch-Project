import time
import datetime  # <-- NEW: Needed to read your computer's live clock
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Global variables to track the stopwatch state
start_time = None
elapsed_time = 0.0
is_running = False

@app.route('/')
def home():
    global start_time, elasped_time, get_time 
    is_running = False
    elasped_time = 0.0
    start_time = None 
    """Renders the main terminal user interface."""
    return render_template('index.html')

@app.route('/clock-time', methods=['GET'])
def get_current_clock():
    """NEW: Fetches the live wall-clock time from your operating system."""
    now = datetime.datetime.now()
    # Formats it into a clean string (Hours:Minutes:Seconds)
    time_string = now.strftime("%H:%M:%S")
    return jsonify({"current_time": time_string})

@app.route('/start', methods=['POST'])
def toggle_stopwatch():
    """Starts or stops the stopwatch depending on its current state."""
    global start_time, is_running, elapsed_time
    
    if not is_running:
        start_time = time.time() - elapsed_time
        is_running = True
        return jsonify({"status": "started"})
    else:
        # STOPPING: Lock in the final calculation before shutting down
        elapsed_time = time.time() - start_time
        is_running = False
        return jsonify({"status": "stopped"})

@app.route('/reset', methods=['POST'])
def reset_stopwatch():
    """Resets all stopwatch counters back to zero."""
    global start_time, elapsed_time, is_running
    start_time = None
    elapsed_time = 0.0
    is_running = False
    return jsonify({"status": "resetted"})

@app.route('/time', methods=['GET'])
def get_time():
    """Returns the current elapsed time to the browser."""
    global start_time, is_running, elapsed_time
    
    if is_running and start_time is not None:
        current_elapsed = time.time() - start_time
        return jsonify({"elapsed_time": current_elapsed})
    else:
        return jsonify({"elapsed_time": elapsed_time})

if __name__ == '__main__':
    app.run(debug=True)
