#!/usr/bin/env python3
from __future__ import annotations

import json
import tempfile
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


SYNC_FILE = Path(tempfile.gettempdir()) / "snake-local-sync.json"


class SnakeLocalHandler(SimpleHTTPRequestHandler):
    sync_path = "/__snake_sync__"

    def _send_json(self, payload: dict, status: int = HTTPStatus.OK) -> None:
        encoded = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(encoded)

    def _send_empty(self, status: int = HTTPStatus.NO_CONTENT) -> None:
        self.send_response(status)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def _is_sync_request(self) -> bool:
        return urlparse(self.path).path == self.sync_path

    def do_OPTIONS(self) -> None:
        if self._is_sync_request():
            self._send_empty()
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_GET(self) -> None:
        if self._is_sync_request():
            if not SYNC_FILE.exists():
                self._send_json({"snapshot": None})
                return
            try:
                payload = json.loads(SYNC_FILE.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                payload = {"snapshot": None}
            self._send_json(payload)
            return
        super().do_GET()

    def do_POST(self) -> None:
        if self._is_sync_request():
            try:
                length = int(self.headers.get("Content-Length", "0"))
            except ValueError:
                self._send_json({"ok": False, "error": "bad length"}, HTTPStatus.BAD_REQUEST)
                return
            raw = self.rfile.read(length)
            try:
                payload = json.loads(raw.decode("utf-8"))
            except (UnicodeDecodeError, json.JSONDecodeError):
                self._send_json({"ok": False, "error": "bad json"}, HTTPStatus.BAD_REQUEST)
                return

            if not isinstance(payload, dict) or not isinstance(payload.get("snapshot"), dict):
                self._send_json({"ok": False, "error": "missing snapshot"}, HTTPStatus.BAD_REQUEST)
                return

            try:
                SYNC_FILE.write_text(json.dumps(payload), encoding="utf-8")
            except OSError:
                self._send_json({"ok": False, "error": "write failed"}, HTTPStatus.INTERNAL_SERVER_ERROR)
                return

            self._send_json({"ok": True})
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        if self._is_sync_request():
            try:
                SYNC_FILE.unlink(missing_ok=True)
            except OSError:
                self._send_json({"ok": False, "error": "delete failed"}, HTTPStatus.INTERNAL_SERVER_ERROR)
                return
            self._send_json({"ok": True})
            return
        self.send_error(HTTPStatus.NOT_FOUND)

    def end_headers(self) -> None:
        if not self._is_sync_request():
            self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8000), SnakeLocalHandler)
    print("Serving Snake on http://127.0.0.1:8000/")
    print(f"Pending local sync file: {SYNC_FILE}")
    server.serve_forever()


if __name__ == "__main__":
    main()
