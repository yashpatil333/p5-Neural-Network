
class NeuralNetwork {

    constructor(layer_sizes, tx, ty) {
        this.layer_sizes = layer_sizes;
        this.initialize_weights(this.layer_sizes);
        this.motivation_to_learn = 0.5;
        this.alteration_rate = 0.1;
        this.posx = tx;
        this.posy = ty;

        this.layer_gap = 200;
        this.neuron_gap = 40;
        this.neuron_diameter = 20;
        this.most = max(this.layer_sizes);
    }

    initialize_weights(layer_sizes) {

        this.weight_shapes = []
        for(let i = 0;i<layer_sizes.length-1;i++) {
            this.weight_shapes.push([layer_sizes[i+1], layer_sizes[i]])
        }
        // console.log(this.weight_shapes);

        // Create Weights
        this.weights = []
        for(let i = 0;i<this.weight_shapes.length;i++){
            this.weights.push(nj.random(this.weight_shapes[i]));
        }
        // console.log(this.weights);

        // Extra Mapping Needed
        for(let i = 0;i<this.weights.length;i++) {
            for(let x = 0;x<this.weight_shapes[i][0];x++){
                for(let y = 0;y<this.weight_shapes[i][1];y++){
                    let threshold = 3/sqrt(this.weight_shapes[i][1]);
                    this.weights[i].set(x, y, map(this.weights[i].get(x, y), 0, 1, -threshold, threshold));
                }
            }
        }


        // Create Biases
        this.biases = [];
        for(let i = 1;i<layer_sizes.length;i++) {
            this.biases.push(nj.random([layer_sizes[i], 1]));
        }

        // Refine Random Biases
        for(let i = 0;i<this.biases.length;i++) {
            for(let y = 0;y<this.biases[i].shape[0];y++) {
                this.biases[i].selection.data[y] = this.biases[i].selection.data[y] - 0.5;
            }
            
        }
    }

    activation(arr) {
        let a = arr.clone();
        for(let x = 0;x<a.shape[0];x++) {
            for(let y = 0;y<a.shape[1];y++) {
                a.set(x, y, 1 / (exp(-1 * a.get(x, y)) + 1) );
            }
        }
        return a;
    }


    predict(inputs) {
        let ins = inputs;
        for(let i = 0;i<this.weights.length;i++) {
            ins = this.activation(nj.dot(this.weights[i], ins).add(this.biases[i]));
        }
        return ins;
    }

    fusion_copy(nn) {

        // Inherit Weights
        for(let i = 0;i<this.weights.length;i++) {
            for(let x = 0;x<this.weight_shapes[i][0];x++){
                for(let y = 0;y<this.weight_shapes[i][1];y++){

                    if(Math.random() >= this.motivation_to_learn)
                        this.weights[i].set(x, y, nn.weights[i].get(x, y));
                }
            }
        }


        // Inherit Biases
        for(let i = 0;i<this.biases.length;i++) {
            for(let y = 0;y<this.biases[i].shape[0];y++) {
                if(Math.random() >= this.motivation_to_learn)
                    this.biases[i].selection.data[y] = nn.biases[i].selection.data[y];
            }
            
        }
    }

    alter() {
        // Inherit Weights
        for(let i = 0;i<this.weights.length;i++) {
            for(let x = 0;x<this.weight_shapes[i][0];x++){
                for(let y = 0;y<this.weight_shapes[i][1];y++){

                    if(Math.random() < this.alteration_rate)
                        this.weights[i].set(x, y, this.weights[i].get(x, y) + Math.random() - 0.5);
                }
            }
        }


        // Inherit Biases
        for(let i = 0;i<this.biases.length;i++) {
            for(let y = 0;y<this.biases[i].shape[0];y++) {
                if(Math.random() < this.alteration_rate)
                    this.biases[i].selection.data[y] += Math.random() - 0.5;
            }
            
        }
    }

    show() {
        this.layer_coords = [];

        for(let x = 0;x<this.layer_sizes.length;x++){
            let top_correction = (this.most - this.layer_sizes[x]) * this.neuron_gap/2;
            let layer_tcoords = [];

            for(let i = 0;i<this.layer_sizes[x];i++) {
                let neuronx = this.posx + (x*this.layer_gap) + 140;
                let neurony = this.posy + (i*this.neuron_gap) + top_correction;

                layer_tcoords.push([neuronx, neurony]);
                circle(neuronx, neurony, this.neuron_diameter);
            }
            this.layer_coords.push(layer_tcoords);
        }

        for(let x = 1;x<this.layer_sizes.length;x++){
            let tweights = this.weights[x-1].tolist();

            for(let t = 0;t<this.layer_sizes[x];t++) {
                for(let p = 0;p<this.layer_sizes[x-1];p++) {
                    let thisx = this.layer_coords[x][t][0], thisy = this.layer_coords[x][t][1];
                    let prevx = this.layer_coords[x-1][p][0], prevy = this.layer_coords[x-1][p][1];

                    if(tweights[t][p] < 0) stroke(255, 0, 0);
                    else stroke(0, 255, 0);

                    line(prevx, prevy, thisx, thisy);

                }
            }
        }
        stroke(0);
    }

    set_slider_positions(sliders) {
        let top_correction = (this.most - this.layer_sizes[0]) * this.neuron_gap/2;

        for(let i = 0;i<sliders.length;i++) {
            let sx = this.posx;
            let sy = this.posy + (i*this.neuron_gap) + top_correction;
            
            sliders[i].position(sx, sy);
            sliders[i].style('width', '80px');
        }
    }

    net_feed_forward(sliders) {
        let ins = [];
        for(let i = 0;i<sliders.length;i++) {
            ins.push([sliders[i].value()]);
        }

        let result = this.predict(nj.array(ins)).tolist();

        let last_layer = this.layer_coords[this.layer_sizes.length-1];
        for(let i = 0;i<last_layer.length;i++) {
            fill(0, result[i]*255, 0);
            text(result[i], last_layer[i][0] + textSize(), last_layer[i][1] + textSize()/2);
        }
        

    }

}