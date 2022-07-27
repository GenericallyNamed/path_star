interface Cell extends HTMLTableCellElement {
    x?:number,
    y?:number
}

var ui:any;

class Grid {
    constructor(width:number, height:number, grid:any) {
        this.width = width;
        this.height = height;
        this.grid_object = grid;
        this.grid_object.grid = this;
        this.init();
        this.grid_object.style.display = "";
        document.querySelector(".floating")?.classList.add("hidden");
        this.grid_object.addEventListener("mouseover", function(e:MouseEvent) {
            var grid:any = e.currentTarget!;
            grid = grid.grid;
            let el:any = e!.target!;
            grid.move_floating_element(el.x,el.y);
            if(grid.moving_elem) {
            } else {
                if(e.buttons == 1) {
                    grid.click(el.x, el.y);
                    // if(!grid.moving_elem && grid.painting) grid.toggle_wall(el.x, el.y);
                }
            }
        });
        this.grid_object.addEventListener("mousedown", function(e:MouseEvent) {
            var grid:any = e.currentTarget!;
            grid = grid.grid;
            let el:any = e!.target!;
            grid.click(el.x, el.y);
        });
    }

    init() {
        this.clear();
        for(var i = 0; i < this.height; i++) {
            let row = document.createElement("tr");
            for(var j = 0; j < this.width; j++) {
                let cell:any = document.createElement("td");
                cell.default_color = this.color_random();
                cell.style.backgroundColor = cell.default_color;
                row.appendChild(cell);
            }
            this.grid_object.appendChild(row);
        }
        
    }
    
    clear() {
        this.grid_object.innerHTML = "";
    }

    add_row() {
        let row = document.createElement("tr");
        for(var j = 0; j < this.width; j++) {
            let cell:any = document.createElement("td");
            cell.default_color = this.color_random();
            cell.style.backgroundColor = cell.default_color;
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
            row.appendChild(cell);
            cell.x = j;
            if((typeof cell.x) == 'string') {
                console.log("bruh string cell!");
            }
            cell.y = this.height;
        }
        this.grid_object.appendChild(row);
        this.height = this.grid_object.rows.length;
    }

    remove_row() {
        if(this.height > this.min_dim) {
            if(this.start_y == this.height - 1) {
                this.set_start(this.start_x, this.start_y - 1);
            }
            if(this.finish_y == this.height -1) {
                this.set_finish(this.finish_x, this.finish_y - 1);
            }
            this.grid_object.lastChild.remove();
            this.height = this.grid_object.rows.length;
        }
    }

    add_column() {
        for(var i = 0; i < this.height; i++) {
            let cell:any = document.createElement("td");
            cell.default_color = this.color_random();
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
            // cell.style.backgroundColor = cell.default_color;
            cell.addEventListener("click", function(e:any) {
                mod(e.target);
            });
            this.grid_object.rows[i].appendChild(cell);
            cell.x = this.width;
            if((typeof cell.x) == 'string') {
                console.log("string cell!");
            }
            cell.y = i;
        }
        this.width = this.grid_object.rows[0].cells.length;
    }

    remove_column() {
        if(this.width > this.min_dim) {
            if(this.start_x == this.width - 1) {
                this.set_start(this.start_x - 1, this.start_y);
            }
            if(this.finish_x == this.width - 1) {
                this.set_finish(this.width - 2, this.finish_y);
            }
            for(var i = 0; i < this.height; i++) {
                this.grid_object.rows[i].lastChild.remove();
            }
            this.width = this.grid_object.rows[0].cells.length;
        }
    }

    set_rows(rows:number) {
        while(this.set_height != this.height) {
            if(this.set_height > this.height) {
                    this.add_row();
                
            } else {
                    this.remove_row();
            }
        }
    }
    
    set_columns(columns:number) {
        while(this.set_width != this.width) {
            if(this.set_width > this.width) {
                this.add_column();
            } else {
                this.remove_column();
            }
        }
    }
    
    set_start(x:number, y:number) { 
        this.start_x = x;
        this.start_y = y;
        let old = this.grid_object.querySelector(".start");
        old?.classList.remove("start");
        this.grid_object.rows[y].cells[x].classList.add("start");
        remove_warn(set_start_btn);
    }
    set_finish(x:number, y:number) {
        this.finish_x = x;
        this.finish_y = y;
        let old = this.grid_object.querySelector(".finish");
        old?.classList.remove("finish");
        this.grid_object.rows[y].cells[x].classList.add("finish");
        remove_warn(set_finish_btn);
    }

    add_wall(x:number, y:number):void {
        this.at(x, y).classList.add("wall");
    }
    toggle_wall(x:number, y:number):void {
        if(!grid.is_finish(x,y) && !grid.is_start(x,y)) {
            grid.at(x,y).classList.toggle("wall");
        }
    }

    remove_wall(x:number, y:number):void {
        this.at(x, y).classList.remove("wall");
    }
    fill_walls():void {
        debug.log("filling walls: @" + console.trace());
        for(var i = 0; i < this.height; i++) {
            for(var j = 0; j < this.width; j++) {
                this.add_wall(j, i);
            }
        }
    }
    clear_walls() {
        for(var i:number = 0; i < this.height; i++) {
            for(var j:number = 0; j < this.width; j++) {
                this.remove_wall(j, i);
            }
        }
    }
    
    color_random() {
        return "";
    }

    at(x:number, y:number) {
        if(x < 0 || y < 0 || y >= this.height || x >= this.width) {
            return undefined
        }
        return this.grid_object.rows[y].cells[x];
    }

    /*
    @returns whether the two cells are adjacent
    */
    adjacent(a:any, b:any) {
        if(a.x != b.x && a.y != b.y) {
            return false;
        } else if(Math.abs(b.x - a.x) == 1 && b.y == a.y) {
            return true;
        } else if(Math.abs(b.y - a.y) == 1 && b.x == a.x) {
            return true;
        } return false;
    }

    update_coords() {
        for(var i = 0; i < this.height; i++) {
            for (var j = 0; j < this.width; j++) {
                this.grid_object.rows[i].cells[j].x = j;
                this.grid_object.rows[i].cells[j].y = i;
            }
        }
    }
    clear_all() {

    }
    reset() {
        if(!this.run) {
            for(var i = 0; i < this.height; i++) {
                for(var j = 0; j < this.width; j++) {
                    let cell = this.grid_object.rows[i].cells[j];
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
    }

    click(x:number, y:number):void {
        if(this.moving_elem) {
            if(this.moving_elem_type === 0) {
                if(!this.is_finish(x,y) && !this.is_wall(x,y)) {
                    this.complete_move(x,y);
                }
            } else if(this.moving_elem_type === 1) {
                if(!this.is_start(x,y) && !this.is_wall(x,y)) {
                    this.complete_move(x,y);
                }

            }
        } else if(this.is_start(x, y)) {
            if(!this.moving_elem) { this.start_move(0); }
        } else if(this.is_finish(x, y)) {
            if(!this.moving_elem) { this.start_move(1); }
        } else if(this.painting) {
            this.toggle_wall(x, y);
        }
    }
    is_start(x:number, y:number):boolean {
        return (grid.at(x,y).classList.contains("start")) ? true : false;
    }
    is_finish(x:number, y:number):boolean {
        return (grid.at(x,y).classList.contains("finish")) ? true : false;
    }
    is_wall(x:number, y:number):boolean {
        return (grid.at(x,y).classList.contains("wall")) ? true : false;
    }
    get_start() {
        if(this.grid_object.querySelector("td.start") == null) {
            return undefined;
        }
        return this.grid_object.querySelector("td.start");
    }
    get_finish() {
        if(this.grid_object.querySelector("td.finish") == null) {
            return undefined;
        }
        return this.grid_object.querySelector("td.finish");
    }

    // finish and start movement functionality
    multiplier:number = 1.7;
    create_floating_element():void {
        var el = document.createElement("div");
        el.classList.add("floating");
        el.classList.add("hidden");
        el.style.transform = "scale(1)";
        if(this.moving_elem_type == 0) {
            el.classList.add("floating_start");
        } else if(this.moving_elem_type == 1) {
            el.classList.add("floating_finish");
        }
        el.style.width = (this.at(0,0).offsetWidth * this.multiplier) + "px";
        el.style.height = (this.at(0,0).offsetHeight * this.multiplier) + "px";
        el.style.position = "absolute";
        el.style.top = "0px";
        el.style.left = "0px";
        el.style.zIndex = "1001";
        document.body.appendChild(el);
        this.floating_elem = el;
    }
    move_floating_element(x:number, y:number):void {
        let _x:number = grid.at(x,y).offsetLeft + grid.grid_object.offsetLeft,
            _y:number = grid.at(x,y).offsetTop + grid.grid_object.offsetTop;
        this.floating_elem.style.top = _y - (this.at(0,0).offsetHeight * ((this.multiplier - 1) * 0.5)) + "px";
        this.floating_elem.style.left = _x - (this.at(0,0).offsetWidth * ((this.multiplier - 1) * 0.5)) + "px";
    }
    start_move(type:number):void {
        console.log("start move");
        if(!this.moving_elem) {
            this.deactivate_paint();
            this.floating_elem.classList.remove("hidden");
            this.moving_elem = true;
            this.moving_elem_type = type;
            this.floating_elem.style.transform = "scale(1)";
            if(type == 0) { 
                this.move_start_btn.classList.add("activated");
                this.remove_start(); 
                this.floating_elem.classList.add("floating_start"); 
                this.floating_elem.classList.remove("floating_finish");
            }
            else if(type == 1) { 
                this.move_finish_btn.classList.add("activated");
                this.remove_finish(); 
                this.floating_elem.classList.add("floating_finish"); 
                this.floating_elem.classList.remove("floating_start");
            }
        }
    }
    complete_move(x:number, y:number):void {
        console.log("complete move");
        if(this.moving_elem_type === 0) {
            if(!this.is_finish(x,y) && !this.is_wall(x,y)) {
                this.set_start(x,y);
                this.moving_elem = false;
                this.floating_elem.style.transform = "scale(" + (1 / this.multiplier) + ")";
                this.floating_elem.classList.add("hidden");
                this.move_start_btn.classList.remove("activated");
                this.activate_paint();
            }
        } else if(this.moving_elem_type === 1) {
            if(!this.is_start(x,y) && !this.is_wall(x,y)) {
                this.set_finish(x,y);
                this.moving_elem = false;
                this.floating_elem.style.transform = "scale(" + (1 / this.multiplier) + ")";
                this.floating_elem.classList.add("hidden");
                this.move_finish_btn.classList.remove("activated");
                this.activate_paint();
            }
        }
    }
    cancel_move():void {

    }

    activate_paint():void {
        if(!this.locked && !this.moving_elem) {
            this.painting = true;
            this.paint_btn.classList.add("activated");
        }
    }
    deactivate_paint():void {
        this.painting = false;
        this.paint_btn.classList.remove("activated");
    }
    toggle_paint():void {
        if(this.painting) {
            this.deactivate_paint();
        } else {
            this.activate_paint();
        }
    }

    // primary configuration
    paint_btn: any = document.querySelector("#add_wall_btn");
    move_start_btn: any = document.querySelector("#add_start_btn");
    move_finish_btn: any = document.querySelector("#add_finish_btn");
    set_height: number = -1;
    set_width: number = -1;
    height: number;
    width:number;
    grid_object:any;
    start_x:number = -1;
    start_y:number = -1;
    finish_x:number = -1;
    finish_y:number = -1;

    min_dim:number = 4;
    max_dim:number = 100;

    // grid status
    painting:boolean = true; //reports whether the paint tool is activated
    cleared:boolean = true; //reports whether the grid is cleared
    run:boolean = false; //reports wether the grid is being used to prevent disruption
    revealed:boolean = false; //based on initial status of grid when first start
    locked:boolean = false;
    lock():void {
        this.grid_object.classList.add("unclickable");
        this.locked = true;
    }
    unlock():void {
        this.grid_object.classList.remove("unclickable");
        this.locked = false;
    }

    is_moving():boolean { return this.moving_elem; }
    moving_elem:boolean = false;
    moving_elem_type:number = 0; //0 = start, 1 = finish
    floating_elem:any;

    remove_start() {
        if(this.get_start() !== undefined) {
            this.get_start().classList.remove("start");
        }
        this.start_x = -1;
        this.start_y = -1;
        add_warn(set_start_btn);
    }
    remove_finish() {
        if(this.get_finish() !== undefined) {
            this.get_finish().classList.remove("finish");
        }
        this.finish_x = -1;
        this.finish_y = -1;
        add_warn(set_finish_btn);
    }
    remove_start_finish() {
        debug.notice("Both the start and finish nodes have been cleared from the grid. They can be re-added by using the buttons below once the maze has been cleared or finished generating.");
        this.remove_start();
        this.remove_finish();
    }

    has_start:boolean = true;
    has_finish:boolean = true;
}

// grid modifier

function mod(object:any) {
    if(object.matches("td.finish") || object.matches("td.start")) {
        return;
    }   else {
        object.classList.toggle("wall");
    }
}

// special effects
var wave_count = -1;

function wave(grid:any) {
    console.log("wave!");
    // wave_count = grid.height * 2 - 1;
    wave_impl([grid.at(0,0)], grid);
}

function wave_impl(cells:any[], grid:any) {
    console.log("wave_impl");
    let cells_new:any[] = [];
    for(var i = 0; i < cells.length; i++) {
        let cell = cells[i];
        grid.at(cell.x, cell.y + 1) !== undefined ? cells_new.push(grid.at(cell.x, cell.y + 1)) : undefined;
        grid.at(cell.x + 1, cell.y) !== undefined ? cells_new.push(grid.at(cell.x + 1, cell.y)) : undefined;
        cell.style.backgroundColor = "white";
        cell.style.transform = "scale(1.3)";
        cell.style.boxShadow = "0px 0px 50px 4px white";
        setTimeout((cell:any) => {
            cell.style.backgroundColor = cell.default_color;
            cell.style.transform = "scale(1)";
            cell.style.boxShadow = "0px 0px 75px 0px rgba(255,255,255,0.05)";
        }, 350, cell)

    }
    if(cells_new.length === 0) {
        // wave_end(grid);
        return;
    } else {
        for(var i = 0; i < cells_new.length; i++) {
        }
        setTimeout((cells_new:any, grid:any) => {
            wave_impl(cells_new, grid);
        }, 100, cells_new, grid);
        // wave_impl(cells_new);
    }
}

function wave_end(grid:any) {
    for(var i = 0; i < grid.height; i++) {
        for(var j = 0; j < grid.width; j++) {
            grid.at(i, j).classList.remove('wave');
        }
    }
}