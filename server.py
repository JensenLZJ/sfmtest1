"""
Local dev server that serves all pages and applies _redirects (clean URLs + external redirects).
Run: python server.py
Then open http://localhost:8080/ and use links like /about, /schedule, /contact, etc.
"""
import http.server
import os
import urllib.parse

PORT = 8000
REDIRECTS = {
    "/about": "/about.html",
    "/contact": "/contact.html",
    "/schedule": "/schedule.html",
    "/team": "/team.html",
    "/opportunities": "/opportunities.html",
    "/privacy-policy": "/privacy-policy.html",
    "/request": "/request.html",
    "/brand": "/brand.html",
    "/apply": "/opportunities.html",
    "/SFM-DOC-CL": "https://docs.google.com/document/d/1NWjJTojbJ7azQST_hQow3MmKKIaOXVb2Wi6BUh4WP4I",
    "/SFM-DOC-PH": "https://docs.google.com/document/d/1tYCRH3ngzCz3mAS-Z1jtVdZryMA8Ca-XY7IOYbsVnM0",
    "/SFM-DOC-EH": "https://docs.google.com/document/d/1Q-kWjKdyqgYQTZRCDyNuWrzoNqmVyHWv9hvg-dwzjvc",
}


# Headers so browsers don't cache when using this dev server
NO_CACHE_HEADERS = (
    ("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0"),
    ("Pragma", "no-cache"),
    ("Expires", "0"),
)


class RedirectsHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        for key, value in NO_CACHE_HEADERS:
            self.send_header(key, value)
        super().end_headers()

    def do_GET(self):
        path = urllib.parse.unquote(self.path)
        path = path.split("?")[0].split("#")[0]
        if not path.endswith("/"):
            path_no_slash = path
        else:
            path_no_slash = path.rstrip("/") or "/"

        # External redirect (full URL)
        target = REDIRECTS.get(path_no_slash)
        if target and target.startswith("http"):
            self.send_response(302)
            self.send_header("Location", target)
            self.end_headers()
            return

        # Clean URL -> .html (serve the file)
        if target and target.startswith("/"):
            file_path = self.translate_path(target)
            if os.path.isfile(file_path):
                self.path = target
                return http.server.SimpleHTTPRequestHandler.do_GET(self)
            self.path = target

        return http.server.SimpleHTTPRequestHandler.do_GET(self)


if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    with http.server.HTTPServer(("0.0.0.0", PORT), RedirectsHTTPRequestHandler) as httpd:
        print(f"Serving at http://localhost:{PORT}/ (and http://<your-ip>:{PORT}/ from other devices)")
        print("Clean URLs: /about, /schedule, /team, /contact, /request, /opportunities, /brand, /privacy-policy")
        httpd.serve_forever()
