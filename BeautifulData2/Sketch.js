const MAX_X_MM = 50;
const MAX_Y_MM = 50;
const MOVE_THRESHOLD_MM = 1;

const axi = new axidraw.AxiDraw();
let connected = false;
let moving = false;
let lastPos;

let lines = [];

let earthquakeData;
let earthquakeI = 0;

function preload() {
  earthquakeData = loadJSON(
    'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson',
    gotData // Get a hold of the data and call the gotData function  
  );
}

function gotData(data) {
  earthquakeData = data; // Assign the loaded data to the variable
}

function setup() {
  createCanvas(400, 400);

  textAlign(CENTER);
  ellipseMode(CENTER);

  fill(0);

  lastPos = createVector(0, 0);

}

// Making sure the Axidraw's connected and then using the drawNextEarthquake function
function mouseClicked() {
  if (!connected) {
    axi.connect().then(() => {
      connected = true;
      drawNextEarthquake();
    });
    return; 
  }
}

// Moving the Axidraw and tracking the movement state
function moveAndDraw(x, y) {
  moving = true;
  axi.moveTo(x, y)
    .then(() => {
      moving = false;
    }); 

  // Store movement in lines array
  lines.push([
    lastPos.copy(), // Copy lastPos vector to avoid mutation
    createVector(x, y),
  ]);

  lastPos.set(x, y); // Update lastPos to current position
}

function drawNextEarthquake() {
  if (!earthquakeData || !earthquakeData.features || earthquakeI >= earthquakeData.features.length) {
    console.log("No earthquake data available.");
    return; // Make sure there's data
  }

  // Get earthquake data for the new index
  let earthquake = earthquakeData.features[earthquakeI];
  let coordinates = earthquake.geometry.coordinates;
  let lon = coordinates[0]; // Longitude
  let lat = coordinates[1]; // Latitude

  // Map latitude and longitude to canvas coordinates
  let x = map(lon, -180, 180, 0, width);
  let y = map(lat, 90, -90, 0, height);

  moveAndDraw(x, y);

  earthquakeI++;

  // Draw the next earthquake after a short delay
  setTimeout(drawNextEarthquake, 1000);
}

function draw() {
  if (!connected) {
    background(255, 0, 0);
    text('Connecting to Axidraw...', width / 2, height / 2);
    return;
  }

  background(0, 255, 0);

  // Draw the lines
  stroke(255); // Set stroke color to white
  strokeWeight(1);
  for (let i = 0; i < lines.length; i += 1) {
    let startPos = lines[i][0];
    let endPos = lines[i][1];
    line(startPos.x, startPos.y, endPos.x, endPos.y); // Searching the lines array and producing positions to draw between
  }
}
