class Radar {
    constructor(car) {
        this.sensors = []
        this.max_sensor_distance = 500;
    }

    make_line(car, ang) {
        let v = createVector(1000, 1000);
  
        v.setHeading(radians(ang));
        v.setMag(this.max_sensor_distance);
        v.rotate(radians(car._wheelRotation));
        v.add(createVector(car.pos.x, car.pos.y));

        return new Line(car.pos, v, this.max_sensor_distance);
    }

    update_sensors(car) {
        this.sensors = []
        this.sensors.push(this.make_line(car, 270));
        this.sensors.push(this.make_line(car, 315));
        this.sensors.push(this.make_line(car, 0));
        this.sensors.push(this.make_line(car, 45));
        this.sensors.push(this.make_line(car, 90));
    }

    generate_inputs() {
        let ins = []
        for(let i = 0;i<this.sensors.length;i++) {
            ins.push([map(this.sensors[i].get_dist(), 0, this.max_sensor_distance, 0, 1)]);
        }
        return ins;
    }

    get_fitness() {
        let ins = this.generate_inputs();
        let running = 0;
        for(let i = 0;i<ins.length;i++) running += parseFloat(ins[i]);
        return running / ins.length;
    }

    update(track, car) {
        this.update_sensors(car);

        for(let i = 0;i<this.sensors.length;i++) {
            track.intersects(this.sensors[i]);
        }
    }

    show() {
        for(let i = 0;i<this.sensors.length;i++) {
            this.sensors[i].draw();
        }
    }

}