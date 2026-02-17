<center>
<h1> ZYNOVA 2K26
PROBLEM STATEMENTS
</h1>

</center>

###  Level 0 - (4 MEDIUM)
### Q1: Cinema Dynamic Pricing
**Problem:** A theater uses dynamic pricing.
- **Base Price:** Rs. 200.
- **Age Discount:** Age < 12 (50% off), Age > 60 (30% off).
- **Time Surcharge:** If the show is after 18:00 (6 PM), add **Rs. 50** to the final price.
**Input:** Age (int), Show Hour (int, 0-23).
**Output:** `Ticket Price: Rs. [Value]`

---

### Q2: Smart Vending Machine
**Problem:** Dispense change using the fewest coins. Available coins: Rs. 10, 5, 2, 1.
**Input:** Item Price (int), Amount Paid (int).
**Output:** `Change: 10x[a], 5x[b], 2x[c], 1x[d]`

---

### Q3: Smart Warehouse - Autonomous Robot Navigator
**Title:** Robot Path Validator
**Problem:** A robot in a 10x10 grid (starting at 0,0) moves based on a command string ('U', 'D', 'L', 'R').
1. You are given a target location `(TX, TY)`.
2. You are given `N` obstacles at specific coordinates.
3. If the robot:
   - Hits a boundary (0-9 range), it stops and reports: `OUT_OF_BOUNDS at (x,y)`
   - Hits an obstacle, it stops and reports: `OBSTACLE at (x,y)`
   - Reaches the target *at any point* during the moves: `TARGET_REACHED`
   - Finishes all moves without reaching target: `INCOMPLETE at (x,y)`
**Input Format:**
- Target X, Target Y (two ints)
- Number of Obstacles (int)
- Obstacle coordinates (list of x y pairs)
- Moves String (string)
**Output Format:**
- The status message as defined above.

**Example:**
- Input: `2 2`, `1`, `1 1`, `RRUU`
- Output: `TARGET_REACHED` (Path: (0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2). No obstacles hit).

---


### Q4: Healthcare - Patient Vital Monitoring System
**Title:** Real-time Health Alert System
**Problem:** A wearable health device monitors a patient's Heart Rate (HR) every minute. To prevent false alarms, the system must detect sustained abnormalities over a "3-minute window."
- **EMERGENCY:** Triggered if HR is **above 150** for 3 consecutive minutes.
- **WARNING:** Triggered if HR is **above 120** for 3 consecutive minutes (and not an Emergency).
- **STABLE:** If neither of the above conditions are met.
- If multiple conditions are met, the **highest** priority alert (Emergency > Warning) must be reported.
**Input Format:**
- 10 integers representing HR readings for each minute.
**Output Format:**
- `Alert: EMERGENCY`, `Alert: WARNING`, or `Status: STABLE`

**Example:**
- Input: `80 90 125 130 128 100 90 155 160 165`
- Calculation: 
  - Minutes 3-5: All > 120 (Warning triggered)
  - Minutes 8-10: All > 150 (Emergency triggered)
- Output: `Alert: EMERGENCY`

---
### Level 1 - (2 EASY, 1 HARD)

### Q1: Smart Agriculture - Precision Irrigation
**Title:** Precision Irrigation Assistant
**Problem:** In a smart farm, sensors track soil moisture to optimize water usage. Your task is to calculate the final water volume required for a field based on its area and moisture level.
- **Base Requirement:** 5 Liters of water per square meter of `Area`.
- **Conditions:**
  - If `Moisture < 30.0%`: Increase total volume by **25%** due to high dryness.
  - If `30.0% <= Moisture <= 60.0%`: Use the base volume.
  - If `Moisture > 60.0%`: Decrease total volume by **50%** (already humid).
  - If `Moisture > 80.0%`: Total volume required is **0 Liters**.
**Input Format:**
- Area (float)
- Moisture Percentage (float)
**Output Format:**
- `Total: [Volume]L` (rounded to 1 decimal place)

**Example:**
- Input: `100.0`, `25.0`
- Calculation: Base = 500. Add 25% (125) = 625.0.
- Output: `Total: 625.0L`

---

### Q2: Urban Mobility - Smart Toll/Parking 
**Title:** Smart City Parking Fee
**Problem:** A smart parking lot uses automated billing based on vehicle type and duration.
- **First 2 Hours:** Rs. 30 (total).
- **Every Hour After:** Rs. 20 per hour.
- **Vehicle Type:** 
  - If it's an **Electric Vehicle (EV)**, apply a flat **Rs. 15 discount** on the final total.
  - If the duration is more than **12 hours**, apply a **10% surcharge** on the final amount (before EV discount).
**Input Format:**
- Total Hours (int)
- Is EV (1 for Yes, 0 for No)
**Output Format:**
- `Final Fee: Rs. [Value]` (rounded to 2 decimal places)

**Example:**
- Input: `5`, `1`
- Calculation: 30 + (3 * 20) = 90. No surcharge (5 < 12). Discount = 90 - 15 = 75.00.
- Output: `Final Fee: Rs. 75.00`

---

# Q3: Disaster Response – Multi-Drone Rescue Allocation System

## Title: Emergency Drone Deployment Optimizer

### Problem:

A city uses autonomous drones to deliver medical kits during disasters.

You are given:

* `D` drones

* Each drone has:

  * ID
  * Battery capacity (in minutes)
  * Current location (x, y)

* `R` emergency requests
  Each request has:

  * Request ID
  * Location (x, y)
  * Severity Level (1–5) (5 = highest)

---

## Rules:

1️⃣ Drone can serve a request only if:

```
2 * ManhattanDistance(drone, request) <= battery
```

(Drone must go and return)

---

2️⃣ Allocation Priority:

* Higher severity first
* If same severity → nearest drone
* If tie → lowest drone ID

---

3️⃣ After assignment:

* Battery reduces by 2 * distance
* Drone location updates to request location

---

4️⃣ If no drone can serve:

```
REQUEST_DROPPED: <RequestID>
```

---

5️⃣ Output:

For each request:

```
ASSIGNED: <DroneID> -> <RequestID>
```

OR

```
REQUEST_DROPPED: <RequestID>
```

---
