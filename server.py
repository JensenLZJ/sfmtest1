#!/usr/bin/env python3
"""
Simple HTTP server with Netlify-style redirects support
Handles clean URLs by redirecting to .html files
"""
import http.server
import socketserver
import urllib.parse
from pathlib import Path

# Redirect rules from _redirects file
REDIRECTS = {
    '/': '/index.html',
    '/about': '/about.html',
    '/contact': '/contact.html',
    '/schedule': '/schedule.html',
    '/team': '/team.html',
    '/opportunities': '/opportunities.html',
    '/privacy-policy': '/privacy-policy.html',
    '/request': '/request.html',
    '/brand': '/brand.html',
    '/apply': '/apply.html',
}

class RedirectHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the path
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        
        # Check if this is a redirect
        if path in REDIRECTS:
            redirect_to = REDIRECTS[path]
            # Check if file exists
            file_path = Path(redirect_to.lstrip('/'))
            if file_path.exists():
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
        
        # Check if path ends with .html and redirect to clean URL
        if path.endswith('.html') and path != '/index.html':
            clean_path = path[:-5]  # Remove .html
            if clean_path in REDIRECTS:
                self.send_response(301)
                self.send_header('Location', clean_path)
                self.end_headers()
                return
        
        # Default behavior - serve files normally
        return super().do_GET()

    def log_message(self, format, *args):
        # Custom log format
        print(f"{self.address_string()} - {args[0]}")

if __name__ == '__main__':
    PORT = 8000
    
    with socketserver.TCPServer(("", PORT), RedirectHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
