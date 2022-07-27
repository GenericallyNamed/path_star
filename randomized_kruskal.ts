class RandomizedKruskal {
    constructor(grid:any) {
        this.grid = grid;
    }

    step() {
        
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