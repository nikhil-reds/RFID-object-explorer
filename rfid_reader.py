import serial
import time

# ----------------------------------------------------------------------
# Nexmosphere RFID Lift & Learn Reader
# ----------------------------------------------------------------------
# This script monitors the serial port for events sent by the Nexmosphere
# sensor controller when tags are picked up (PU) or placed back (PB).
# ----------------------------------------------------------------------

COM_PORT = 'COM9'          # Update to your actual COM Port
BAUD_RATE = 115200         # Default Nexmosphere Baud Rate

try:
    print(f"Connecting to Nexmosphere controller on {COM_PORT} at {BAUD_RATE} baud...")
    nex_board = serial.Serial(COM_PORT, BAUD_RATE, timeout=1)
    print("Listening for Lift & Learn events...\n")

    while True:
        if nex_board.in_waiting > 0:
            raw_data = nex_board.readline().decode('utf-8').strip()
            
            # Avoid processing empty messages
            if not raw_data:
                continue

            # 1. RFID Pick Up Event (e.g. XR[PU001])
            if raw_data.startswith("XR[PU"):
                try:
                    tag_id = int(raw_data[5:8])
                    print(f"--> Tag {tag_id} PICKED UP! (Play video for item {tag_id})")
                except ValueError:
                    print(f"Received malformed Pick Up event: {raw_data}")

            # 2. RFID Place Back Event (e.g. XR[PB001])
            elif raw_data.startswith("XR[PB"):
                try:
                    tag_id = int(raw_data[5:8])
                    print(f"--> Tag {tag_id} PLACED BACK. (Return to screensaver)")
                except ValueError:
                    print(f"Received malformed Place Back event: {raw_data}")
            
            # 3. Digital Sensor Status (e.g. X007A[0] or X007A[1])
            elif raw_data.startswith("X007A["):
                status = raw_data[6:7]
                if status == '0':
                    print("--> [Sensor Status] Tag Present on Antenna")
                elif status == '1':
                    print("--> [Sensor Status] Tag Removed from Antenna")
                else:
                    print(f"--> [Sensor Status] Unknown status {status}: {raw_data}")

        time.sleep(0.01)

except KeyboardInterrupt:
    if 'nex_board' in locals() and nex_board.is_open:
        nex_board.close()
    print("\nProgram Closed. Exiting...")

except Exception as e:
    print(f"Error: {e}")
