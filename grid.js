var ui;
var Grid = /** @class */ (function () {
    function Grid(width, height, grid) {
        var _a;
        // finish and start movement functionality
        this.multiplier = 1.7;
        // primary configuration
        this.paint_btn = document.querySelector("#add_wall_btn");
        this.move_start_btn = document.querySelector("#add_start_btn");
        this.move_finish_btn = document.querySelector("#add_finish_btn");
        this.set_height = -1;
        this.set_width = -1;
        this.start_x = -1;
        this.start_y = -1;
        this.finish_x = -1;
        this.finish_y = -1;
        this.min_dim = 4;
        this.max_dim = 100;
        // grid status
        this.painting = true; //reports whether the paint tool is activated
        this.cleared = true; //reports whether the grid is cleared
        this.run = false; //reports wether the grid is being used to prevent disruption
        this.revealed = false; //based on initial status of grid when first start
        this.locked = false;
        this.moving_elem = false;
        this.moving_elem_type = 0; //0 = start, 1 = finish
        this.has_start = true;
        this.has_finish = true;
        this.width = width;
        this.height = height;
        this.grid_object = grid;
        this.grid_object.grid = this;
        this.init();
        this.grid_object.style.display = "";
        (_a = document.querySelector(".floating")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        this.grid_object.addEventListener("mouseover", function (e) {
            var grid = e.currentTarget;
            grid = grid.grid;
            var el = e.target;
            grid.move_floating_element(el.x, el.y);
            if (grid.moving_elem) {
            }
            else {
                if (e.buttons == 1) {
                    grid.click(el.x, el.y);
                    // if(!grid.moving_elem && grid.painting) grid.toggle_wall(el.x, el.y);
                }
            }
        });
        this.grid_object.addEventListener("mousedown", function (e) {
            var grid = e.currentTarget;
            grid = grid.grid;
            var el = e.target;
            grid.click(el.x, el.y);
        });
    }
    Grid.prototype.init = function () {
        this.clear();
        for (var i = 0; i < this.height; i++) {
            var row = document.createElement("tr");
            for (var j = 0; j < this.width; j++) {
                var cell = document.createElement("td");
                cell.default_color = this.color_random();
                cell.style.backgroundColor = cell.default_color;
                row.appendChild(cell);
            }
            this.grid_object.appendChild(row);
        }
    };
    Grid.prototype.clear = function () {
        this.grid_object.innerHTML = "";
    };
    Grid.prototype.add_row = function () {
        var row = document.createElement("tr");
        for (var j = 0; j < this.width; j++) {
            var cell = document.createElement("td");
            cell.default_color = this.color_random();
            cell.style.backgroundColor = cell.default_color;
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
            row.appendChild(cell);
            cell.x = j;
            if ((typeof cell.x) == 'string') {
                console.log("bruh string cell!");
            }
            cell.y = this.height;
        }
        this.grid_object.appendChild(row);
        this.height = this.grid_object.rows.length;
    };
    Grid.prototype.remove_row = function () {
        if (this.height > this.min_dim) {
            if (this.start_y == this.height - 1) {
                this.set_start(this.start_x, this.start_y - 1);
            }
            if (this.finish_y == this.height - 1) {
                this.set_finish(this.finish_x, this.finish_y - 1);
            }
            this.grid_object.lastChild.remove();
            this.height = this.grid_object.rows.length;
        }
    };
    Grid.prototype.add_column = function () {
        for (var i = 0; i < this.height; i++) {
            var cell = document.createElement("td");
            cell.default_color = this.color_random();
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
            // cell.style.backgroundColor = cell.default_color;
            cell.addEventListener("click", function (e) {
                mod(e.target);
            });
            this.grid_object.rows[i].appendChild(cell);
            cell.x = this.width;
            if ((typeof cell.x) == 'string') {
                console.log("string cell!");
            }
            cell.y = i;
        }
        this.width = this.grid_object.rows[0].cells.length;
    };
    Grid.prototype.remove_column = function () {
        if (this.width > this.min_dim) {
            if (this.start_x == this.width - 1) {
                this.set_start(this.start_x - 1, this.start_y);
            }
            if (this.finish_x == this.width - 1) {
                this.set_finish(this.width - 2, this.finish_y);
            }
            for (var i = 0; i < this.height; i++) {
                this.grid_object.rows[i].lastChild.remove();
            }
            this.width = this.grid_object.rows[0].cells.length;
        }
    };
    Grid.prototype.set_rows = function (rows) {
        while (this.set_height != this.height) {
            if (this.set_height > this.height) {
                this.add_row();
            }
            else {
                this.remove_row();
            }
        }
    };
    Grid.prototype.set_columns = function (columns) {
        while (this.set_width != this.width) {
            if (this.set_width > this.width) {
                this.add_column();
            }
            else {
                this.remove_column();
            }
        }
    };
    Grid.prototype.set_start = function (x, y) {
        this.start_x = x;
        this.start_y = y;
        var old = this.grid_object.querySelector(".start");
        old === null || old === void 0 ? void 0 : old.classList.remove("start");
        this.grid_object.rows[y].cells[x].classList.add("start");
        this.move_start_btn.removeAttribute("hover_tag");
        this.ui.remove_notice(this.move_start_btn);
    };
    Grid.prototype.set_finish = function (x, y) {
        this.finish_x = x;
        this.finish_y = y;
        var old = this.grid_object.querySelector(".finish");
        old === null || old === void 0 ? void 0 : old.classList.remove("finish");
        this.grid_object.rows[y].cells[x].classList.add("finish");
        this.move_finish_btn.removeAttribute("hover_tag");
        this.ui.remove_notice(this.move_finish_btn);
    };
    Grid.prototype.add_wall = function (x, y) {
        this.at(x, y).classList.add("wall");
    };
    Grid.prototype.toggle_wall = function (x, y) {
        if (!grid.is_finish(x, y) && !grid.is_start(x, y)) {
            grid.at(x, y).classList.toggle("wall");
        }
    };
    Grid.prototype.remove_wall = function (x, y) {
        this.at(x, y).classList.remove("wall");
    };
    Grid.prototype.fill_walls = function () {
        debug.log("filling walls: @" + console.trace());
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.add_wall(j, i);
            }
        }
    };
    Grid.prototype.clear_walls = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.remove_wall(j, i);
            }
        }
    };
    Grid.prototype.color_random = function () {
        return "";
    };
    Grid.prototype.at = function (x, y) {
        if (x < 0 || y < 0 || y >= this.height || x >= this.width) {
            return undefined;
        }
        return this.grid_object.rows[y].cells[x];
    };
    /*
    @returns whether the two cells are adjacent
    */
    Grid.prototype.adjacent = function (a, b) {
        if (a.x != b.x && a.y != b.y) {
            return false;
        }
        else if (Math.abs(b.x - a.x) == 1 && b.y == a.y) {
            return true;
        }
        else if (Math.abs(b.y - a.y) == 1 && b.x == a.x) {
            return true;
        }
        return false;
    };
    Grid.prototype.update_coords = function () {
        for (var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.grid_object.rows[i].cells[j].x = j;
                this.grid_object.rows[i].cells[j].y = i;
            }
        }
    };
    Grid.prototype.clear_all = function () {
    };
    Grid.prototype.reset = function () {
        if (!this.run) {
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    var cell = this.grid_object.rows[i].cells[j];
                    cell.classList.remove("visited");
                    cell.classList.remove("ent");
                    cell.classList.remove("traveled");
                    cell.classList.remove("closed");
                    cell.classList.remove("exploring");
                    cell.iteration = Number.MAX_SAFE_INTEGER;
                }
            }
            this.cleared = true;
        }
    };
    Grid.prototype.click = function (x, y) {
        if (this.moving_elem) {
            if (this.moving_elem_type === 0) {
                if (!this.is_finish(x, y) && !this.is_wall(x, y)) {
                    this.complete_move(x, y);
                }
            }
            else if (this.moving_elem_type === 1) {
                if (!this.is_start(x, y) && !this.is_wall(x, y)) {
                    this.complete_move(x, y);
                }
            }
        }
        else if (this.is_start(x, y)) {
            if (!this.moving_elem) {
                this.start_move(0);
            }
        }
        else if (this.is_finish(x, y)) {
            if (!this.moving_elem) {
                this.start_move(1);
            }
        }
        else if (this.painting) {
            this.toggle_wall(x, y);
        }
    };
    Grid.prototype.is_start = function (x, y) {
        return (grid.at(x, y).classList.contains("start")) ? true : false;
    };
    Grid.prototype.is_finish = function (x, y) {
        return (grid.at(x, y).classList.contains("finish")) ? true : false;
    };
    Grid.prototype.is_wall = function (x, y) {
        return (grid.at(x, y).classList.contains("wall")) ? true : false;
    };
    Grid.prototype.get_start = function () {
        if (this.grid_object.querySelector("td.start") == null) {
            return undefined;
        }
        return this.grid_object.querySelector("td.start");
    };
    Grid.prototype.get_finish = function () {
        if (this.grid_object.querySelector("td.finish") == null) {
            return undefined;
        }
        return this.grid_object.querySelector("td.finish");
    };
    Grid.prototype.create_floating_element = function () {
        var el = document.createElement("div");
        el.classList.add("floating");
        el.classList.add("hidden");
        el.style.transform = "scale(1)";
        if (this.moving_elem_type == 0) {
            el.classList.add("floating_start");
        }
        else if (this.moving_elem_type == 1) {
            el.classList.add("floating_finish");
        }
        el.style.width = (this.at(0, 0).offsetWidth * this.multiplier) + "px";
        el.style.height = (this.at(0, 0).offsetHeight * this.multiplier) + "px";
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.left = "0px";
        el.style.zIndex = "1001";
        document.body.appendChild(el);
        this.floating_elem = el;
    };
    Grid.prototype.move_floating_element = function (x, y) {
        var _x = grid.at(x, y).offsetLeft + grid.grid_object.offsetLeft, _y = grid.at(x, y).offsetTop + grid.grid_object.offsetTop;
        this.floating_elem.style.top = _y - (this.at(0, 0).offsetHeight * ((this.multiplier - 1) * 0.5)) + "px";
        this.floating_elem.style.left = _x - (this.at(0, 0).offsetWidth * ((this.multiplier - 1) * 0.5)) + "px";
    };
    Grid.prototype.start_move = function (type) {
        console.log("start move");
        if (!this.moving_elem) {
            this.deactivate_paint();
            this.floating_elem.classList.remove("hidden");
            this.moving_elem = true;
            this.moving_elem_type = type;
            this.floating_elem.style.transform = "scale(1)";
            if (type == 0) {
                this.move_start_btn.classList.add("activated");
                this.ui.remove_notice(this.move_start_btn);
                this.remove_start();
                this.floating_elem.classList.add("floating_start");
                this.floating_elem.classList.remove("floating_finish");
            }
            else if (type == 1) {
                this.move_finish_btn.classList.add("activated");
                this.ui.remove_notice(this.move_finish_btn);
                this.remove_finish();
                this.floating_elem.classList.add("floating_finish");
                this.floating_elem.classList.remove("floating_start");
            }
        }
    };
    Grid.prototype.complete_move = function (x, y) {
        console.log("complete move");
        if (this.moving_elem_type === 0) {
            if (!this.is_finish(x, y) && !this.is_wall(x, y)) {
                this.set_start(x, y);
                this.moving_elem = false;
                this.floating_elem.style.transform = "scale(" + (1 / this.multiplier) + ")";
                this.floating_elem.classList.add("hidden");
                this.move_start_btn.classList.remove("activated");
                this.activate_paint();
            }
        }
        else if (this.moving_elem_type === 1) {
            if (!this.is_start(x, y) && !this.is_wall(x, y)) {
                this.set_finish(x, y);
                this.moving_elem = false;
                this.floating_elem.style.transform = "scale(" + (1 / this.multiplier) + ")";
                this.floating_elem.classList.add("hidden");
                this.move_finish_btn.classList.remove("activated");
                this.activate_paint();
            }
        }
    };
    Grid.prototype.cancel_move = function () {
    };
    Grid.prototype.activate_paint = function () {
        if (!this.locked && !this.moving_elem) {
            this.painting = true;
            this.paint_btn.classList.add("activated");
        }
    };
    Grid.prototype.deactivate_paint = function () {
        this.painting = false;
        this.paint_btn.classList.remove("activated");
    };
    Grid.prototype.toggle_paint = function () {
        if (this.painting) {
            this.deactivate_paint();
        }
        else {
            this.activate_paint();
        }
    };
    Grid.prototype.lock = function () {
        this.grid_object.classList.add("unclickable");
        this.locked = true;
    };
    Grid.prototype.unlock = function () {
        this.grid_object.classList.remove("unclickable");
        this.locked = false;
    };
    Grid.prototype.is_moving = function () { return this.moving_elem; };
    Grid.prototype.remove_start = function () {
        if (this.get_start() !== undefined) {
            this.get_start().classList.remove("start");
        }
        this.start_x = -1;
        this.start_y = -1;
        if (!this.moving_elem) {
            this.ui.add_notice(this.move_start_btn);
            this.move_start_btn.setAttribute("hover_tag", "missing from the grid");
        }
    };
    Grid.prototype.remove_finish = function () {
        if (this.get_finish() !== undefined) {
            this.get_finish().classList.remove("finish");
        }
        this.finish_x = -1;
        this.finish_y = -1;
        if (!this.moving_elem) {
            this.ui.add_notice(this.move_finish_btn);
            this.move_finish_btn.setAttribute("hover_tag", "missing from the grid");
        }
    };
    Grid.prototype.remove_start_finish = function () {
        debug.notice("Both the start and finish nodes have been cleared from the grid. They can be re-added by using the buttons below once the maze has been cleared or finished generating.");
        this.remove_start();
        this.remove_finish();
    };
    Grid.prototype.set_ui = function (ui) {
        this.ui = ui;
    };
    return Grid;
}());
// grid modifier
function mod(object) {
    if (object.matches("td.finish") || object.matches("td.start")) {
        return;
    }
    else {
        object.classList.toggle("wall");
    }
}
// special effects
var wave_count = -1;
function wave(grid) {
    console.log("wave!");
    // wave_count = grid.height * 2 - 1;
    wave_impl([grid.at(0, 0)], grid);
}
function wave_impl(cells, grid) {
    console.log("wave_impl");
    var cells_new = [];
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        grid.at(cell.x, cell.y + 1) !== undefined ? cells_new.push(grid.at(cell.x, cell.y + 1)) : undefined;
        grid.at(cell.x + 1, cell.y) !== undefined ? cells_new.push(grid.at(cell.x + 1, cell.y)) : undefined;
        cell.style.backgroundColor = "white";
        cell.style.transform = "scale(1.3)";
        cell.style.boxShadow = "0px 0px 50px 4px white";
        setTimeout(function (cell) {
            cell.style.backgroundColor = cell.default_color;
            cell.style.transform = "scale(1)";
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
        }, 350, cell);
    }
    if (cells_new.length === 0) {
        // wave_end(grid);
        return;
    }
    else {
        for (var i = 0; i < cells_new.length; i++) {
        }
        setTimeout(function (cells_new, grid) {
            wave_impl(cells_new, grid);
        }, 100, cells_new, grid);
        // wave_impl(cells_new);
    }
}
function wave_end(grid) {
    for (var i = 0; i < grid.height; i++) {
        for (var j = 0; j < grid.width; j++) {
            grid.at(i, j).classList.remove('wave');
        }
    }
}
