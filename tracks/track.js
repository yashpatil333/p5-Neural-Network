class Track {

    constructor() {
        this.rects = []
        this.win = new myRect(createVector());
        this.init();
    }

    init() {
        let mx = 50, my = 200;
        this.rects.push(new myRect(createVector(mx+700, my+300), 1400, 700));
        this.rects.push(new myRect(createVector(mx+700, my+300), 1000, 400));
    }

    show() {
        noFill();
        stroke(255, 0, 0);
        for(let i = 0;i<this.rects.length;i++) this.rects[i].show();
    }

    intersects(other) {
        if(other.constructor.name == 'Line') {
            for(let i = 0;i<this.rects.length;i++) 
                this.rects[i].intersects(other);
        }
        else
        if(other.constructor.name == 'Car') {
            for(let i = 0;i<this.rects.length;i++) {
                if(this.rects[i].intersects(other.r)) {
                    console.log("Collision!");
                    other.dead = true;
                }
            }
        }
    }
}