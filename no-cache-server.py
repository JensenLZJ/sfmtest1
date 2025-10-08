#!/usr/bin/env python3
import http.server
import socketserver
import os

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Send headers that prevent ALL caching
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0, private')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        self.send_header('Last-Modified', '0')
        self.send_header('ETag', '0')
        self.send_header('Vary', '*')
        # Additional headers to prevent any caching
        self.send_header('Clear-Site-Data', '"cache", "cookies", "storage"')
        super().end_headers()

if __name__ == "__main__":
    PORT = 8080
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Starting no-cache server at http://localhost:{PORT}")
        print(f"Mobile access: http://192.168.1.5:{PORT}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
