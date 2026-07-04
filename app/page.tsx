"use client";

import { useEffect, useRef, useState } from "react";

type ObjectItem = {
  id: number;
  name: string;
  era: string;
  origin: string;
  material: string;
  accent: string;
  pale: string;
  icon: string;
  kicker: string;
  story: string;
  facts: { value: string; label: string }[];
};

const objects: ObjectItem[] = [
  {
    id: 1,
    name: "Astrolabe",
    era: "c. 1400 CE",
    origin: "Persia",
    material: "Engraved brass",
    accent: "#ff6b35",
    pale: "#fff0e8",
    icon: "✦",
    kicker: "A pocket-sized model of the sky",
    story: "Long before GPS, astronomers held the cosmos in one hand. Rotating plates mapped the night sky, measured altitude, and helped travelers find both time and direction.",
    facts: [{ value: "1,500+", label: "years in use" }, { value: "360°", label: "sky mapped" }, { value: "30 cm", label: "diameter" }],
  },
  {
    id: 2,
    name: "Ammonite Fossil",
    era: "Jurassic period",
    origin: "Dorset, England",
    material: "Calcified shell",
    accent: "#087f8c",
    pale: "#e2f4f3",
    icon: "◉",
    kicker: "A spiral preserved for 180 million years",
    story: "This once-living shell drifted through warm Jurassic seas. Its chambers grew in a precise logarithmic spiral—an elegant record of growth written directly into stone.",
    facts: [{ value: "180M", label: "years old" }, { value: "16", label: "shell chambers" }, { value: "2.4 kg", label: "weight" }],
  },
  {
    id: 3,
    name: "Apollo Guidance Core",
    era: "1966–1972",
    origin: "Massachusetts, USA",
    material: "Copper & ferrite",
    accent: "#5146e5",
    pale: "#efedff",
    icon: "⌁",
    kicker: "Memory woven by hand, built for the Moon",
    story: "Thousands of microscopic magnetic rings stored the flight software that guided Apollo. Expert textile workers threaded each wire by hand: through a core meant one, around it meant zero.",
    facts: [{ value: "72 KB", label: "total memory" }, { value: "4.1 kHz", label: "clock speed" }, { value: "0", label: "failures" }],
  },
  {
    id: 4,
    name: "Blue Morpho",
    era: "Contemporary specimen",
    origin: "Amazon basin",
    material: "Chitin wing scales",
    accent: "#1677ff",
    pale: "#e5f1ff",
    icon: "◒",
    kicker: "Blue without a drop of blue pigment",
    story: "Microscopic ridges on each wing scatter light to create an electric blue flash. Tilt the wing and the color changes—a living lesson in structural color.",
    facts: [{ value: "15 cm", label: "wingspan" }, { value: "6 mo", label: "lifespan" }, { value: "0", label: "blue pigment" }],
  },
];

export default function Home() {
  const [selected, setSelected] = useState<ObjectItem | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [serialState, setSerialState] = useState("Demo mode");
  const [eventLog, setEventLog] = useState<string[]>(["System ready · waiting for an object"]);
  const portRef = useRef<any>(null);

  const handleRawEvent = (raw: string) => {
    const pickup = raw.match(/XR\[PU(\d{3})\]/);
    const placed = raw.match(/XR\[PB(\d{3})\]/);
    if (pickup) {
      const id = Number(pickup[1]);
      const item = objects.find((object) => object.id === id);
      if (item) setSelected(item);
      setEventLog((log) => [`${raw} · ${item?.name ?? `Tag ${id}`} lifted`, ...log].slice(0, 4));
    } else if (placed) {
      setSelected(null);
      setEventLog((log) => [`${raw} · object returned`, ...log].slice(0, 4));
    }
  };

  const connectSerial = async () => {
    if (!("serial" in navigator)) {
      setSerialState("Web Serial needs Chrome or Edge");
      return;
    }
    try {
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 115200 });
      portRef.current = port;
      setSerialState("Nexmosphere connected");
      setEventLog((log) => ["Serial connected · 115200 baud", ...log].slice(0, 4));
      const decoder = new TextDecoderStream();
      port.readable.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split(/\r?\n/);
        buffer = lines.pop() ?? "";
        lines.filter(Boolean).forEach((line) => handleRawEvent(line.trim()));
      }
    } catch (error) {
      setSerialState("Connection cancelled");
    }
  };

  useEffect(() => () => { portRef.current?.close?.(); }, []);

  return (
    <main className={selected ? "experience has-object" : "experience"} style={{ "--accent": selected?.accent ?? "#ff6b35", "--pale": selected?.pale ?? "#fff0e8" } as React.CSSProperties}>
      <header>
        <a className="brand" href="#" aria-label="Object Atlas home"><span className="brand-mark">O</span><span>OBJECT<br /><b>ATLAS</b></span></a>
        <div className="status"><i /> RFID table online <span>•</span> Gallery 04</div>
        <button className="control-button" onClick={() => setPanelOpen(true)}><span>⌁</span> DEMO CONTROLS</button>
      </header>

      {!selected ? (
        <section className="idle-screen">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="idle-copy">
            <span className="eyebrow">THE COLLECTION IS IN YOUR HANDS</span>
            <h1>Pick up an object.<br /><em>Unlock its story.</em></h1>
            <p>Lift any object from the table to begin exploring.</p>
          </div>
          <div className="table-illustration">
            <div className="signal signal-one" /><div className="signal signal-two" />
            <div className="object-shape"><span>✦</span></div>
            <div className="table-top" /><div className="table-leg" />
          </div>
          <div className="hint"><span className="hand">♧</span><div><b>LIFT TO DISCOVER</b><small>The table responds instantly</small></div></div>
          <div className="collection-strip">
            {objects.map((object) => <button key={object.id} onClick={() => handleRawEvent(`XR[PU00${object.id}]`)}><span style={{ color: object.accent }}>{object.icon}</span><small>TAG {String(object.id).padStart(3, "0")}</small>{object.name}</button>)}
          </div>
        </section>
      ) : (
        <section className="object-screen" key={selected.id}>
          <button className="back" onClick={() => handleRawEvent(`XR[PB${String(selected.id).padStart(3, "0")}]`)}>← Return object</button>
          <div className="object-visual">
            <div className="visual-ring outer" /><div className="visual-ring inner" />
            <div className="hero-symbol">{selected.icon}</div>
            <span className="scan-label">RFID · {String(selected.id).padStart(3, "0")}</span>
          </div>
          <article className="object-copy">
            <span className="eyebrow">OBJECT {String(selected.id).padStart(2, "0")} · NOW EXPLORING</span>
            <h1>{selected.name}</h1>
            <h2>{selected.kicker}</h2>
            <p>{selected.story}</p>
            <div className="metadata"><span><small>ERA</small>{selected.era}</span><span><small>ORIGIN</small>{selected.origin}</span><span><small>MATERIAL</small>{selected.material}</span></div>
            <div className="facts">{selected.facts.map((fact) => <div key={fact.label}><strong>{fact.value}</strong><small>{fact.label}</small></div>)}</div>
          </article>
          <aside className="return-note"><i /> Place the object back to return home</aside>
        </section>
      )}

      {panelOpen && <div className="panel-backdrop" onClick={() => setPanelOpen(false)}>
        <aside className="panel" onClick={(event) => event.stopPropagation()}>
          <button className="close" onClick={() => setPanelOpen(false)}>×</button>
          <span className="eyebrow">CURATOR TOOLKIT</span><h2>RFID demo controls</h2>
          <p>Simulate the Nexmosphere messages from the Python prototype, or connect a controller directly.</p>
          <button className="serial-button" onClick={connectSerial}>⌁ Connect via Web Serial</button>
          <div className="serial-state"><i /> {serialState}</div>
          <h3>SIMULATE PICK UP</h3>
          <div className="tag-grid">{objects.map((object) => <button key={object.id} onClick={() => handleRawEvent(`XR[PU${String(object.id).padStart(3, "0")}]`)}><span style={{ background: object.pale, color: object.accent }}>{object.icon}</span><div><small>TAG {String(object.id).padStart(3, "0")}</small>{object.name}</div></button>)}</div>
          <button className="place-back" onClick={() => handleRawEvent(`XR[PB${String(selected?.id ?? 1).padStart(3, "0")}]`)}>Place object back · return to idle</button>
          <h3>EVENT STREAM</h3>
          <div className="event-log">{eventLog.map((event, index) => <code key={index}><b>{index === 0 ? "●" : "○"}</b>{event}</code>)}</div>
        </aside>
      </div>}
    </main>
  );
}
