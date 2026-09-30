/** Smart living — source: company profile, “Technology in interiors”. */
export type SmartFeatureId =
  | "lighting"
  | "voice"
  | "blinds"
  | "audio"
  | "security"
  | "thermostat"
  | "solar"
  | "motion"
  | "energy";

export type SmartFeature = {
  id: SmartFeatureId;
  title: string;
  group: "integration" | "climate";
  body: string;
};

export const smartLiving = {
  heading: ["Smart Design.", "Smarter Living."],
  lead: "Let us redefine your interiors with seamless technology integration designed for comfort, control, and contemporary living.",
  signoff: "Innovative Living. Intelligent Design.",
  groups: {
    integration: { title: "Smart Home Integration", body: "Everyday control, designed in from the first drawing." },
    climate: {
      title: "Climate & Energy Efficiency",
      body: "Save energy without compromising comfort. Intelligent HVAC and energy monitoring systems maintain optimal indoor climate while reducing environmental impact.",
    },
  },
  features: [
    { id: "lighting", group: "integration", title: "Smart lighting & dimming", body: "Scenes that shift from bright morning light to a soft evening glow." },
    { id: "voice", group: "integration", title: "Voice assistants", body: "Integration with Alexa, Google Home and Siri." },
    { id: "blinds", group: "integration", title: "Automated blinds & curtains", body: "Daylight and privacy, adjusted on schedule or on request." },
    { id: "audio", group: "integration", title: "Multi-room audio & home theatre", body: "Sound that follows you from room to room." },
    { id: "security", group: "integration", title: "App-controlled home security", body: "Your home’s status, available from your phone." },
    { id: "thermostat", group: "climate", title: "Smart thermostats & zoning", body: "Comfort managed room by room." },
    { id: "solar", group: "climate", title: "Solar-integrated systems", body: "On-site generation integrated with the home’s systems." },
    { id: "motion", group: "climate", title: "Motion-sensor lighting", body: "Light that responds to movement — and switches off when it isn’t needed." },
    { id: "energy", group: "climate", title: "Energy usage dashboards", body: "A clear view of how your home uses energy." },
  ] as SmartFeature[],
};
