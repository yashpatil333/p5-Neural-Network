class Car {
    constructor(props) {
        this.props = props;
        this.pos = createVector(this.props.x, this.props.y)
        this._wheelRotation = this.props.ang;
        // this._speed = 0;
        this.accelaration = 0;
        this.isHandBrake = false;
        this.score = 0;

        this.r = new myRect(this.pos, this.props.width, this.props.height);
        this.radar = new Radar(this);
        this.dead = false;

        let layer_sizes = [5, 3];
        this.nn = new NeuralNetwork(layer_sizes);
        
        this.id = this.props.id;
    }
    
    show() {
      rectMode(CENTER);
      
      push();
      fill(255);
      translate(this.pos.x, this.pos.y);
      rotate(radians(this._wheelRotation + 90));
      rect(0, 0, this.props.width, this.props.height);
      
      fill(255, 200, 20);
      rect(0, -this.props.height/2, this.props.width, 5);
      stroke(255, 0, 0);
      text(this.id, -2, 12);
      pop();

      if(!this.dead) this.radar.show();
    }
    
    update(track) {
        this.dead_restart();
        this.isHandBrake = false;
        this.vector = p5.Vector.fromAngle(radians(this._wheelRotation), 1);

        this.limit_angle();
        this.update_friction();
        this.read_keystrokes();

        this.update_pos();
        // this.info();

        this.update_r();
        this.radar.update(track, this);
        this.accelarate();
        
        this.guess();

        // Crucial Fitness Function
        this.score += 1;
        if(!this.dead) this.score += this.radar.get_fitness();
    }

    guess() {
        let predictions = this.nn.predict(nj.array(this.radar.generate_inputs())).selection.data;

        let high = 0;
        let high_cost = predictions[0];

        for(let i = 0;i<predictions.length;i++) {
            //text(predictions[i].toFixed(2), 600 + 50*this.id, i*12 + 20);
            if(predictions[i] > high_cost) {
                high_cost = predictions[i];
                high = i;
            }
        }

        switch(high) {
            case 0:
                break;
            case 1:
                this.turn_left();
                break;
            case 2:
                this.turn_right();
                break;
        }

    }

    dead_restart() {
        if(this.dead){
            this.dead = false;

            this.pos = createVector(this.props.x, this.props.y)
            this._wheelRotation = this.props.ang;
            // this._speed = 0;
            this.accelaration = 0;
            this.isHandBrake = false;
            this.score = 0;

            this.r = new myRect(this.pos, this.props.width, this.props.height);
            this.radar = new Radar(this);
            this.dead = false;
        }
    }

    breed(c) {
        // Could look at implementing different NN Crossover functions.
        this.nn.fusion_copy(c.nn);
    }

    alter() {
        // Random Changes due to generations.
        this.nn.alter();
    }

    update_r() {
        this.r.update_lines(this._wheelRotation + 90);
    }

    read_keystrokes() {
        if(keyIsDown(32)) { // space
            this.isHandBrake = true;
            text('SPACE', 20, 160);
            
            if(this.accelaration > 0) {
                this.accelaration -= this.props.accelaration * 0.5;
                if(this.accelaration <= 0) this.accelaration = 0;
            } else {
                this.accelaration += this.props.accelaration * 0.5;
                if(this.accelaration >= 0) this.accelaration = 0    ;
            }
        }
        
        if(keyIsDown(LEFT_ARROW)) {
            this.turn_left();
        }
    
        if(keyIsDown(RIGHT_ARROW)) {
            this.turn_right();
        }
    
        if(keyIsDown(UP_ARROW) && !this.isHandBrake) {
            this.accelarate();
        }
    
        if(keyIsDown(DOWN_ARROW) && !this.isHandBrake) { // reverse
            this.reverse();
        }
    }

    limit_angle() {
        if(this._wheelRotation >= 360) {
            this._wheelRotation = this._wheelRotation - 360;
        }
        if(this._wheelRotation < 0) {
            this._wheelRotation = this._wheelRotation + 360;
        }
    }

    update_pos() {
        this.vector.mult(this.props.maxSpeed * this.accelaration);
        this.pos.add(this.vector);
    }

    update_friction() {
        this.accelaration *= this.props.friction;
    }

    info() {
        text(`isHandBrake: ${this.isHandBrake}`, 150, 25);
        text(car._wheelRotation.toFixed(2), 20, 20);
        text(`${car.vector.x.toFixed(2)} ${car.vector.y.toFixed(2)}`, 20, 40);
        text(car.accelaration.toFixed(2), 20, 60);
    }

    accelarate() {
        text('UP_ARROW', 20, 130);
        if(this.accelaration <= this.props.maxSpeed) this.accelaration += this.props.accelaration;
    }

    turn_left() {
        text('LEFT_ARROW', 20, 100);
        this._wheelRotation -= constrain(this.props.turnPoint * Math.abs(this.accelaration), 0, this.props.turnPoint) * (this.accelaration < 0 ? -1 : 1);
    }

    turn_right() {
        text('RIGHT_ARROW', 20, 115);
        this._wheelRotation += constrain(this.props.turnPoint * Math.abs(this.accelaration), 0, this.props.turnPoint) * (this.accelaration < 0 ? -1 : 1);
    }

    reverse() {
        text('DOWN_ARROW', 20, 145);
            if(this.accelaration >= -this.props.reverseSpeed) this.accelaration -= this.props.accelaration;
    }

  }