var BasicRandomizedPrim = /** @class */ (function () {
    function BasicRandomizedPrim(grid) {
        // proprietary data store
        this.walls = [];
        this.v = [];
        this.d_x = -1;
        this.d_y = -1;
        this.s_names = {
            0: "setting up grid",
            1: "choosing first path cell and initializing walls organization",
            2: "pathing",
            3: "completed"
        };
        this.complete = false;
        this.s = 0; //tracks current step in algorithm
        this.s_name = "";
        this.it = 0; //tracks total iterations of steps 
        this.grid = grid;
        for (var i = 0; i < this.grid.height; i++) {
            var a = [];
            for (var j = 0; j < this.grid.width; j++) {
                a.push(-1);
            }
            this.v.push(a);
        }
    }
    BasicRandomizedPrim.prototype.step = function () {
        this.set_step(this.s);
        if (this.s === 0) {
            this.grid.fill_walls();
            this.grid.clear_all();
            this.s = 1;
        }
        else if (this.s === 1) {
            var x = Math.floor(Math.random() * this.grid.width), y = Math.floor(Math.random() * this.grid.height);
            this.d_x = (x % 2 === 0) ? 0 : 1;
            this.d_y = (y % 2 === 0) ? 0 : 1;
            this.add_path(x, y);
            this.add_walls(this.get_wall_dn(x, y));
            this.s = 2;
        }
        else if (this.s === 2) {
            if (this.walls.length === 0) {
                this.s = 99;
                return;
            }
            var i = Math.floor(Math.random() * this.walls.length), x = this.walls[i].x, y = this.walls[i].y, n = this.get_path_dn(x, y), c = this.conflict(x, y);
            if (n.length === 1 && !c) {
                this.add_path(x, y);
                var new_walls = this.get_wall_dn(x, y);
                this.add_walls(new_walls);
            }
            this.remove_wall(i);
        }
        else if (this.s === 99) {
            this.reset_marked_cell();
            this.complete = true;
        }
    };
    // logic functions
    // note: 0 = left, 1 = right, 2 = up, 3 = down
    BasicRandomizedPrim.prototype.get_path_dn = function (x, y) {
        var r = [];
        if (this.grid.at(x, y + 1) != undefined && !this.grid.at(x, y + 1).classList.contains("wall")) {
            r.push(this.grid.at(x, y + 1));
        }
        if (this.grid.at(x, y - 1) != undefined && !this.grid.at(x, y - 1).classList.contains("wall")) {
            r.push(this.grid.at(x, y - 1));
        }
        if (this.grid.at(x + 1, y) != undefined && !this.grid.at(x + 1, y).classList.contains("wall")) {
            r.push(this.grid.at(x + 1, y));
        }
        if (this.grid.at(x - 1, y) != undefined && !this.grid.at(x - 1, y).classList.contains("wall")) {
            r.push(this.grid.at(x - 1, y));
        }
        return r;
    };
    BasicRandomizedPrim.prototype.get_wall_dn = function (x, y) {
        var r = [];
        if (this.grid.at(x, y + 1) != undefined && !this.p_restrict(x, y, 3)) {
            this.set_value(x, y + 1, 3);
            if (!this.conflict(x, y + 1)) {
                r.push(this.grid.at(x, y + 1));
            }
        }
        if (this.grid.at(x, y - 1) != undefined && !this.p_restrict(x, y, 2)) {
            this.set_value(x, y - 1, 2);
            if (!this.conflict(x, y - 1)) {
                r.push(this.grid.at(x, y - 1));
            }
        }
        if (this.grid.at(x + 1, y) != undefined && !this.p_restrict(x, y, 1)) {
            this.set_value(x + 1, y, 1);
            if (!this.conflict(x + 1, y)) {
                r.push(this.grid.at(x + 1, y));
            }
        }
        if (this.grid.at(x - 1, y) != undefined && !this.p_restrict(x, y, 0)) {
            this.set_value(x - 1, y, 0);
            if (!this.conflict(x - 1, y)) {
                r.push(this.grid.at(x - 1, y));
            }
        }
        return r;
    };
    BasicRandomizedPrim.prototype.p_restrict = function (x, y, dir) {
        if (dir === 0 || dir === 1) {
            var dy = (y % 2 == 0) ? 0 : 1;
            if (this.d_y == dy) {
                return false;
            }
            else {
                return true;
            }
        }
        else if (dir === 2 || dir === 3) {
            var dx = (x % 2 == 0) ? 0 : 1;
            if (this.d_x == dx) {
                return false;
            }
            else {
                return true;
            }
        }
        return true;
    };
    BasicRandomizedPrim.prototype.conflict = function (x, y) {
        var v = this.get_value(x, y);
        if (v === 0 && ((this.c(x - 1, y + 1) || this.c(x - 1, y - 1)))) {
            return true;
        }
        else if (v === 1 && ((this.c(x + 1, y + 1) || this.c(x + 1, y - 1)))) {
            return true;
        }
        else if (v === 2 && ((this.c(x - 1, y - 1) || this.c(x + 1, y - 1)))) {
            return true;
        }
        if (v === 3 && ((this.c(x - 1, y + 1) || this.c(x + 1, y + 1)))) {
            return true;
        }
        return false;
    };
    BasicRandomizedPrim.prototype.c = function (x, y) {
        if (this.grid.at(x, y) == undefined) {
            return false;
        }
        else if (!this.grid.at(x, y).classList.contains("wall") || this.grid.at(x, y).classList.contains("frontier")) {
            return true;
        }
        return false;
    };
    // primary functions
    BasicRandomizedPrim.prototype.add_walls = function (walls) {
        for (var i = 0; i < walls.length; i++) {
            if (walls[i].classList.contains("wall")) {
                walls[i].classList.add("frontier");
                this.walls.push(walls[i]);
            }
        }
    };
    BasicRandomizedPrim.prototype.remove_wall = function (index) {
        this.walls[index].classList.remove("frontier");
        this.walls.splice(index, 1);
    };
    // styling
    BasicRandomizedPrim.prototype.add_path = function (x, y) {
        this.grid.remove_wall(x, y);
        this.set_marked_cell(x, y);
    };
    BasicRandomizedPrim.prototype.set_marked_cell = function (x, y) {
        var prev_c = document.querySelector("td.marked");
        if (prev_c !== null) {
            prev_c.style.background = prev_c.default_color;
            prev_c.classList.remove("marked");
        }
        this.grid.at(x, y).classList.add("marked");
        this.grid.at(x, y).style.background = "red";
    };
    BasicRandomizedPrim.prototype.reset_marked_cell = function () {
        var prev_c = document.querySelector("td.marked");
        prev_c.classList.remove("marked");
        prev_c.style.background = prev_c.default_color;
    };
    BasicRandomizedPrim.prototype.get_value = function (x, y) {
        return this.v[y][x];
    };
    BasicRandomizedPrim.prototype.set_value = function (x, y, v) {
        this.v[y][x] = v;
    };
    // universal data
    BasicRandomizedPrim.prototype.set_step = function (s) {
        set_step_name(this.s_names[s]);
    };
    BasicRandomizedPrim.prototype.reset = function () {
        this.complete = false;
        this.s = 0;
        this.s_name = "";
        this.it = 0;
    };
    return BasicRandomizedPrim;
}());
