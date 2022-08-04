var Djikstra = /** @class */ (function () {
    function Djikstra(grid) {
        // proprietary data store
        this.index = 0;
        this.route = [];
        this.searching = [];
        this.iteration = 0;
        this.finish_found = false;
        this.complete = false;
        this.s = 0;
        this.s_name = "";
        this.it = 0;
        this.grid = grid;
    }
    Djikstra.prototype.step = function () {
        if (this.s === 0) {
            this.searching.push(this.grid.get_start());
            this.grid.get_start().classList.add("exploring");
            this.s = 1;
            this.grid.run = true;
            this.grid.cleared = false;
        }
        if (this.s === 1) {
            // if(this.index <= this.searching.length - 1) {
            if (this.searching.indexOf(document.querySelector("td.finish")) !== -1) {
                this.finish_found == true;
                this.index = this.searching.indexOf(document.querySelector("td.finish"));
                this.routing_cell = this.grid.get_finish();
                this.routing_cell.iteration = this.iteration;
                this.s = 2;
            }
            else if (this.searching[this.index] == this.grid.get_finish()) {
                this.finish_found == true;
                this.searching[this.index].iteration = this.iteration;
                this.routing_cell = this.grid.get_finish();
                this.s = 2;
            }
            else if (this.index === this.searching.length - 1) {
                this.searching[this.index].classList.remove("exploring");
                this.searching[this.index].classList.add("closed");
                // this.searching.splice(this.index,1);
                var x = this.searching[this.index].x, y = this.searching[this.index].y;
                var up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
                var left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);
                if (up != undefined && !up.classList.contains("wall") && !up.classList.contains("closed")) {
                    up.classList.add("exploring");
                }
                if (down != undefined && !down.classList.contains("wall") && !down.classList.contains("closed")) {
                    down.classList.add("exploring");
                }
                if (left != undefined && !left.classList.contains("wall") && !left.classList.contains("closed")) {
                    left.classList.add("exploring");
                }
                if (right != undefined && !right.classList.contains("wall") && !right.classList.contains("closed")) {
                    right.classList.add("exploring");
                }
                this.searching[this.index].iteration = this.iteration;
                this.iteration++;
                this.index = 0;
                this.searching = Array.prototype.slice.call(document.querySelectorAll("td.exploring"));
            }
            else {
                var x = this.searching[this.index].x, y = this.searching[this.index].y;
                var up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
                var left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);
                if (up != undefined && !up.classList.contains("wall") && !up.classList.contains("closed")) {
                    up.classList.add("exploring");
                }
                if (down != undefined && !down.classList.contains("wall") && !down.classList.contains("closed")) {
                    down.classList.add("exploring");
                }
                if (left != undefined && !left.classList.contains("wall") && !left.classList.contains("closed")) {
                    left.classList.add("exploring");
                }
                if (right != undefined && !right.classList.contains("wall") && !right.classList.contains("closed")) {
                    right.classList.add("exploring");
                }
                this.searching[this.index].iteration = this.iteration;
                this.searching[this.index].classList.remove("exploring");
                this.searching[this.index].classList.add("closed");
                this.index++;
            }
        }
        else if (this.s === 2) {
            var x = this.routing_cell.x, y = this.routing_cell.y;
            var up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
            var left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);
            if (this.routing_cell === this.grid.get_start()) {
                this.route.push(this.routing_cell);
                this.route = this.route.reverse();
                this.route.push(this.grid.get_finish());
                this.complete = true;
                this.s = 3;
                return;
            }
            if (up !== undefined && up.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = up;
                this.route.push(this.routing_cell);
            }
            if (down !== undefined && down.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = down;
                this.route.push(this.routing_cell);
            }
            if (left !== undefined && left.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = left;
                this.route.push(this.routing_cell);
            }
            if (right !== undefined && right.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = right;
                this.route.push(this.routing_cell);
            }
        }
        else if (this.s === 3) {
            this.grid.run = false;
        }
        else {
            this.grid.run = false;
        }
    };
    // universal data
    // required, custom implementation for alg
    Djikstra.prototype.reset = function () {
        this.index = 0;
        this.routing_cell == undefined;
        this.route = [];
        this.searching = [];
        this.iteration = 0;
        this.finish_found = false;
        this.complete = false;
        this.s = 0;
        this.s_name = "";
        this.it = 0;
        for (var i = 0; i < this.grid.height; i++) {
            for (var j = 0; j < this.grid.width; j++) {
                this.grid.at(j, i).classList.remove("traveled");
                this.grid.at(j, i).classList.remove("closed");
                this.grid.at(j, i).classList.remove("exploring");
                this.grid.at(j, i).classList.remove("visited");
                this.grid.at(j, i).classList.remove("ent");
                this.grid.at(j, i).style.borderTop = "";
                this.grid.at(j, i).style.borderBottom = "";
                this.grid.at(j, i).style.borderRight = "";
                this.grid.at(j, i).style.borderLeft = "";
            }
        }
    };
    return Djikstra;
}());
