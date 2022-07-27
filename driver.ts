// export {};

// declare global {
//     interface Window { iterations: any; algorithm: number;}
// }

// defaults
var timing:number = 250;
var iterations:number = 0;
var algorithm:number = 1;
    // 0 = rec
    // 1 = dji
    // 2 = ast

// globals
var maze_input = document.querySelector("#maze_controls > .controls > .selector") as HTMLElement | null;
var path_input = document.querySelector("#alg_controls > .controls > .selector") as HTMLElement | null;

// driver code
// @params {array} path to finish from start
function driver(route: any[] | undefined, position: any) {
    if(route === undefined) return;
    position++;
    document.querySelector("td.ent")?.classList.remove("ent");;
    route[position].classList.add("ent");
    for(var i = 0; i < position; i++) {
        route[i].classList.add("traveled");
    }
    if(position < route.length - 1) {
        setTimeout(function() {
            driver(route, position);
        }, timing);
    }
}  



// pathing algorithms

// recursive algorithm
var abs_min:number = -1;
// var min_p:number = MAX_VALUE;

function path_recursive(route:any[], c_x:any, c_y:any) {
    abs_min = Math.abs(grid.finish_x - grid.start_x) + Math.abs(grid.finish_y - grid.start_y);
    return path_recursive_impl(route, c_x, c_y);
}
// @returns {array} route of cells to finish
function path_recursive_impl(route:any[], c_x:any, c_y:any): any[] | undefined {
    iterations++;
    if(grid.at(c_x, c_y) === undefined) return undefined; 
    let cell = grid.at(c_x, c_y);
    var path: HTMLTableCellElement[] = copy(route);
    if(cell.matches("td.finish")) {
        path.push(grid.at(c_x, c_y));
        return path;
    }
    if(route.indexOf(cell) !== -1) return undefined;
    if(cell.matches("td.wall")) return undefined;
    cell.classList.add("visited");
    path.push(cell);

    var up = path_recursive_impl(path, c_x, c_y - 1);
    var down = path_recursive_impl(path, c_x, c_y + 1);
    var left = path_recursive_impl(path, c_x - 1, c_y);
    var right = path_recursive_impl(path, c_x + 1, c_y);
    var paths: HTMLTableCellElement[][] = [];
    if(up != undefined) paths.push(up);
    if(down != undefined) paths.push(down);
    if(left != undefined) paths.push(left);
    if(right != undefined) paths.push(right);
    if(paths.length == 0) {
        return undefined;
    } else {
        let min_path = paths[0];
        for(var i = 1; i < paths.length; i++) {
            if(paths[i].length < min_path.length) {
                min_path = paths[i];
            }
        }
        return min_path;
    }


}

// djikstra's algorithm

class djikstra {
    constructor(grid:any) {
        this.grid = grid;
    }

    explore_adjacent(cell:any) {

    }

    explore() {
        this.searching.push(this.grid.get_start());
        this.grid.get_start().classList.add("exploring");
        this.state = 1;
        this.grid.run = true;
        this.grid.cleared = false;
        let r = this.explore_impl();
        return r;
    }

    explore_impl(): any[] {
        if(this.state === 1) {
            // if(this.index <= this.searching.length - 1) {
            if(this.searching[this.index] == this.grid.get_finish()) {
                this.finish_found == true;
                this.searching[this.index].iteration = this.iteration;
                this.routing_cell = this.grid.get_finish();
                this.state = 2;
                this.index++;
                return this.explore_impl();
            } else if(this.index === this.searching.length - 1) {
                this.searching[this.index].classList.remove("exploring");
                this.searching[this.index].classList.add("closed");
                let x = this.searching[this.index].x, y = this.searching[this.index].y;
                let up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
                let left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);

                if(up != undefined && !up.classList.contains("wall") && !up.classList.contains("closed")) {
                    up.classList.add("exploring");
                }
                if(down != undefined && !down.classList.contains("wall") && !down.classList.contains("closed")) {
                    down.classList.add("exploring");
                }
                if(left != undefined && !left.classList.contains("wall") && !left.classList.contains("closed")) {
                    left.classList.add("exploring");
                }
                if(right != undefined && !right.classList.contains("wall") && !right.classList.contains("closed")) {
                    right.classList.add("exploring");
                }
                this.searching[this.index].iteration = this.iteration;
                this.iteration++;
                this.index = 0;
                this.searching = Array.prototype.slice.call(document.querySelectorAll("td.exploring"));
                return this.explore_impl();
            } else {
                let x = this.searching[this.index].x, y = this.searching[this.index].y;
                let up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
                let left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);

                if(up != undefined && !up.classList.contains("wall") && !up.classList.contains("closed")) {
                    up.classList.add("exploring");
                }
                if(down != undefined && !down.classList.contains("wall") && !down.classList.contains("closed")) {
                    down.classList.add("exploring");
                }
                if(left != undefined && !left.classList.contains("wall") && !left.classList.contains("closed")) {
                    left.classList.add("exploring");
                }
                if(right != undefined && !right.classList.contains("wall") && !right.classList.contains("closed")) {
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
        } else if(this.state === 2) {
            let x = this.routing_cell.x, y = this.routing_cell.y;
            let up = this.grid.at(x, y - 1), down = this.grid.at(x, y + 1);
            let left = this.grid.at(x - 1, y), right = this.grid.at(x + 1, y);
            if(this.routing_cell === this.grid.get_start()) {
                this.route.push(this.routing_cell);
                this.route = this.route.reverse();
                this.route.push(this.grid.get_finish());
                return this.route;
            }
            if(up.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = up;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if(down.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = down;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if(left.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = left;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
            if(right.iteration === this.routing_cell.iteration - 1) {
                this.routing_cell = right;
                this.route.push(this.routing_cell);
                return this.explore_impl();
            }
        } else if(this.state === 3) {

        } else {
            this.grid.run = false;
        }
        return this.route;
    }

    grid: any;
    state: number = 0; //0=not started, 1=search, 2=generate path, 3=finished
    searching: any[] = [];
    finish_found: boolean = false;
    iteration: number = 0;
    index: number = 0;
    route: any[] = [];
    routing_cell: any;
}

class Simulator {
    constructor() {
        this.set_delay(150);
    }
    run():void {
        if(this.start_completed === false) {
            debug.notice("Controls for updating the grid and modifying other variables are locked until the simulation is paused.");
            grid.lock();
            this.start_completed = true;
        }
        if(!this.paused) {
            if(this.type === 1) {
                try {
                    this.path_alg.step();
                    if(this.path_alg.complete) {
                        this.active = false;
                        ui.pause();
                    }
                } catch(e) {
                    this.pause();
                    debug.alert("An error occured with the simulator. You can make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>" + ". Please provide specific details on the program's configuration to help me discern the origin of this error. <a style='color:orange;display:contents'> Error message: " + e + "</a>");
                    this.reset();
                }
                if(!this.path_alg.complete) {
                    setTimeout((s:Simulator) => {
                        s.run();
                    }, this.get_delay(), this);
                } else {
                    debug.log("fart test");
                    this.driver(this.path_alg.route, 0);
                }
            } else if(this.type === 0) {
                try {
                    this.maze_alg.step();
                    if(this.maze_alg.complete) {
                        this.active = false;
                        ui.pause();
                        ui.design_unlock();
                    }
                } catch(e) {
                    this.pause();
                    debug.alert("An error occured with the simulator. You can make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>" + ". <a style='color:orange;display:contents'> Error message: " + e + "</a>");
                    this.reset();
                }
                if(!this.maze_alg.complete) {
                    setTimeout((s:Simulator) => {
                            s.run();
                    }, this.get_delay(), this);
                } else {
                    this.start_completed = false;
                }
            }
        }
    }
    
    pause():void {
        ui.restart_btn_unlock();
        ui.skip_btn_unlock();
        ui.pause();
        if(this.type === 0) {
            ui.set_play_btn_type(0);
        } else if(this.type === 1) {
            ui.set_play_btn_type(0);
        }
        this.paused = true;
    }
    play():void {
        ui.restart_btn_lock();
        ui.skip_btn_lock();
        ui.play();
        ui.customization_lock();
        this.paused = false;
        this.run();
    }
    pausePlay():void {
        if(this.active) {
            if(this.paused) {
                this.play();
            } else {
                this.pause();
            }
        } else {
            debug.notice("To begin running the simulation, please select either the maze generator or path simulator buttons.");
        }
    }

    gen_maze():void {
        if(!this.active) {
            this.active = true;
            run_btn.onclick = function() {
                sim.pausePlay();
            }
            this.play();
            ui.customization_lock();
            ui.restart_btn_lock();
            ui.skip_btn_lock();
            this.type = 0;
            grid.deactivate_paint();
            grid.remove_start_finish();
            this.run();
        }
    }
    
    gen_path():void {
        if(!this.active) {
            this.active = true;
            run_btn.onclick = function() {
                sim.pausePlay();
            }
            this.play();
            ui.customization_lock();
            ui.restart_btn_lock();
            debug.log("generating a path!");
            this.type = 1;
            this.run();
        }
    }

    set_delay(delay:number):void {
        if(delay < 5) {
            debug.alert("Delay must be 5ms or higher.");
        } else if(delay >= 10000) {
            debug.notice("Did you mean to set a delay of 10 seconds or longer? I mean, if it's really what you want, I'm perfectly fine with it. It's just, y'know, kinda weird? I get it, maybe you're just trying to mess around. Or maybe it's a typo. But, y'know, still kinda weird. There's a reason I decided to write this long and drawn-out warning message, and I've forgotten it."); 
        } else { 
            this.d = delay;
        }
    }
    get_delay():number {
        return this.d;
    }
    set_algorithm(algorithm:any) {
        this.alg = algorithm;
        this.alg.reset();
    }
    set_path_alg(algorithm:any) {
        this.path_alg = algorithm();
        this.path_alg.reset();
    }
    set_maze_alg(algorithm:any) {
        this.maze_alg = algorithm();
        this.maze_alg.reset();
    }
    reset() {
        if(this.type == 0) {
            this.reset_maze();
            this.active = false;
            ui.set_play_btn_type(2);
            run_btn.setAttribute("hover_hint", "generate a maze");
            run_btn.onclick = function() {
                sim.gen_maze();
            }
        } else if(this.type == 1) {
            this.reset_path();
            this.active = false;
            ui.set_play_btn_type(1);
            run_btn.setAttribute("hover_hint", "run the path simulation");
            run_btn.onclick = function() {
                sim.gen_path();
            }
        }
        grid.activate_paint();
    }
    reset_maze() {
        debug.notice("maze reset");
        this.maze_alg.reset();
        grid.clear_walls();
        ui.customization_unlock();
        ui.restart_btn_lock();
        ui.skip_btn_lock();
        // this.paused = false;
        this.start_completed = false;
    }
    reset_path() {

    }

    driver(route: any[] | undefined, position: number) {
        if(route === undefined) return;
        position++;
        document.querySelector("td.ent")?.classList.remove("ent");;
        route[position].classList.add("ent");
        for(var i = 0; i < position; i++) {
            route[i].classList.add("traveled");
        }
        if(position < route.length - 1) {
            setTimeout(function(s:Simulator, route:any[], position:number) {
                s.driver(route, position);
            }, this.get_delay(), this, route, position);
        }
    }  

    sim_controls_locked = false;


    // 0 = maze, 1 = path
    type:number = 0;
    start_completed = false;
    d:number = 0;
    alg:any;
    maze_alg:any;
    path_alg:any;
    paused:boolean = false;
    active:boolean = false;
}

var sim = new Simulator();
var m = new WeightedRandomizedPrim(grid);
sim.set_algorithm(m);
    
function set_step_name(n:string) {
    debug.log(n);
}

// tester
grid.update_coords();

function copy(arr:any[]) {
    let new_arr:any[] = [];
    for(var i = 0; i < arr.length; i++) {
        new_arr.push(arr[i]);
    }
    return new_arr;
}

function start() {
    iterations = 0;
    grid.run = true;
    grid.cleared = false;
    let route:any[] | undefined = [];
    // console.log("routing");
    if(algorithm === 0) {
        route = path_recursive(route, grid.start_x, grid.start_y);
    } else if(algorithm === 1) {
        let alg = new djikstra(grid);
        route = alg.explore();
    }
    // console.log("traveling");
    driver(route, 0);
    grid.run = false;
}

// button configurations

// primary function configurations

type StepAlgorithm = {
    name:string,
    alg: () => any
}
var path_algorithms:StepAlgorithm[] = [
    {
        name: "djikstra's algorithm",
        alg: () => {
            return new Djikstra(grid);
        }
    }
]
var maze_algorithms:StepAlgorithm[] = [
    {
        name: "chaotic randomized prim's algorithm",
        alg: () => {
            return new ChaoticRandomizedPrim(grid);
        }
    },
    {
        name: "weighted randomized prim's algorithm",
        alg: () => {
            return new WeightedRandomizedPrim(grid);
        }
    }
]
function set_maze_alg(alg:number):void {
    maze_input!.firstChild!.nodeValue = maze_algorithms[alg].name;
    maze_input!.setAttribute("hover_hint",maze_algorithms[alg].name);
    sim.set_maze_alg(maze_algorithms[alg].alg);
    debug.log("set maze generation algorithm to " + maze_algorithms[alg].name);
}

function set_path_alg(alg:number):void {
    maze_input!.firstChild!.nodeValue = path_algorithms[alg].name;
    path_input?.setAttribute("hover_hint",path_algorithms[alg].name);
    sim.set_path_alg(path_algorithms[alg].alg);
    debug.log("set pathing algorithm to " + path_algorithms[alg].name);
}

set_path_alg(0);
set_maze_alg(0);
