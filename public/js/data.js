// js/data.js
if (!localStorage.getItem("participants")) {
  // Seed sample participants for the event. In real use, registration
  // would pre-populate this list prior to the event.
  const seed = [];
  function make(id, name, accommodation) {
    return {
      id,
      name,
      // boolean flags for meals
      breakfast: false,
      lunch: false,
      dinner: false,
      accommodation: !!accommodation,
      // history logs; each entry: { action: 'lunch'|'dinner', time: 'HH:MM:SS', ts: ISO }
      logs: []
    };
  }

  seed.push(make('EVT001', 'Aisha Khan', true));
  seed.push(make('EVT002', 'Rohan Patel', false));
  seed.push(make('EVT003', 'Priya Sharma', false));
  seed.push(make('EVT004', 'Miguel Santos', true));
  seed.push(make('EVT005', 'Chen Wei', false));
  seed.push(make('EVT006', 'Fatima Noor', true));
  seed.push(make('EVT007', 'Liam O\'Connor', false));
  seed.push(make('EVT008', 'Sara Lopez', false));
  seed.push(make('EVT009', 'David Kim', true));
  seed.push(make('EVT010', 'Nina Gupta', false));

  localStorage.setItem("participants", JSON.stringify(seed));
}

