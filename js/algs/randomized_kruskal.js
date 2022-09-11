"use strict";
var RandomizedKruskal = /** @class */ (function () {
    function RandomizedKruskal(grid) {
        this.s_names = {
            0: "setting up grid",
            1: "choosing first path cell and initializing walls organization",
            2: "coordinating distance values",
            3: "algorithmic calculations",
            99: "completed"
        };
        this.complete = false;
        this.s = 0; //tracks current step in algorithm
        this.s_name = "";
        this.it = 0; //tracks total iterations of steps 
        this.grid = grid;
    }
    RandomizedKruskal.prototype.step = function () {
    };
    // universal data
    RandomizedKruskal.prototype.set_step = function (s) {
        set_step_name(this.s_names[s]);
    };
    RandomizedKruskal.prototype.reset = function () {
        this.complete = false;
        this.s = 0;
        this.s_name = "";
        this.it = 0;
    };
    return RandomizedKruskal;
}());
