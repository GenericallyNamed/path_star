class RandomizedRecursive {
    constructor(grid:any) {
        this.grid = grid;
    }

    gen() {
        this.gen_impl(0, this.grid.width - 1, 0, this.grid.height - 1, false);
    }
    gen_impl(aX:number, bX:number, aY:number, bY:number, vert:boolean) {
        if(vert) {
            // let m = Math.floor(Math.random() * (bX - aX)) + aX;
            let m:number = Math.floor((bX - aX) * 0.5) + aX;
            let line:number[][] = [];
            line = this.gen_line(m, aY, m, bY);
            this.lines.push(line);
            if((bX - aX) > 2) {
                this.gen_impl(aX, m, aY, bY, false);
                this.gen_impl(m + 1, bX, aY, bY, false);
            }
        } else {
            let m:number = Math.floor((bY - aY) * 0.5) + aY;
            let line:number[][] = [];
            line = this.gen_line(aX, m, bX, m);
            this.lines.push(line);
            if((bY - aY) > 2) {
                this.gen_impl(aX, bX, aY, m, true);
                this.gen_impl(aX, bX, m + 1, bY, true);
            }
        }
    }

    gen_line(aX:number, aY:number, bX:number, bY:number):number[][] {
        let line:number[][] = [];
        if(aX === bX) {
            for(var i = 0; i < (bY - aY) + 1; i++) {
                line.push([aX, aY + i]);
            }
        } else if(aY === bY) {
            for(var i = 0; i < (bX - aX) + 1; i++) {
                line.push([aX + i, aY]);
            }
        } else {
            return line;
        }
        return line;
    }

    draw() {
        // for(var i = 0; i < this.lines.length; i++) {
        //     for(var j = 0; j < this.lines[i].length; j++) {
        //         this.grid.at(this.lines[i][j][0], this.lines[i][j][1]).classList.add("wall");
        //     }
        // }
        this.draw_impl(0, 0, this);
    }
    draw_impl(i:number, j:number, m:RandomizedRecursive) {
        console.log("draw_impl()");
        if(i < this.lines.length) {
            if(j < this.lines[i].length) {
                this.grid.at(this.lines[i][j][0], this.lines[i][j][1]).classList.add("wall");
                j++;
            } else {
                i++;
                j = 0;
                setTimeout((i:number, j:number, m:RandomizedRecursive) => {
                    this.draw_impl(i, j, this);
                }, 50, i, j, this);
            }
        }

    }


    grid:any;
    lines:number[][][] = [];
};