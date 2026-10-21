/*
  SignHome — Arduino Uno R3 + 5V relay module
  Baud: 9600
  ASCII: '1' light ON  '2' light OFF
         '3' fan ON    '4' fan OFF
         '5' speaker toggle
  Most 5V relay boards are ACTIVE LOW (IN LOW = coil on).
*/

const int PIN_LIGHT = 2;
const int PIN_FAN = 3;
const int PIN_SPEAKER = 4;
const bool ACTIVE_LOW = true;

bool speakerOn = false;

void setRelay(int pin, bool on) {
  digitalWrite(pin, ACTIVE_LOW ? (on ? LOW : HIGH) : (on ? HIGH : LOW));
}

void setup() {
  pinMode(PIN_LIGHT, OUTPUT);
  pinMode(PIN_FAN, OUTPUT);
  pinMode(PIN_SPEAKER, OUTPUT);
  setRelay(PIN_LIGHT, false);
  setRelay(PIN_FAN, false);
  setRelay(PIN_SPEAKER, false);
  Serial.begin(9600);
}

void loop() {
  if (!Serial.available()) return;
  char c = Serial.read();
  if (c == '\r' || c == '\n') return;

  switch (c) {
    case '1':
      setRelay(PIN_LIGHT, true);
      Serial.println("D2 HIGH light ON");
      break;
    case '2':
      setRelay(PIN_LIGHT, false);
      Serial.println("D2 LOW light OFF");
      break;
    case '3':
      setRelay(PIN_FAN, true);
      Serial.println("D3 HIGH fan ON");
      break;
    case '4':
      setRelay(PIN_FAN, false);
      Serial.println("D3 LOW fan OFF");
      break;
    case '5':
      speakerOn = !speakerOn;
      setRelay(PIN_SPEAKER, speakerOn);
      Serial.print("D4 ");
      Serial.println(speakerOn ? "HIGH speaker ON" : "LOW speaker OFF");
      break;
    default:
      break;
  }
}
