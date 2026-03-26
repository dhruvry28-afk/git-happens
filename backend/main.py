"""
KisanSetu Backend API
======================
FastAPI server serving agricultural data for the KisanSetu frontend.

Endpoints:
  GET /api/weather-alerts          - Monsoon & flood weather alerts with crop impact
  GET /api/pest-outbreaks          - Locust and pest outbreak data with trajectories
  GET /api/market-prices           - Mandi prices, MSP, trends, and 7-day history

Run:
  python3 -m uvicorn main:app --reload --port 8000
"""

import json
import os
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# ── App Setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="KisanSetu API",
    description="Agricultural advisory backend for KisanSetu — India's AI-powered farmer companion.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS Configuration ─────────────────────────────────────────────────────────
# Allow requests from local frontend dev servers (Next.js, Vite, plain HTML)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",    # Next.js default
        "http://localhost:5173",    # Vite default
        "http://localhost:5174",
        "http://localhost:8080",    # Webpack / Vue CLI
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:8080",
        "file://",                  # Plain HTML file:// origin
        "*",                        # Allow all during development — tighten in production
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# ── Load Data ──────────────────────────────────────────────────────────────────
DATA_FILE = Path(__file__).parent / "dummy_data.json"

def load_data() -> dict:
    """Load and return the full dummy_data.json content."""
    if not DATA_FILE.exists():
        raise FileNotFoundError(f"Data file not found: {DATA_FILE}")
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ── Root ───────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    """Health check endpoint."""
    return {
        "status": "ok",
        "service": "KisanSetu API",
        "version": "1.0.0",
        "endpoints": [
            "/api/weather-alerts",
            "/api/pest-outbreaks",
            "/api/market-prices",
        ],
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health():
    """Liveness probe."""
    return {"status": "healthy"}


# ══════════════════════════════════════════════════════════════════════════════
#  ENDPOINT 1 — Weather Alerts
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/weather-alerts", tags=["Weather"])
def get_weather_alerts(
    district: Optional[str] = Query(None, description="Filter by district name (case-insensitive)"),
    state:    Optional[str] = Query(None, description="Filter by state name (case-insensitive)"),
    severity: Optional[str] = Query(None, description="Filter by severity: RED | ORANGE | YELLOW"),
    alert_type: Optional[str] = Query(None, description="Filter by type: EXTREME_MONSOON | CYCLONIC_STORM | FLOOD_WATCH"),
):
    """
    ## Weather Alerts

    Returns active monsoon, cyclonic, and flood weather alerts with:
    - Severity levels (RED / ORANGE / YELLOW)
    - Current weather conditions (temp, humidity, rainfall, NDVI, soil moisture)
    - 48-hour forecast
    - Per-crop impact advisories and do-not-irrigate lists
    - Emergency contacts

    ### Query Parameters
    - `district` — filter alerts for a specific district
    - `state`    — filter alerts for a specific state
    - `severity` — filter by RED / ORANGE / YELLOW
    - `alert_type` — filter by alert type
    """
    data = load_data()
    alerts = data.get("weather_alerts", [])

    # Apply filters
    if district:
        alerts = [a for a in alerts if a.get("district", "").lower() == district.lower()]
    if state:
        alerts = [a for a in alerts if a.get("state", "").lower() == state.lower()]
    if severity:
        alerts = [a for a in alerts if a.get("severity", "").upper() == severity.upper()]
    if alert_type:
        alerts = [a for a in alerts if a.get("alert_type", "").upper() == alert_type.upper()]

    return JSONResponse(content={
        "success": True,
        "count": len(alerts),
        "filters_applied": {
            "district": district,
            "state": state,
            "severity": severity,
            "alert_type": alert_type,
        },
        "data": alerts,
    })


# ══════════════════════════════════════════════════════════════════════════════
#  ENDPOINT 2 — Pest Outbreaks
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/pest-outbreaks", tags=["Pest"])
def get_pest_outbreaks(
    pest_type: Optional[str] = Query(None, description="Filter by pest type, e.g. LOCUST"),
    severity:  Optional[str] = Query(None, description="Filter by severity: CRITICAL | HIGH | MEDIUM | LOW"),
    status:    Optional[str] = Query(None, description="Filter by status: ACTIVE | MONITORING | CONTAINED"),
    state:     Optional[str] = Query(None, description="Filter by current location state"),
    crop:      Optional[str] = Query(None, description="Filter outbreaks affecting a specific crop, e.g. Wheat"),
):
    """
    ## Pest Outbreaks

    Returns locust swarm and pest outbreak data including:
    - Swarm size, origin, and current coordinates
    - Predicted movement trajectory (day-by-day districts)
    - Crop damage percentages and per-crop chemical advisories
    - Active government control operations (aerial/ground spraying)
    - Farmer action checklist and government helpline numbers
    - Compensation scheme information (PMFBY)

    ### Query Parameters
    - `pest_type` — e.g. `LOCUST`
    - `severity`  — CRITICAL / HIGH / MEDIUM / LOW
    - `status`    — ACTIVE / MONITORING / CONTAINED
    - `state`     — filter by current location state
    - `crop`      — filter outbreaks that threaten a specific crop
    """
    data = load_data()
    outbreaks = data.get("pest_outbreaks", [])

    # Apply filters
    if pest_type:
        outbreaks = [o for o in outbreaks if o.get("pest_type", "").upper() == pest_type.upper()]
    if severity:
        outbreaks = [o for o in outbreaks if o.get("severity", "").upper() == severity.upper()]
    if status:
        outbreaks = [o for o in outbreaks if o.get("status", "").upper() == status.upper()]
    if state:
        outbreaks = [
            o for o in outbreaks
            if o.get("current_location", {}).get("state", "").lower() == state.lower()
        ]
    if crop:
        outbreaks = [
            o for o in outbreaks
            if any(c.get("crop", "").lower() == crop.lower() for c in o.get("crops_at_risk", []))
        ]

    return JSONResponse(content={
        "success": True,
        "count": len(outbreaks),
        "filters_applied": {
            "pest_type": pest_type,
            "severity": severity,
            "status": status,
            "state": state,
            "crop": crop,
        },
        "data": outbreaks,
    })


# ══════════════════════════════════════════════════════════════════════════════
#  ENDPOINT 3 — Market Prices
# ══════════════════════════════════════════════════════════════════════════════
@app.get("/api/market-prices", tags=["Market"])
def get_market_prices(
    crop:      Optional[str] = Query(None, description="Filter by crop name, e.g. Wheat"),
    action:    Optional[str] = Query(None, description="Filter by recommended action: hold | sell"),
    trend:     Optional[str] = Query(None, description="Filter by price trend: up | down | stable"),
    sentiment: Optional[str] = Query(None, description="Filter by market sentiment, e.g. bullish"),
    min_price: Optional[int] = Query(None, description="Minimum current price (₹/quintal)"),
    max_price: Optional[int] = Query(None, description="Maximum current price (₹/quintal)"),
):
    """
    ## Market Prices (Mandi Data)

    Returns live Agmarknet-style crop prices including:
    - Current price vs MSP (Minimum Support Price)
    - 7-day price trend and forecast
    - AI-powered buy/sell/hold recommendation with reason
    - Prices across 5 major nearby mandis with arrival volumes
    - 7-day price history for charting
    - Storage advisories and export prices (USD)

    ### Query Parameters
    - `crop`      — filter a specific crop (e.g. `Wheat`, `Onion`, `Cotton`)
    - `action`    — `hold` or `sell`
    - `trend`     — `up`, `down`, or `stable`
    - `sentiment` — bullish / bearish / neutral / very bullish
    - `min_price` / `max_price` — filter by current price range (₹/quintal)
    """
    data = load_data()
    market_data = data.get("market_prices", {})
    crops = market_data.get("crops", [])

    # Apply filters
    if crop:
        crops = [c for c in crops if c.get("crop", "").lower() == crop.lower()]
    if action:
        crops = [c for c in crops if c.get("action", "").lower() == action.lower()]
    if trend:
        crops = [c for c in crops if c.get("trend", "").lower() == trend.lower()]
    if sentiment:
        crops = [c for c in crops if sentiment.lower() in c.get("market_sentiment", "").lower()]
    if min_price is not None:
        crops = [c for c in crops if c.get("price", 0) >= min_price]
    if max_price is not None:
        crops = [c for c in crops if c.get("price", 0) <= max_price]

    return JSONResponse(content={
        "success": True,
        "meta": {
            "last_updated": market_data.get("last_updated"),
            "data_source": market_data.get("data_source"),
            "currency": market_data.get("currency"),
            "unit": market_data.get("unit"),
        },
        "count": len(crops),
        "filters_applied": {
            "crop": crop,
            "action": action,
            "trend": trend,
            "sentiment": sentiment,
            "min_price": min_price,
            "max_price": max_price,
        },
        "data": crops,
    })


# ── Entry point for direct execution ─────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
