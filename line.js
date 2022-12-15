class Line {
    
  constructor(_start, _end, max_sensor_distance) {
    this.start = _start;
    this.end   = _end;
    this.closest = null;
    this.max_sensor_distance = max_sensor_distance;
  }

  set_start(_start) {
    this.start = _start;
  }

  set_end(_end) {
    this.end = _end;
  }

  get_start() {
    return this.start;
  }

  get_end() {
    return this.end;
  }

  draw() {
    stroke(255, 255, 0);
    if(this.closest == null) {
      //line(this.start.x, this.start.y, this.end.x, this.end.y);
    }
    else {
      //line(this.start.x, this.start.y, this.closest.x, this.closest.y);
      fill(0, 255, 0);
      ellipse(this.closest.x, this.closest.y, 10, 10);
    }
    stroke(0);
  }

  get_dist() {
    if(this.closest == null)
      return this.max_sensor_distance;
    return sqrt( (this.start.x - this.closest.x)*(this.start.x - this.closest.x) + (this.start.y - this.closest.y)*(this.start.y - this.closest.y) )
  }

  line_itersection(one, two) {
    let x1 = one.get_start().x;
    let y1 = one.get_start().y;
    let x2 = one.get_end().x;
    let y2 = one.get_end().y;

    let x3 = two.get_start().x;
    let y3 = two.get_start().y;
    let x4 = two.get_end().x;
    let y4 = two.get_end().y;

    let bx = x2 - x1;
    let by = y2 - y1;
    let dx = x4 - x3;
    let dy = y4 - y3;

    let b_dot_d_perp = bx * dy - by * dx;

    if(b_dot_d_perp == 0) return null;

    let cx = x3 - x1;
    let cy = y3 - y1;

    let t = (cx * dy - cy * dx) / b_dot_d_perp;
    if(t < 0 || t > 1) return null;

    let u = (cx * by - cy * bx) / b_dot_d_perp;
    if(u < 0 || u > 1) return null;

    return createVector(x1+t*bx, y1+t*by);
  }

  intersects_at(other) {
    return this.line_itersection(this, other);
  }
}