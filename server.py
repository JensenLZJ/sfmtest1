#!/usr/bin/env python3
"""
Simple HTTP server with Netlify-style redirects support
Handles clean URLs by redirecting to .html files
"""
import http.server
import socketserver
import urllib.parse
from pathlib import Path

# Redirect rules from _redirects file (values starting with http are external)
REDIRECTS = {
    '/': '/index.html',
    '/SFM-DOC-PH': 'https://docs.google.com/document/d/1tYCRH3ngzCz3mAS-Z1jtVdZryMA8Ca-XY7IOYbsVnM0/edit?usp=sharing',
    '/SFM-DOC-EH': 'https://docs.google.com/document/d/1Q-kWjKdyqgYQTZRCDyNuWrzoNqmVyHWv9hvg-dwzjvc/edit?usp=sharing',
    '/SFM-DOC-CL': 'https://docs.google.com/document/d/1NWjJTojbJ7azQST_hQow3MmKKIaOXVb2Wi6BUh4WP4I/edit?usp=sharing',
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
            # External URL → HTTP redirect
            if redirect_to.startswith('http://') or redirect_to.startswith('https://'):
                self.send_response(302)
                self.send_header('Location', redirect_to)
                self.send_header('X-Robots-Tag', 'noindex, nofollow')
                self.end_headers()
                return
            # Internal → serve .html file
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
