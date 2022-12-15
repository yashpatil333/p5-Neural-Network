class Track2 {

    constructor() {
        this.rects = []
        this.win = new myRect(createVector());
        this.init();
    }

    init() {
        let mx = 50, my = 200;

        /*
        createVector(277.5, 200.5), 453, 105
        createVector(82.5, 559.5), 67, 637
        createVector(762, 834.5), 1424, 67
        createVector(1433.5, 443.5), -69, -835
        createVector(979, 53.5), -962, 53
        createVector(527.5, 142.5), -55, 219
        createVector(475, 528), 450, 256
        createVector(968, 275.5), 440, 49
        createVector(1176, 473), 50, 344
        createVector(919, 623.5), 138, 350
        createVector(724.5, 300.5), -53, 105
        createVector(694.5, 376), -111, 50
        */
        this.rects.push(new myRect(createVector(277.5, 200.5), 453, 105));
        this.rects.push(new myRect(createVector(82.5, 559.5), 67, 637));
        this.rects.push(new myRect(createVector(762, 834.5), 1424, 67));
        this.rects.push(new myRect(createVector(1433.5, 443.5), 69, 835));
        this.rects.push(new myRect(createVector(979, 53.5), 962, 53));
        this.rects.push(new myRect(createVector(527.5, 142.5), 55, 219));
        this.rects.push(new myRect(createVector(475, 528), 450, 256));
        this.rects.push(new myRect(createVector(968, 275.5), 440, 49));
        this.rects.push(new myRect(createVector(1176, 473), 50, 344));
        this.rects.push(new myRect(createVector(919, 630), 138, 350));
        this.rects.push(new myRect(createVector(724.5, 300.5), 53, 105));
        this.rects.push(new myRect(createVector(694.5, 376), 111, 50));
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