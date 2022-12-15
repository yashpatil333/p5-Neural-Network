class myRect {

    constructor(pos, width, height) {
        this.pos = pos;
        this.width = width;
        this.height = height;

        this.update_lines(0);
    }

    update_lines(ang) {
        let _bl = createVector(this.width/2, this.height/2).rotate(radians(ang));
        let _tl = createVector(-this.width/2, this.height/2).rotate(radians(ang));
        
        let _br = createVector(this.width/2, -this.height/2).rotate(radians(ang));
        let _tr = createVector(-this.width/2, -this.height/2).rotate(radians(ang));


        let bl = p5.Vector.add(this.pos, _bl);
        let tl = p5.Vector.add(this.pos, _tl);

        let br = p5.Vector.add(this.pos, _br);
        let tr = p5.Vector.add(this.pos, _tr);

        // circle(bl.x, bl.y, 5);
        // circle(tl.x, tl.y, 5);

        // circle(br.x, br.y, 5);
        // circle(tr.x, tr.y, 5);
        
        this.lines = []

        this.lines.push(new Line(tl, tr));
        this.lines.push(new Line(tl, bl));
        this.lines.push(new Line(bl, br));
        this.lines.push(new Line(tr, br));

        for(let l = 0;l<this.lines.length;l++) {
            this.lines[l].draw();
        }

        return this.lines;
    }

    intersects(other) {
        if(other.constructor.name == 'myRect') {
            for(let i = 0;i<this.lines.length;i++) {
                for(let j = 0;j<other.lines.length;j++) {
                    if(this.lines[i].intersects_at(other.lines[j]) != null) {
                        return true;
                    }
                }
            }
            return false;
        }
        else
        if(other.constructor.name == 'Line') {

            for(let i = 0;i<this.lines.length;i++) {
                let res = this.lines[i].intersects_at(other);
                if(res != null) {

                    if(other.closest == null) {
                        other.closest = res;
                    }
                    else {
                        let cost = this.calculate_dist(other.start, res);
                        if(cost < other.get_dist()) {
                            other.closest = res;
                        }
                    }
                }
            }
            
        }
    }

    show() {
        rectMode(CENTER);
        rect(this.pos.x, this.pos.y, this.width, this.height);
    }

    calculate_dist(s, e) {
        return sqrt( (s.x - e.x)*(s.x - e.x) + (s.y - e.y)*(s.y - e.y) );
    }
}