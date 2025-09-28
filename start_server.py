#!/usr/bin/env python3
"""
Simple HTTP server for SamudraFM website
Run this script to start a local server at http://127.0.0.1:8000/
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
HOST = '127.0.0.1'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler to serve files with proper MIME types"""
    
    def end_headers(self):
        # Add CORS headers for API testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def guess_type(self, path):
        """Override to set correct MIME types"""
        mimetype, encoding = super().guess_type(path)
        
        # Ensure JavaScript files are served with correct MIME type
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html'):
            return 'text/html'
        
        return mimetype

def start_server():
    """Start the HTTP server"""
    # Change to the script's directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Create server
    with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🚀 SamudraFM Server Starting...")
        print(f"📡 Server running at: http://{HOST}:{PORT}/")
        print(f"📁 Serving files from: {script_dir}")
        print(f"🌐 Open your browser to: http://{HOST}:{PORT}/")
        print(f"⏹️  Press Ctrl+C to stop the server")
        print("-" * 50)
        
        # Try to open browser automatically
        try:
            webbrowser.open(f'http://{HOST}:{PORT}/')
            print("🌐 Browser opened automatically")
        except:
            print("⚠️  Could not open browser automatically")
        
        print("-" * 50)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped by user")
            sys.exit(0)

if __name__ == "__main__":
    start_server()
