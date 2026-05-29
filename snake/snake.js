class Snake {

    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(w / 2), floor(h / 2));
        this.xdir = 0;
        this.ydir = 0;
    }

    setDir(x, y) {
        this.xdir = x;
        this.ydir = y;
    }

    update() {
        // Only move if a direction has been set
        if (this.xdir !== 0 || this.ydir !== 0) {
            let head = this.body[this.body.length - 1].copy();
            this.body.shift();
            head.x += this.xdir;
            head.y += this.ydir;
            this.body.push(head);
        }
    }

    grow() {
        let head = this.body[this.body.length - 1].copy();
        this.body.unshift(head); // Add to the tail end safely
    }

    endGame(obstacles) {
        let head = this.body[this.body.length - 1];
        let x = head.x;
        let y = head.y;

        // Wall collisions
        if (x > w - 1 || x < 0 || y > h - 1 || y < 0) {
            return true;
        }

        // Self collisions (skip the head itself)
        for (let i = 0; i < this.body.length - 1; i++) {
            let part = this.body[i];
            if (part.x == x && part.y == y) {
                return true;
            }
        }

        // Obstacle collisions
        for (let obs of obstacles) {
            if (obs.x === x && obs.y === y) {
                return true;
            }
        }

        return false;
    }

    eat(pos) {
        let head = this.body[this.body.length - 1];
        if (head.x == pos.x && head.y == pos.y) {
            this.grow();
            return true;
        }
        return false;
    }

    show() {
        for (let i = 0; i < this.body.length; i++) {
            fill(255, 0, 128);
            noStroke();
            // Using a slightly rounded square for the body instead of a circle
            rect(this.body[i].x + 0.05, this.body[i].y + 0.05, 0.9, 0.9, 0.2);
        }
    }
}
