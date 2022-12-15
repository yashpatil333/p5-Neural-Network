
// Paste in p5 browser.
// Works as a map generator.
// Outputing init() code.

let value = 0;
let rects = []
let drawing = false;
let sx, sy;

function setup() {
  createCanvas(1500, 900);
  background(220)
}

function draw() {
  fill(100);
  if(drawing)
    rect(sx, sy, mouseX - sx, mouseY - sy);
  
  for(let i = 0;i<40;i++) {
    for(let x = 0;x<40;x++){
      circle(i*50, x*50, 3);
    }
  }
   
}

function keyPressed() {
  if(keyCode === RIGHT_ARROW) {
    for(let i = 0;i<rects.length;i++) {
    let r = rects[i];
      console.log("createVector(" + (r[0]+r[2]/2) + ", " + (r[1]+r[3]/2) + "), " + r[2] + ", " + r[3]);
    }
  }
}

function mousePressed() {
  drawing = true;
  sx = mouseX;
  sy = mouseY;
}
function mouseReleased() {
  drawing = false;
    rects.push([sx, sy, mouseX - sx, mouseY - sy]);
  background(220);
  for(let i = 0;i<rects.length;i++) {
    let r = rects[i]
    rect(r[0], r[1], r[2], r[3]);
  }
  console.log(rects.length);
}

