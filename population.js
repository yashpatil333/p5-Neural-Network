class Population {
    constructor(size) {
        this.cars = []
        this.size = size;
        this.track = new Track2();
        this.generation = 1;
        this.last_best = null;
        this.last_best_score = -1;

        // Tweaking Params
        this.leaders_percent = 0.1;
        this.maxFitness = 1000;
        this.lapStep = 1000;

        for(let i = 0;i<size;i++) {
            this.cars.push(this.create_car(i));
        }
    }

    create_car(i) {
        return new Car({
            x: 300,
            y: 340,
            width: 20,
            height: 40,
            id: i,
            ang: 0,
        
            turnPoint: 2.3,
            maxSpeed: 2,
            reverseSpeed: 1.5,
            friction: .97,
            accelaration: .09
        });
    }

    update() {

        for(let i = 0;i<this.cars.length;i++) {
            if(!this.cars[i].dead) {
                this.cars[i].update(this.track);
                this.track.intersects(this.cars[i]);
            }
        }

        if(this.lap_complete()) this.kill();
        
        if(this.all_dead()) {
            this.new_generation();
        }

    }

    show() {
        this.track.show();
        for(let i = 0;i<this.cars.length;i++) this.cars[i].show();

        stroke(255);
        
    }

    new_generation() {

        let topn = parseInt(this.size * this.leaders_percent);
        let leaders = this.get_top_n(topn);
        this.last_best = leaders[0];
        this.last_best_score = this.last_best.score;
         
        let pool = this.cars.filter((x) => {
            if(!this.in_arr(x, leaders)) 
                return true;
            return false;
        });


        // Mating
        for(let i = 0;i<pool.length;i++) {
            let mate = leaders[parseInt(map(Math.random(), 0, 1, 0, topn))];
            pool[i].breed(mate);
        }

        // Altering
        for(let i = 0;i<this.cars.length;i++) {
            this.cars[i].alter();
        }

        if(this.generation % 10 == 0) {
            this.maxFitness += this.lapStep;
        }

        this.revive_all();
        this.generation += 1;
    }

    all_dead() {
        for(let i = 0;i<this.cars.length;i++) {
            if(!this.cars[i].dead) return false;
        }
        return true;
    }

    kill() {
        for(let i = 0;i<this.cars.length;i++) {
            this.cars[i].dead = true;
        }
    }

    revive_all() {
        for(let i = 0;i<this.cars.length;i++) {
            this.cars[i].dead_restart();
        }
    }

    get_top_n(num) {

        let leaders = [];
        console.log(this.cars)
        
        for(let n = 0;n<num;n++) {
            let highscore = 0;
            let highcar = null;
            for(let i = 0;i<this.cars.length;i++) {

                if(leaders.length == 0) {
                    if(this.cars[i].score >= highscore) {
                        highcar = this.cars[i];
                        highscore = this.cars[i].score;
                    }
                }
                else {
                    if(this.cars[i].score >= highscore && 
                        this.cars[i].score <= leaders[leaders.length-1].score &&
                         !this.in_arr(this.cars[i], leaders)) {
                            highcar = this.cars[i];
                            highscore = this.cars[i].score;
                         }
                }
            }
            leaders.push(highcar)
        }
        return leaders;
    }

    in_arr(c, arr) {
        for(let i = 0;i<arr.length;i++){
            if(c.id == arr[i].id) return true;
        }
        return false;
    }

    lap_complete() {
        for(let i = 0;i<this.cars.length;i++) {
            if(this.cars[i].score > this.maxFitness) {
                return true;
            }
        }
        return false;
    }

    current_best_score() {
        let m = -1;
        for(let i = 0;i<this.cars.length;i++) {
            m = Math.max(m, this.cars[i].score);
        }
        return m;
    }
}