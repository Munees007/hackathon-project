# Real-Time Innovative Codathon Questions

## Level 0 (Easy - 5 Questions)
*Focus: Conditional Logic, Basic Calculations, and Real-world Formulas.*

### Q1: Smart Water Meter (Leak Detector)
**Problem:** A smart meter monitors water flow per minute. To detect a leak, it checks if a constant flow exists for a duration of 5 minutes without any "zero-flow" intervals.
- **Rules:**
  - If the average flow across 5 measurements is > 2.0L/min AND no single measurement is 0, output `LEAK DETECTED`.
  - Otherwise, output `NORMAL`.
**Input:** 5 floats representing flow rate per minute.
**Output:** `LEAK DETECTED` or `NORMAL`

### Q2: Aviation Luggage Scanner
**Problem:** A self-service kiosk calculates baggage fees.
- **Base Allowance:** 15 kg.
- **Overweight Fee:** Rs. 500 per kg forทุก kg above 15.
- **Oversize Surcharge:** If `Length + Width + Height > 158cm`, add a flat **Rs. 1000** surcharge.
**Input:** Weight (float), Length, Width, Height (ints).
**Output:** `Total Fee: Rs. [Value]`

### Q3: Cinema Dynamic Pricing
**Problem:** A theater uses dynamic pricing.
- **Base Price:** Rs. 200.
- **Age Discount:** Age < 12 (50% off), Age > 60 (30% off).
- **Time Surcharge:** If the show is after 18:00 (6 PM), add **Rs. 50** to the final price.
**Input:** Age (int), Show Hour (int, 0-23).
**Output:** `Ticket Price: Rs. [Value]`

### Q4: Fitness Workout Tracker
**Problem:** Calculate calories burned.
- **Formula:** `(Duration * Intensity) / 10`.
- **Intensity Levels:** 
  - Walking: 3, Running: 8, Cycling: 6.
- **Heart Rate Bonus:** If `Avg Heart Rate > 150`, add **10% extra** to the total calories.
**Input:** Duration in mins (int), Exercise Type (W/R/C), Avg Heart Rate (int).
**Output:** `Calories: [Value] kcal` (round to 1 decimal).

### Q5: Smart Vending Machine
**Problem:** Dispense change using the fewest coins. Available coins: Rs. 10, 5, 2, 1.
**Input:** Item Price (int), Amount Paid (int).
**Output:** `Change: 10x[a], 5x[b], 2x[c], 1x[d]`

---

## Level 1 (Medium - 5 Questions)
*Focus: Data Structures, Windows, and Real-time Processing.*

### Q1: Stock Market "Golden Cross"
**Problem:** Detect a Golden Cross, which occurs when a 3-day Moving Average (MA3) crosses above a 5-day Moving Average (MA5).
**Input:** 7 days of closing prices (floats).
**Output:** Output `GOLDEN CROSS at Day [i]` for the first day where MA3 > MA5 (if it was <= before).

### Q2: Flash Sale Inventory Manager
**Problem:** You have 50 units of a "SuperPhone". Process a list of orders.
- If an order quantity is available, subtract from stock and print `ORDER_FILLED`.
- If partial stock is available, fill the remaining and print `PARTIAL_FILLED: [count]`.
- If zero stock, print `OUT_OF_STOCK`.
**Input:** Number of orders (int), then a list of quantities.
**Output:** Status for each order.

### Q3: Smart Greenhouse Controller
**Problem:** A greenhouse has 4 sensors. It activates a fan if the average humidity is above 70% OR if any single sensor exceeds 85%.
**Input:** 4 humidity percentages (floats).
**Output:** `FAN_ON` or `FAN_OFF`.

### Q4: Library Late Fee System
**Problem:** Calculate fines.
- **Rule:** Rs. 2/day for first 5 days. Rs. 5/day after that.
- **Book Type:** `Scientific` books have double the total fine.
- **Holiday Exemption:** If the return was on a Sunday, reduce total fine by Rs. 5.
**Input:** Days Overdue (int), Book Type (S for Scientific, O for Other), Is Sunday (1 for Yes, 0 for No).
**Output:** `Fine: Rs. [Value]`

### Q5: Courier Zone Router
**Problem:** Route a package based on distance from Hub (0,0).
- **Zone A:** Distance <= 10.0km. Tax: Rs. 50.
- **Zone B:** Distance <= 50.0km. Tax: Rs. 150.
- **Zone C:** Distance > 50.0km. Tax: Rs. 500.
**Input:** Customer X, Customer Y (ints).
**Output:** `Zone: [A/B/C], Tax: Rs. [Value]`

---

## Level 2 (Hard - 5 Questions)
*Focus: Optimization, Complex State, and Signal Processing.*

### Q1: Energy Load Balancer
**Problem:** Manage power for a small town.
- **Sources:** Solar, Wind, Grid.
- **Priority:** Use Solar first, then Wind, then Grid.
- **Constraint:** Grid can only supply up to 500 units. If total demand exceeds all sources, print `BLACKOUT`.
**Input:** Demand (int), Solar Available (int), Wind Available (int).
**Output:** `Usage: S:[a], W:[b], G:[c]` or `BLACKOUT`.

### Q2: Cybersecurity Log Parser (Brute Force)
**Problem:** Detect a Brute Force attack. An attack is defined as **more than 3 failed attempts** for the *same* username within any 10-minute window in the log.
**Input:** List of 10 entries: `[TimeInMins] [Username] [Status: S/F]`. (e.g., `5 user1 F`)
**Output:** `ATTACK DETECTED: [Username]` or `SYSTEM_SECURE`.

### Q3: Factory Assembly Bottleneck
**Problem:** An assembly line has 5 stations. You are given the processing time (in seconds) for 10 items at each station.
**Task:** Identify the station with the highest **average** processing time. This is the bottleneck.
**Input:** 5 lines, each containing 10 integers (time per item).
**Output:** `Bottleneck: Station [1-5]`

### Q4: Healthcare ECG Monitor
**Problem:** Detect an "Arrhythmia" pattern. An arrhythmia is signaled if the time interval between 4 consecutive heartbeats (R-R interval) varies by more than 20% from the first interval in that set.
**Input:** 10 timestamps of heartbeats (ms).
**Output:** `Status: NORMAL` or `Status: ARRHYTHMIA_DETECTED`.

### Q5: Logistics Multi-stop Optimizer
**Problem:** A driver visits 4 cities in a specified order.
- **Cost:** Fuel is Rs. 100 per unit distance.
- **Tolls:** Each city has a toll fee.
- **Optimization:** If the total distance is > 500km, the company provides a **Rs. 1000 fuel subsidy**.
**Input:** Coordinates of 4 cities (x1 y1, x2 y2, x3 y3, x4 y4) and their 4 toll fees.
**Output:** `Total Cost: Rs. [Value]` (Distance formula: $\sqrt{(x2-x1)^2 + (y2-y1)^2}$)
