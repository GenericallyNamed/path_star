class ChaoticRandomizedPrim {
    constructor(grid:any) {
        this.grid = grid;  
        this.init();
    }

    init():void {
        this.walls = [];
        this.v = [];
        for(var i = 0; i < this.grid.height; i++) {
            let a:number[] = [];
            for(var j = 0; j < this.grid.width; j++) {
                a.push(-1);
            }
            this.v.push(a);
        }
    }

    step() {
        this.set_step(this.s);
        if(this.s===0) {
            this.grid.fill_walls();
            this.grid.clear_all();
            this.s = 1;
        } else if(this.s===1) {
            let x:number = Math.floor(Math.random() * this.grid.width),
                y:number = Math.floor(Math.random() * this.grid.height);
            this.add_path(x,y);
            this.add_walls(this.get_wall_dn(x,y));
            this.s = 2;
        } else if(this.s===2) {
            if(this.walls.length===0) { this.s = 99; return; }
            let i:number = Math.floor(Math.random() * this.walls.length),
                x:number = this.walls[i].x,
                y:number = this.walls[i].y,
                n:any[] = this.get_path_dn(x,y),
                c:boolean = this.conflict(x,y);
            if(n.length === 1 && !c) {
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
            r.push(this.grid.at(x,y+1));
        }
        if(this.grid.at(x,y-1) != undefined && !this.grid.at(x,y-1).classList.contains("wall")) {
            r.push(this.grid.at(x,y-1));
        }
        if(this.grid.at(x+1,y) != undefined && !this.grid.at(x+1,y).classList.contains("wall")) {
            r.push(this.grid.at(x+1,y));
        }
        if(this.grid.at(x-1,y) != undefined && !this.grid.at(x-1,y).classList.contains("wall")) {
            r.push(this.grid.at(x-1,y));
        }
        return r;
    }
    get_wall_dn(x:number, y:number):any[] {
        let r:any[] = [];
        if(this.grid.at(x,y+1) != undefined) {
            this.set_value(x,y+1,3);
            if(!this.conflict(x,y+1)) {
                r.push(this.grid.at(x,y+1));
            }
        }
        if(this.grid.at(x,y-1) != undefined) {
            this.set_value(x,y-1,2);
            if(!this.conflict(x,y-1)) {
                r.push(this.grid.at(x,y-1));
            }
        }
        if(this.grid.at(x+1,y) != undefined) {
            this.set_value(x+1,y,1);
            if(!this.conflict(x+1,y)) {
                r.push(this.grid.at(x+1,y));
            }
        }
        if(this.grid.at(x-1,y) != undefined) {
            this.set_value(x-1,y,0);
            if(!this.conflict(x-1,y)) {
                r.push(this.grid.at(x-1,y));
            }
        }
        return r;
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
        // this.grid.at(x, y).style.background = "red";
    }
    reset_marked_cell():void {
        let prev_c:any = document.querySelector("td.marked");
        if(prev_c !== null && prev_c !== undefined) {
            prev_c!.classList.remove("marked");
            prev_c!.style.background = prev_c.default_color;
        }
    }
    reset():void {
        for(var i = 0; i < this.walls.length; i++) {
            this.walls[i].classList.remove("frontier");
        }
        document.querySelector("td.marked")?.classList.remove("marked");
        this.init();
        this.s = 0;
        this.it = 0;
        this.complete = false;
    }



    // proprietary data store
    walls:any[] = [];
    v:number[][] = [];
    get_value(x:number,y:number):number {
        return this.v[y][x];
    }
    set_value(x:number,y:number,v:number) {
        this.v[y][x] = v;
    }
    

    s_names:any = {
        0:"setting up grid",
        1:"choosing first path cell and initializing walls organization",
        2:"pathing",
        3:"completed"
    }
    // universal data
    set_step(s:number) {
        set_step_name(this.s_names[s]);
    }
    complete:boolean = false;
    s:number = 0;  //tracks current step in algorithm
    s_name:string = "";
    it:number = 0; //tracks total iterations of steps 
    grid:any;
}