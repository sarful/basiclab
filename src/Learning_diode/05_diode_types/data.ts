import type { DiodeType } from "./types";

export const diodeTypes: DiodeType[] = [
  {
    id: "pn",
    name: "PN Junction Diode",
    bangla: "পিএন জাংশন ডায়োড",
    icon: "⚡",
    color: "bg-blue-50 border-blue-200",
    chip: "সাধারণ ডায়োড",
    symbol: "A ──▶|── K",
    symbolNote:
      "Triangle (▶) anode side থেকে cathode-এর দিকে current flow direction দেখায়, vertical line cathode।",
    forwardVoltage: "Silicon diode ≈ 0.7V",
    use: "Rectifier circuit-এ AC কে DC করতে বেশি ব্যবহৃত হয়।",
    working:
      "Forward bias-এ Anode positive এবং Cathode negative হলে depletion layer কমে যায়। Silicon diode-এ প্রায় 0.7V forward voltage পার হলে current দ্রুত flow করে। Reverse bias-এ depletion layer বেড়ে যায়, তাই leakage ছাড়া current প্রায় বন্ধ থাকে।",
    example: "Power supply, charger, adapter",
  },
  {
    id: "zener",
    name: "Zener Diode",
    bangla: "জেনার ডায়োড",
    icon: "🛡️",
    color: "bg-purple-50 border-purple-200",
    chip: "Voltage regulator",
    symbol: "A ──▶⟍|⟋── K",
    symbolNote:
      "Zener diode-এর cathode line সাধারণ diode-এর মতো সোজা নয়; দুই পাশে বাঁকানো/angled line থাকে।",
    forwardVoltage: "Forward ≈0.7V, Reverse Zener voltage: Vz",
    use: "নির্দিষ্ট voltage স্থির রাখতে voltage regulator হিসেবে ব্যবহৃত হয়।",
    working:
      "Zener diode সাধারণ diode-এর মতো forward bias-এ current flow করে। কিন্তু এর প্রধান কাজ reverse bias-এ। Reverse voltage নির্দিষ্ট Zener voltage (Vz) পার হলে diode breakdown অঞ্চলে যায় এবং load-এর voltage প্রায় constant রাখে।",
    example: "Voltage stabilizer, over-voltage protection, reference voltage circuit",
  },
  {
    id: "led",
    name: "LED",
    bangla: "লাইট এমিটিং ডায়োড",
    icon: "💡",
    color: "bg-yellow-50 border-yellow-200",
    chip: "Light output",
    symbol: "A ──▶|── K ⇗⇗",
    symbolNote:
      "LED symbol সাধারণ diode symbol-এর মতো, কিন্তু বাইরে যাওয়া দুইটি arrow আলো emission বোঝায়।",
    forwardVoltage: "Typical LED ≈1.8V–3.3V",
    use: "Light indicator, display, decoration, signal lamp হিসেবে ব্যবহৃত হয়।",
    working: "Forward bias দিলে electron-hole recombination থেকে আলো বের হয়।",
    example: "TV indicator, traffic light, LED bulb",
  },
  {
    id: "photodiode",
    name: "Photodiode",
    bangla: "ফটো ডায়োড",
    icon: "☀️",
    color: "bg-green-50 border-green-200",
    chip: "Light sensor",
    symbol: "⇙⇙ A ──▶|── K",
    symbolNote:
      "Photodiode symbol সাধারণ diode symbol-এর মতো, কিন্তু diode-এর দিকে আসা দুইটি arrow incoming light বোঝায়।",
    forwardVoltage: "Mostly used in reverse bias",
    use: "আলো detect করতে sensor হিসেবে ব্যবহৃত হয়।",
    working:
      "Photodiode সাধারণত reverse bias-এ ব্যবহার করা হয়। আলো diode junction-এর উপর পড়লে electron-hole pair তৈরি হয় এবং reverse photocurrent বাড়ে। Light intensity যত বেশি, photocurrent তত বেশি।",
    example: "Solar sensor, remote receiver, light meter",
  },
];

export const comparisonRows = [
  ["PN Junction", "Rectification", "Forward bias", "Power supply"],
  ["Zener", "Voltage regulation", "Reverse breakdown", "Regulator circuit"],
  ["LED", "Light emission", "Forward bias", "Display/indicator"],
  ["Photodiode", "Light detection", "Mostly reverse bias", "Sensor"],
];
