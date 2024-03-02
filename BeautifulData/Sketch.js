let tsunamiData;
let tsunamiI = 0;
let tsunami;
const axi = new axidraw.AxiDraw();
let connected = false;

let NUMSINES = 20;
let sines = new Array(NUMSINES);
let rad;
let i;

let fund = 0.005;
let ratio = 1;
let alpha = 50;

let trace = false;

function preload() {
  tsunamiData = loadJSON(
    'https://gis.ngdc.noaa.gov/arcgis/rest/services/web_mercator/hazards/MapServer/0/query?where=%20(TS_INTENSITY%20%3E%200)%20&outFields=*&outSR=4326&f=json',
  );
}

function setup() {
  createCanvas(400, 400);
  tsunami = tsunamiData.features[tsunamiI];

  background(204);

  for (let i = 0; i < sines.length; i++) {
    sines[i] = PI;
  }
}

function mouseClicked() {
  if (!connected) {
    axidraw
      .connect()
      .then(() => {
        connected = true;
      })
      .catch((error) => {
        console.error('Error connecting to AxiDraw:', error);
      });
  }

  tsunami = tsunamiData.features[tsunamiI];
  axi.moveTo(tsunamiData.attributes.LATITUDE, tsunamiData.attributes.LONGITUDE);
  axi.penDown();
  setTimeout(() => axi.penUp(), 100 * tsunami.attributes.TS_INTENSITY);
  tsunamiI++;

  trace = !trace;
  background(255);
}

function draw() {
  if (!trace) {
    background(204);
    stroke(0, 255);
    noFill();
  }

  rad = tsunamiData.attributes.DEATHS_TOTAL / 1000;
  push();
  translate(width / 2, height / 2);

  for (let i = 0; i < sines.length; i++) {
    let erad = 0;
    if (trace) {
      stroke(0, 0, 255 * (float(i) / sines.length), alpha);
      fill(0, 0, 255, alpha / 2);
      erad = 5.0 * (1.0 - float(i) / sines.length);
    }
    let radius = rad / (i + 1);
    rotate(sines[i]);
    if (!trace) ellipse(0, 0, radius * 2, radius * 2);
    push();
    translate(0, radius);
    if (!trace) ellipse(0, 0, 5, 5);
    if (trace) ellipse(0, 0, erad, erad);
    pop();
    translate(0, radius);
    sines[i] = (sines[i] + (fund + (fund * i * ratio))) % TWO_PI;
  }

  pop();
}