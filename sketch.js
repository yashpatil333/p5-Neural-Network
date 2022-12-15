
function setup() {
  createCanvas(1500, 900);
  console.log("Haha");

  // let layer_sizes = [2, 3, 2];
  // let ins = nj.ones([2, 1]);
  // console.log("ins: ", ins)

  // let nn = new NeuralNetwork(layer_sizes);
  // let predictions = nn.predict(ins);

  // console.log(predictions.selection.data);

  // this.car = new Car({
  //   x: 300,
  //   y: 225,
  //   width: 20,
  //   height: 40,

  //   turnPoint: 2.3,
  //   maxSpeed: 2,
  //   reverseSpeed: 1.5,
  //   friction: .97,
  //   accelaration: .09
  // });
  
  this.p = new Population(100);
  
  
}

function draw() {
  background(0);
  fill(255);

  this.p.update();
  this.p.show();

  stroke(255);
  noFill();

  let tx = 200, ty = 60;

  text("Generation: " + this.p.generation, tx, ty);
  text("Current Gen High Score: " + this.p.current_best_score(), tx, ty + 60);

  if(this.p.last_best != null) {
    text("Last Gen High ID: " + this.p.last_best.id, tx, ty + 20);
    text("Last Gen High Score: " + this.p.last_best_score, tx, ty + 40);
    
  }


  // Testing
  // let t = new Track2();
  // t.show();

}
