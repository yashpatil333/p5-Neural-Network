
class NeuralNetwork {

    constructor(layer_sizes) {
        this.layer_sizes = layer_sizes;
        this.initialize_weights(this.layer_sizes);
        this.motivation_to_learn = 0.5;
        this.alteration_rate = 0.1;
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
}