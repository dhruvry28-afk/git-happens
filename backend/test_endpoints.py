"""
KisanSetu API — Endpoint Test Script
=====================================
Pings all three endpoints + filtered variants and prints results.

Usage:
  python3 test_endpoints.py
"""

import json
import urllib.request
import urllib.error
import time

BASE = "http://localhost:8000"
results = []

def ping(label: str, path: str) -> dict:
    url = f"{BASE}{path}"
    try:
        start = time.time()
        with urllib.request.urlopen(url, timeout=5) as r:
            elapsed_ms = round((time.time() - start) * 1000, 1)
            body = json.loads(r.read())
            status = r.status
        results.append({"label": label, "url": url, "status": status, "elapsed_ms": elapsed_ms, "body": body})
        print(f"  ✅  [{status}]  {label}  ({elapsed_ms} ms)")
        return body
    except urllib.error.URLError as e:
        results.append({"label": label, "url": url, "status": "ERROR", "error": str(e)})
        print(f"  ❌  [ERR]  {label}  — {e}")
        return {}

print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print("  KisanSetu API — Endpoint Test Suite")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

print("[ Health ]")
ping("Root health check",          "/")
ping("Liveness probe",             "/health")
print()

print("[ Weather Alerts ]")
ping("All weather alerts",          "/api/weather-alerts")
ping("Filter: severity=RED",        "/api/weather-alerts?severity=RED")
ping("Filter: severity=ORANGE",     "/api/weather-alerts?severity=ORANGE")
ping("Filter: district=Pune",       "/api/weather-alerts?district=Pune")
ping("Filter: type=FLOOD_WATCH",    "/api/weather-alerts?alert_type=FLOOD_WATCH")
print()

print("[ Pest Outbreaks ]")
ping("All pest outbreaks",          "/api/pest-outbreaks")
ping("Filter: pest_type=LOCUST",    "/api/pest-outbreaks?pest_type=LOCUST")
ping("Filter: status=ACTIVE",       "/api/pest-outbreaks?status=ACTIVE")
ping("Filter: severity=CRITICAL",   "/api/pest-outbreaks?severity=CRITICAL")
ping("Filter: crop=Wheat",          "/api/pest-outbreaks?crop=Wheat")
print()

print("[ Market Prices ]")
ping("All market prices",           "/api/market-prices")
ping("Filter: crop=Wheat",          "/api/market-prices?crop=Wheat")
ping("Filter: action=sell",         "/api/market-prices?action=sell")
ping("Filter: trend=up",            "/api/market-prices?trend=up")
ping("Filter: min_price=4000",      "/api/market-prices?min_price=4000")

print("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
print(f"  Total: {len(results)} requests  |  Passed: {sum(1 for r in results if r.get('status') == 200)}  |  Failed: {sum(1 for r in results if r.get('status') != 200)}")
print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

# Dump full JSON for artifact
print(json.dumps(results, indent=2, ensure_ascii=False))
