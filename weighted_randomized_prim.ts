class WeightedRandomizedPrim {
    constructor(grid:any) {
        this.grid = grid;
    }

    step() {
        if(this.s !== 3) this.set_step(this.s);
        if(this.s===0) {
            this.grid.fill_walls();
            this.grid.clear_all();
            this.v = [];
            this.w = [];
            for(var i = 0; i < this.grid.height; i++) {
                let a:number[] = [];
                for(var j = 0; j < this.grid.width; j++) {
                    a.push(-1);
                }
                this.v.push(a);
            }
            for(var i = 0; i < this.grid.height; i++) {
                let a:number[] = [];
                for(var j = 0; j < this.grid.width; j++) {
                    a.push(-1);
                }
                this.w.push(a);
            }
            this.s = 1;
        } else if(this.s===1) {
            let x:number = Math.floor(Math.random() * this.grid.width),
                y:number = Math.floor(Math.random() * this.grid.height);
            this.d_x = (x % 2 === 0) ? 0 : 1;
            this.d_y = (y % 2 === 0) ? 0 : 1;
            this.add_path(x,y);
            this.w[y][x] = 1;
            this.add_walls(this.get_wall_dn(x,y));
            this.s = 2;
        } else if(this.s===2) {
            var x:number = document.querySelector<any>("td.marked").x,
                y:number = document.querySelector<any>("td.marked").y;
            // for(var i = 0; i < this.grid.height; i++) {
            //     let a:number[] = [];
            //     for(var j = 0; j < this.grid.width; j++) {
            //         a.push(Math.floor(Math.sqrt(Math.abs(Math.pow(y - i, 2)) + Math.abs(Math.pow(x - j, 2)))))
            //     }
            //     this.w.push(a);
            // }
            this.s = 3;
        } else if(this.s===3) {
            if(this.walls.length===0) { this.s = 99; return; }
            let i:number = this.weighted_random(),
                x:number = this.walls[i].x,
                y:number = this.walls[i].y,
                n:any[] = this.get_path_dn(x,y),
                c:boolean = this.conflict(x,y);
            if(n.length === 1 && !c) {
                debug.log("creating path at new location");
                this.add_path(x,y);
                let new_walls:any[] = this.get_wall_dn(x,y);
                this.add_walls(new_walls);
            }
            this.remove_wall(i);
        } else if(this.s===99) {
            this.reset_marked_cell();
            this.complete = true;
        }
    }



    // logic functions
        // note: 0 = left, 1 = right, 2 = up, 3 = down
    get_path_dn(x:number, y:number):any[] {
        let r:any[] = [];
        if(this.grid.at(x,y+1) != undefined && !this.grid.at(x,y+1).classList.contains("wall")) {
            this.w[y+1][x] = this.w[y][x] + 1;
            r.push(this.grid.at(x,y+1));
        }
        if(this.grid.at(x,y-1) != undefined && !this.grid.at(x,y-1).classList.contains("wall")) {
            this.w[y-1][x] = this.w[y][x] + 1;
            r.push(this.grid.at(x,y-1));
        }
        if(this.grid.at(x+1,y) != undefined && !this.grid.at(x+1,y).classList.contains("wall")) {
            this.w[y][x+1] = this.w[y][x] + 1;
            r.push(this.grid.at(x+1,y));
        }
        if(this.grid.at(x-1,y) != undefined && !this.grid.at(x-1,y).classList.contains("wall")) {
            this.w[y][x-1] = this.w[y][x] + 1;
            r.push(this.grid.at(x-1,y));
        }
        return r;
    }
    get_wall_dn(x:number, y:number):any[] {
        let r:any[] = [];
        if(this.grid.at(x,y+1) != undefined && !this.p_restrict(x,y,3)) {
            this.w[y+1][x] = this.w[y][x] + 1;
            this.set_value(x,y+1,3);
            if(!this.conflict(x,y+1)) {
                r.push(this.grid.at(x,y+1));
            }
        }
        if(this.grid.at(x,y-1) != undefined && !this.p_restrict(x,y,2)) {
            this.w[y-1][x] = this.w[y][x] + 1;
            this.set_value(x,y-1,2);
            if(!this.conflict(x,y-1)) {
                r.push(this.grid.at(x,y-1));
            }
        }
        if(this.grid.at(x+1,y) != undefined && !this.p_restrict(x,y,1)) {
            this.w[y][x+1] = this.w[y][x] + 1;
            this.set_value(x+1,y,1);
            if(!this.conflict(x+1,y)) {
                r.push(this.grid.at(x+1,y));
            }
        }
        if(this.grid.at(x-1,y) != undefined && !this.p_restrict(x,y,0)) {
            this.w[y][x-1] = this.w[y][x] + 1;
            this.set_value(x-1,y,0);
            if(!this.conflict(x-1,y)) {
                r.push(this.grid.at(x-1,y));
            }
        }
        return r;
    }
    p_restrict(x:number,y:number,dir:number):boolean {
        if(dir===0 || dir ===1) {
            var dy = (y % 2 == 0) ? 0 : 1;
            if(this.d_y == dy) {
                return false;
            } else {
                return true;
            }
        } else if(dir===2 || dir===3) {
            var dx = (x % 2 == 0) ? 0 : 1;
            if(this.d_x == dx) {
                return false;
            } else {
                return true;
            }
        }
        return true;
    }
    conflict(x:number, y:number):boolean {
        let v = this.get_value(x,y);
        if(v === 0 && ((this.c(x-1,y+1) || this.c(x-1,y-1)))) { 
            return true;
        } else if(v === 1 && ((this.c(x+1,y+1) || this.c(x+1,y-1)))) { 
            return true;
        } else 
        if(v === 2 && ((this.c(x-1,y-1) || this.c(x+1,y-1)))) { 
            return true;
        }
        if(v === 3 && ((this.c(x-1,y+1) || this.c(x+1,y+1)))) { 
            return true;
        }
        return false;
    }
    c(x:number, y:number):boolean {
        if(this.grid.at(x,y) == undefined) {
            return false;
        } else if(!this.grid.at(x,y).classList.contains("wall") || this.grid.at(x,y).classList.contains("frontier")) {
            return true;
        }
        return false;
    }

    weighted_random():number {
        var walls_w:any[] = [];
        for(var i = 0; i < this.walls.length; i++) {
            let x = this.walls[i].x, y = this.walls[i].y;
            for(var j = 0; j < this.w[y][x] + 1; j++) {
                walls_w.push(this.walls[i]);
            }
        }
        let index:number = Math.floor(Math.random() * walls_w.length);
        return this.walls.indexOf(walls_w[index]);
    }

    // primary functions
    add_walls(walls:any[]) {
        for(var i = 0; i < walls.length; i++) {
            if(walls[i].classList.contains("wall")) {
                walls[i].classList.add("frontier");
                this.walls.push(walls[i]);
            }
        }
    }
    remove_wall(index:number):void {
        this.walls[index].classList.remove("frontier");
        this.walls.splice(index,1);
    }

    // styling
    add_path(x:number,y:number):void {
        this.grid.remove_wall(x,y);
        this.set_marked_cell(x,y);
    }
    set_marked_cell(x:number, y:number):void {
        let prev_c:any = document.querySelector("td.marked");
        if(prev_c !== null) {
            prev_c!.style.background = prev_c.default_color;
            prev_c!.classList.remove("marked");
        }
        this.grid.at(x, y).classList.add("marked");
        this.grid.at(x, y).style.background = "red";
    }
    reset_marked_cell():void {
        let prev_c:any = document.querySelector("td.marked");
        prev_c!.classList.remove("marked");
        prev_c!.style.background = prev_c.default_color;
    }



    // proprietary data store
    walls:any[] = [];
    v:number[][] = [];
    w:number[][] = [];
    d_x:number = -1;
    d_y:number = -1;
    get_value(x:number,y:number):number {
        return this.v[y][x];
    }
    set_value(x:number,y:number,v:number) {
        this.v[y][x] = v;
    }
    

    s_names:any = {
        0:"setting up grid",
        1:"choosing first path cell and initializing walls organization",
        2:"coordinating distance values",
        3:"algorithmic calculations",
        99:"completed"
    }
    // universal data
    set_step(s:number):void {
        set_step_name(this.s_names[s]);
    }
    reset():void {
        for(var i = 0; i < this.walls.length; i++) {
            this.walls[i].classList.remove("frontier");
        }
        document.querySelector("td.marked")?.classList.remove("marked");
        this.complete = false;
        this.s = 0;
        this.s_name = "";
        this.it = 0;
    }
    complete:boolean = false;
    s:number = 0;  //tracks current step in algorithm
    s_name:string = "";
    it:number = 0; //tracks total iterations of steps 
    grid:any;
}