#!/usr/bin/env python
"""Start server, wait for initialization, then stop"""
import time
import signal
import subprocess
import sys

# Start the uvicorn server
process = subprocess.Popen(
    [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8000"],
    cwd="D:\\Project3\\api"
)

# Wait for 3 seconds for initialization
time.sleep(3)

# Send SIGTERM to stop the process
process.send_signal(signal.SIGTERM)
process.wait()

print("Server initialization complete")
