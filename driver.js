// export {};
// declare global {
//     interface Window { iterations: any; algorithm: number;}
// }
// defaults
var timing = 250;
var iterations = 0;
var algorithm = 1;
// 0 = rec
// 1 = dji
// 2 = ast
// globals
var maze_input = document.querySelector("#maze_controls > .controls > .selector");
var path_input = document.querySelector("#alg_controls > .controls > .selector");
// driver code
// @params {array} path to finish from start
function driver(route, position) {
    var _a;
    if (route === undefined)
        return;
    position++;
    (_a = document.querySelector("td.ent")) === null || _a === void 0 ? void 0 : _a.classList.remove("ent");
    ;
    route[position].classList.add("ent");
    for (var i = 0; i < position; i++) {
        route[i].classList.add("traveled");
    }
    if (position < route.length - 1) {
        setTimeout(function () {
            driver(route, position);
        }, timing);
    }
}
// pathing algorithms
// recursive algorithm
var abs_min = -1;
// var min_p:number = MAX_VALUE;
function path_recursive(route, c_x, c_y) {
    abs_min = Math.abs(grid.finish_x - grid.start_x) + Math.abs(grid.finish_y - grid.start_y);
    return path_recursive_impl(route, c_x, c_y);
}
// @returns {array} route of cells to finish
function path_recursive_impl(route, c_x, c_y) {
    iterations++;
    if (grid.at(c_x, c_y) === undefined)
        return undefined;
    var cell = grid.at(c_x, c_y);
    var path = copy(route);
    if (cell.matches("td.finish")) {
        path.push(grid.at(c_x, c_y));
        return path;
    }
    if (route.indexOf(cell) !== -1)
        return undefined;
    if (cell.matches("td.wall"))
        return undefined;
    cell.classList.add("visited");
    path.push(cell);
    var up = path_recursive_impl(path, c_x, c_y - 1);
    var down = path_recursive_impl(path, c_x, c_y + 1);
    var left = path_recursive_impl(path, c_x - 1, c_y);
    var right = path_recursive_impl(path, c_x + 1, c_y);
    var paths = [];
    if (up != undefined)
        paths.push(up);
    if (down != undefined)
        paths.push(down);
    if (left != undefined)
        paths.push(left);
    if (right != undefined)
        paths.push(right);
    if (paths.length == 0) {
        return undefined;
    }
    else {
        var min_path = paths[0];
        for (var i = 1; i < paths.length; i++) {
            if (paths[i].length < min_path.length) {
                min_path = paths[i];
            }
        }
        return min_path;
    }
}
// djikstra's algorithm
var djikstra = /** @class */ (function () {
    function djikstra(grid) {
        this.state = 0; //0=not started, 1=search, 2=generate path, 3=finished
        this.searching = [];
        this.finish_found = false;
        this.iteration = 0;
        this.index = 0;
        this.route = [];
        this.grid = grid;
    }
    djikstra.prototype.explore_adjacent = function (cell) {
    };
    djikstra.prototype.explore = function () {
        this.searching.push(this.grid.get_start());
        this.grid.get_start().classList.add("exploring");
        this.state = 1;
        this.grid.run = true;
        this.grid.cleared = false;
        var r = this.explore_impl();
        return r;
    };
    djikstra.prototype.explore_impl = function () {
        if (this.state === 1) {
            // if(this.index <= this.searching.length - 1) {
            if (this.searching[this.index] == this.grid.get_finish()) {
                this.finish_found == true;
                this.searching[this.index].iteration = this.iteration;
                this.routing_cell = this.grid.get_finish();
                this.state = 2;
                this.index++;
                return this.explore_impl();
            }
            else if (this.index === this.searching.length - 1) {
                this.searching[this.index].classList.remove("exploring");
                this.searching[this.index].classList.add("closed");
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
                return this.explore_impl();
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
                return this.explore_impl();
            }
            this.index++;
            // } else {
            //     this.index++;
            // }
        }
        else if (this.state === 2) {
            var x = this.routing_cell.x, y = this.routing_cell.y;
            var up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
            var left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);
            if (this.routing_cell === this.grid.get_start()) {
                this.route.push(this.routing_cell);
                this.route = this.route.reverse();
                this.route.push(this.grid.get_finish());
                return this.route;
            }
            if (up.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = up;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if (down.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = down;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if (left.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = left;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if (right.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = right;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
        }
        else if (this.state === 3) {
        }
        else {
            this.grid.run = false;
        }
        return this.route;
    };
    return djikstra;
}());
var Simulator = /** @class */ (function () {
    function Simulator() {
        this.sim_controls_locked = false;
        // 0 = maze, 1 = path
        this.type = 0;
        this.start_completed = false;
        this.d = 0;
        this.paused = false;
        this.active = false;
        this.set_delay(15);
    }
    Simulator.prototype.run = function () {
        if (this.start_completed === false) {
            debug.notice("Controls for updating the grid and modifying other variables are locked until the simulation is paused.");
            grid.lock();
            this.start_completed = true;
        }
        if (!this.paused) {
            if (this.type === 1) {
                try {
                    this.path_alg.step();
                    if (this.path_alg.complete) {
                        this.active = false;
                        ui.pause();
                        debug.log("complete!");
                    }
                }
                catch (e) {
                    this.pause();
                    debug.alert("An error occured with the simulator. You can make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>" + ". Please provide specific details on the program's configuration to help me discern the origin of this error. <a style='color:orange;display:contents'> Error message: " + e + "</a>");
                    this.reset();
                }
                if (!this.path_alg.complete) {
                    setTimeout(function (s) {
                        s.run();
                    }, this.get_delay(), this);
                }
                else {
                    debug.log("fart test");
                    this.driver(this.path_alg.route, 0);
                }
            }
            else if (this.type === 0) {
                try {
                    this.maze_alg.step();
                    if (this.maze_alg.complete) {
                        this.active = false;
                        ui.pause();
                        ui.design_unlock();
                        debug.log("complete!");
                    }
                }
                catch (e) {
                    this.pause();
                    debug.alert("An error occured with the simulator. You can make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>" + ". <a style='color:orange;display:contents'> Error message: " + e + "</a>");
                    this.reset();
                }
                if (!this.maze_alg.complete) {
                    setTimeout(function (s) {
                        s.run();
                    }, this.get_delay(), this);
                }
                else {
                    this.start_completed = false;
                }
            }
        }
    };
    Simulator.prototype.pause = function () {
        ui.restart_btn_unlock();
        ui.skip_btn_unlock();
        ui.pause();
        if (this.type === 0) {
            ui.set_play_btn_type(0);
        }
        else if (this.type === 1) {
            ui.set_play_btn_type(0);
        }
        this.paused = true;
    };
    Simulator.prototype.play = function () {
        ui.restart_btn_lock();
        ui.skip_btn_lock();
        ui.play();
        ui.customization_lock();
        this.paused = false;
        this.run();
    };
    Simulator.prototype.pausePlay = function () {
        if (this.active) {
            if (this.paused) {
                this.play();
            }
            else {
                this.pause();
            }
        }
        else {
            debug.notice("To begin running the simulation, please select either the maze generator or path simulator buttons.");
        }
    };
    Simulator.prototype.gen_maze = function () {
        if (!this.active) {
            this.active = true;
            run_btn.onclick = function () {
                sim.pausePlay();
            };
            this.play();
            ui.customization_lock();
            ui.restart_btn_lock();
            ui.skip_btn_lock();
            this.type = 0;
            grid.deactivate_paint();
            grid.remove_start_finish();
            this.run();
        }
    };
    Simulator.prototype.gen_path = function () {
        if (!this.active) {
            this.active = true;
            run_btn.onclick = function () {
                sim.pausePlay();
            };
            this.play();
            ui.customization_lock();
            ui.restart_btn_lock();
            debug.log("generating a path!");
            this.type = 1;
            this.run();
        }
    };
    Simulator.prototype.set_delay = function (delay) {
        if (delay < 5) {
            debug.alert("Delay must be 5ms or higher.");
        }
        else if (delay >= 10000) {
            debug.notice("Did you mean to set a delay of 10 seconds or longer? I mean, if it's really what you want, I'm perfectly fine with it. It's just, y'know, kinda weird? I get it, maybe you're just trying to mess around. Or maybe it's a typo. But, y'know, still kinda weird. There's a reason I decided to write this long and drawn-out warning message, and I've forgotten it.");
        }
        else {
            this.d = delay;
        }
    };
    Simulator.prototype.get_delay = function () {
        return this.d;
    };
    Simulator.prototype.set_algorithm = function (algorithm) {
        this.alg = algorithm;
        this.alg.reset();
    };
    Simulator.prototype.set_path_alg = function (algorithm) {
        this.path_alg = algorithm();
        this.path_alg.reset();
    };
    Simulator.prototype.set_maze_alg = function (algorithm) {
        this.maze_alg = algorithm();
        this.maze_alg.reset();
    };
    Simulator.prototype.reset = function () {
        if (this.type == 0) {
            this.reset_maze();
            this.active = false;
            ui.set_play_btn_type(2);
            run_btn.setAttribute("hover_hint", "generate a maze");
            run_btn.onclick = function () {
                sim.gen_maze();
            };
        }
        else if (this.type == 1) {
            this.reset_path();
            this.active = false;
            ui.set_play_btn_type(1);
            run_btn.setAttribute("hover_hint", "run the path simulation");
            run_btn.onclick = function () {
                sim.gen_path();
            };
        }
        grid.activate_paint();
    };
    Simulator.prototype.reset_maze = function () {
        debug.notice("maze reset");
        this.maze_alg.reset();
        grid.clear_walls();
        ui.customization_unlock();
        ui.restart_btn_lock();
        ui.skip_btn_lock();
        // this.paused = false;
        this.start_completed = false;
    };
    Simulator.prototype.reset_path = function () {
    };
    Simulator.prototype.driver = function (route, position) {
        var _a;
        if (route === undefined)
            return;
        position++;
        (_a = document.querySelector("td.ent")) === null || _a === void 0 ? void 0 : _a.classList.remove("ent");
        ;
        route[position].classList.add("ent");
        for (var i = 0; i < position; i++) {
            route[i].classList.add("traveled");
        }
        if (position < route.length - 1) {
            setTimeout(function (s, route, position) {
                s.driver(route, position);
            }, this.get_delay(), this, route, position);
        }
    };
    return Simulator;
}());
var sim = new Simulator();
var m = new WeightedRandomizedPrim(grid);
sim.set_algorithm(m);
function set_step_name(n) {
    debug.log(n);
}
// tester
grid.update_coords();
function copy(arr) {
    var new_arr = [];
    for (var i = 0; i < arr.length; i++) {
        new_arr.push(arr[i]);
    }
    return new_arr;
}
function start() {
    iterations = 0;
    grid.run = true;
    grid.cleared = false;
    var route = [];
    // console.log("routing");
    if (algorithm === 0) {
        route = path_recursive(route, grid.start_x, grid.start_y);
    }
    else if (algorithm === 1) {
        var alg = new djikstra(grid);
        route = alg.explore();
    }
    // console.log("traveling");
    driver(route, 0);
    grid.run = false;
}
var path_algorithms = [
    {
        name: "djikstra's algorithm",
        alg: function () {
            return new Djikstra(grid);
        }
    }
];
var maze_algorithms = [
    {
        name: "chaotic randomized prim's algorithm",
        alg: function () {
            return new ChaoticRandomizedPrim(grid);
        }
    },
    {
        name: "weighted randomized prim's algorithm",
        alg: function () {
            return new WeightedRandomizedPrim(grid);
        }
    }
];
function set_maze_alg(alg) {
    maze_input.firstChild.nodeValue = maze_algorithms[alg].name;
    maze_input.setAttribute("hover_hint", maze_algorithms[alg].name);
    sim.set_maze_alg(maze_algorithms[alg].alg);
    debug.log("set maze generation algorithm to " + maze_algorithms[alg].name);
}
function set_path_alg(alg) {
    maze_input.firstChild.nodeValue = path_algorithms[alg].name;
    path_input === null || path_input === void 0 ? void 0 : path_input.setAttribute("hover_hint", path_algorithms[alg].name);
    sim.set_path_alg(path_algorithms[alg].alg);
    debug.log("set pathing algorithm to " + path_algorithms[alg].name);
}
set_path_alg(0);
set_maze_alg(0);
