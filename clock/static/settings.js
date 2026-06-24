 let intervalId = null;

        // Listen for Keyboard Keypress Actions
        document.addEventListener('keydown', function(event) {
            // 1. SPACEBAR: Start / Stop Toggle
            if (event.code === 'Space') {
                event.preventDefault(); // Stop webpage scrolling
                
                fetch('/start', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'started') {
                            if (!intervalId) {
                                intervalId = setInterval(updateTime, 10); // Loop every 10ms
                            }
                        } else if (data.status === 'stopped') {
                            clearInterval(intervalId);
                            intervalId = null;
                        }
                    });
            }
            
            // 2. 'R' KEY: Reset Action
            if (event.key.toLowerCase() === 'r') {
                fetch('/reset', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'resetted') {
                            clearInterval(intervalId);
                            intervalId = null;
                            document.getElementById('time-readout').innerText = "0.000";
                        }
                    });
            }
        });

        // Loop worker: Fetches data and updates screen
        function updateTime() {
            fetch('/time')
                .then(response => response.json())
                .then(data => {
                    let elapsed = data.elapsed_time.toFixed(3);
                    document.getElementById('time-readout').innerText = elapsed;
                });
        }
                // 1. The Clock Worker: Pings Flask for the system time
function updateSystemClock() {
    // Calls our new GET route in clock.py
    fetch('/clock-time') 
        .then(response => response.json())
        .then(data => {
            // Injects the time string into an HTML element
            document.getElementById('clock-readout').innerText = data.current_time;
        })
        .catch(error => console.error("Clock error:", error));
}

// 2. Start the clock loop immediately when the webpage loads
// 1000 milliseconds = 1 second
setInterval(updateSystemClock, 1000);

// Run it once immediately so the user doesn't wait a full second for it to appear
updateSystemClock();
// Automatically triggers a secret reset to Python whenever the page is reloaded
window.onload = function() {
    fetch('/reset', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'resetted') {
                // Ensure the screen layout displays a clean start point
                document.getElementById('time-readout').innerText = "0.000";
            }
        })
        .catch(error => console.error("Auto-reset error:", error));
};

