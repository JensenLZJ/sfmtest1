#!/usr/bin/env python3
"""
Local dev server: PC at http://localhost:8000
Phone (same WiFi): http://<YOUR_PC_IP>:8000
Run: python serve.py
"""
import http.server
import os
import socketserver
import socket

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))


def local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return None


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Clean URLs: /schedule -> schedule.html, /about -> about.html, etc.
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            index = os.path.join(path, "index.html")
            if os.path.isfile(index):
                self.path = self.path.rstrip("/") + "/index.html"
        elif not os.path.exists(path) and not self.path.endswith(".html"):
            # No extension: try same path + .html
            html_path = path + ".html"
            if os.path.isfile(html_path):
                base, _, qs = self.path.partition("?")
                self.path = base + ".html" + ("?" + qs if qs else "")
        super().do_GET()

    def translate_path(self, path):
        path = path.split("?")[0]
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        super().end_headers()


os.chdir(ROOT)
with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print()
    print("  Local (this PC):  http://localhost:" + str(PORT))
    ip = local_ip()
    if ip:
        print("  Phone (same WiFi): http://" + ip + ":" + str(PORT))
    else:
        print("  Phone: use your PC IPv4 with :" + str(PORT) + " (same WiFi)")
    print()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
