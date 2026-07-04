# Nexmosphere RFID (Lift & Learn) Python Reader

## Next.js Interactive Exhibit

This repository now includes **Object Atlas**, a visitor-facing smart-table demo built with Next.js. It contains four sample objects, animated object stories, a curator control panel, simulated RFID events, and direct Web Serial support.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then use **Demo Controls** to simulate a tag pickup or connect a Nexmosphere controller at `115200` baud. Web Serial requires Chrome or Edge and a secure context (`localhost` is supported).

The interface understands the same messages as the Python reader:

- `XR[PU001]` — reveal the content for object 1
- `XR[PB001]` — return to the idle screen
- Tag IDs `001` through `004` map to the included demo objects

This project demonstrates how to communicate with a Nexmosphere RFID Lift & Learn sensor using Python. 

The script listens to the serial port and detects when an RFID-tagged object is:
- **Picked Up (PU)**: Tag removed from the antenna.
- **Placed Back (PB)**: Tag placed back on the antenna.

This is useful for interactive experience centers, digital signage, museum installations, retail displays, and BrightSign integrations.

---

## Hardware Requirements

- **Nexmosphere Controller** (e.g. X-Talk series)
- **Nexmosphere RFID Lift & Learn Sensor**
- **RFID Tags** (e.g. Tag 1, Tag 2, etc.)
- **USB to Serial connection** (connected to the PC)
- **Windows / Mac / Linux PC**

---

## Software Requirements

- **Python 3.x**
- **pySerial** library

To install the dependencies, run:
```bash
pip install -r requirements.txt
```

---

## Serial Configuration

In `rfid_reader.py`, specify your active serial port and baud rate:
```python
COM_PORT = 'COM9'       # Update to your actual port (e.g., '/dev/ttyUSB0' on Linux)
BAUD_RATE = 115200      # Nexmosphere default baud rate
```

---

## RFID Messages & API Details

The Nexmosphere controller outputs serial events when tags are picked up or placed back.

### 1. Tag Picked Up
When Tag `001` is picked up, the controller sends:
```
XR[PU001]
```
- **XR**: RFID Sensor prefix.
- **PU**: Pick Up event.
- **001**: RFID Tag ID (parsed as integer `1`).

**Script Output:**
```
--> Tag 1 PICKED UP! (Play video for item 1)
```

---

### 2. Tag Placed Back
When Tag `001` is placed back, the controller sends:
```
XR[PB001]
```
- **XR**: RFID Sensor prefix.
- **PB**: Place Back event.
- **001**: RFID Tag ID (parsed as integer `1`).

**Script Output:**
```
--> Tag 1 PLACED BACK. (Return to screensaver)
```

---

### 3. Digital Sensor Status
Alongside the Lift & Learn messages, the antenna sends digital presence events:

| Serial Message | State | Meaning |
|:---|:---|:---|
| `X007A[0]` | Present | RFID tag is sitting on the sensor antenna |
| `X007A[1]` | Removed | RFID tag has been lifted off the sensor antenna |

---

## Sample Sensor Readings

Here is how raw serial logs look when lifting and placing back tags:

### RFID Tag 1 Sequence
```text
XR[PB001]   <-- Placed back
X007A[0]    <-- Sensor reports Tag Present

XR[PU001]   <-- Picked up
X007A[1]    <-- Sensor reports Tag Removed

XR[PB001]   <-- Placed back
X007A[0]    <-- Sensor reports Tag Present
```

### RFID Tag 2 Sequence
```text
XR[PB002]   <-- Placed back
X007A[0]    <-- Sensor reports Tag Present

XR[PU002]   <-- Picked up
X007A[1]    <-- Sensor reports Tag Removed
```

---

## Summary of Serial Messages

| Serial Message | Meaning |
|:---|:---|
| `XR[PU001]` | RFID Tag 1 Picked Up |
| `XR[PB001]` | RFID Tag 1 Placed Back |
| `XR[PU002]` | RFID Tag 2 Picked Up |
| `XR[PB002]` | RFID Tag 2 Placed Back |
| `X007A[1]` | Object / Tag Removed |
| `X007A[0]` | Object / Tag Present |

---

## Getting Started

1. **Clone or Download** the project repository.
2. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Configure the COM Port** in `rfid_reader.py` to match your system settings.
4. **Run the script**:
   ```bash
   python rfid_reader.py
   ```
