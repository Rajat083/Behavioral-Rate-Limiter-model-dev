# ML-Driven Behavioral Rate Limiting

## Real-Time Bot Detection via Statistical Anomaly Isolation

### 🚀 Overview
Traditional rate limiters block users after a fixed number of requests (**N requests per minute/hour**). While effective against obvious abuse, they fail to detect **“low-and-slow” bots** that mimic human-like request rates but behave unnaturally.

This project implements a **behavioral-based detection** engine that identifies ***automated agents*** by analyzing the "rhythm" and "intent" of traffic rather than just the volume.

---

###  **Key Idea**
Instead of asking:
> "How many requests did the user make?"

We ask:
> "Does this user behave like a human?"

---

### ⚙️ Features
- Detects **low-rate bots**
- Uses **behavioral analysis**
- Reduces need for CAPTCHAs
- Works as **API middleware**
- Scalable as a **microservice (Go/Rust)**

---

### 🧩 Core Concepts

#### *1. Inter-arrival Time*
* Inter-Arrival Time (IAT) Variance: Calculating the Coefficient of Variation ($CV = \frac{\sigma}{\mu}$) to detect non-human periodicity.

* ```bash
  Human: 1.2s, 5.6s, 0.8s, 10s
  Bot: 2s, 2s, 2s, 2s
  ```


#### *2. Path Entropy*
* Measuring the Shannon Entropy of navigation sequences to differentiate between organic user flows and algorithmic scraping.

* ```bash
  Human: /home → /products → /cart → /profile
  Bot: /api/data → /api/data → /api/data
  ```

---

## 🏗️ Architecture

<p align="center">
  <img src="arch.svg" width="700"/>
</p>

--- 

### 📈 Roadmap
- Feature Engineering & Statistical Analysis on **CIC-IDS2017**.

- Model Training & Hyperparameter Tuning (Contamination factor calibration).

- Exporting Model Weights for production-ready inference.

- Phase 2: Development of a high-performance Go/Rust-wrapper for real-time API mitigation.
