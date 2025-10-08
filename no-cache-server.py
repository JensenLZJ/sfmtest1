#!/usr/bin/env python3
import http.server
import socketserver
import os
import urllib.parse

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
    
    def do_GET(self):
        # Handle clean URLs by mapping them to .html files
        clean_urls = {
            '/about': '/about.html',
            '/contact': '/contact.html',
            '/schedule': '/schedule.html',
            '/team': '/team.html',
            '/opportunities': '/opportunities.html',
            '/privacy-policy': '/privacy-policy.html',
            '/request': '/request.html',
            '/coming-soon': '/coming-soon.html'
        }
        
        # Check if this is a clean URL that needs to be mapped
        if self.path in clean_urls:
            self.path = clean_urls[self.path]
        
        # Call the parent method to handle the request
        super().do_GET()

if __name__ == "__main__":
    PORT = 8080
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), NoCacheHTTPRequestHandler) as httpd:
        print(f"Starting no-cache server at http://localhost:{PORT}")
        print(f"Mobile access: http://192.168.1.5:{PORT}")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
