
let sliders = []

function setup() {
  createCanvas(1200, 800);
  console.log("Haha");

  nn = new NeuralNetwork([2, 5, 3, 4], 50, 50);
  
  create_sliders();
  nn.set_slider_positions(sliders);
}

function draw() {
  background(100);
  fill(255);

  nn.show();
  show_sliders();
  nn.net_feed_forward(sliders);

}


function create_sliders() {
  for(let i = 0;i<nn.layer_sizes[0];i++) {
    sliders.push(createSlider(-1, 1, 0, 0.01))
  }
}

function show_sliders() {
  for(let i = 0;i<nn.layer_sizes[0];i++) {
    text(sliders[i].value(), sliders[i].x + 90, sliders[i].y + 5);
  }
}