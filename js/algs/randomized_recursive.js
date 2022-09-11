"use strict";
var RandomizedRecursive = /** @class */ (function () {
    function RandomizedRecursive(grid) {
        this.lines = [];
        this.grid = grid;
    }
    RandomizedRecursive.prototype.gen = function () {
        this.gen_impl(0, this.grid.width - 1, 0, this.grid.height - 1, false);
    };
    RandomizedRecursive.prototype.gen_impl = function (aX, bX, aY, bY, vert) {
        if (vert) {
            // let m = Math.floor(Math.random() * (bX - aX)) + aX;
            var m_1 = Math.floor((bX - aX) * 0.5) + aX;
            var line = [];
            line = this.gen_line(m_1, aY, m_1, bY);
            this.lines.push(line);
            if ((bX - aX) > 2) {
                this.gen_impl(aX, m_1, aY, bY, false);
                this.gen_impl(m_1 + 1, bX, aY, bY, false);
            }
        }
        else {
            var m_2 = Math.floor((bY - aY) * 0.5) + aY;
            var line = [];
            line = this.gen_line(aX, m_2, bX, m_2);
            this.lines.push(line);
            if ((bY - aY) > 2) {
                this.gen_impl(aX, bX, aY, m_2, true);
                this.gen_impl(aX, bX, m_2 + 1, bY, true);
            }
        }
    };
    RandomizedRecursive.prototype.gen_line = function (aX, aY, bX, bY) {
        var line = [];
        if (aX === bX) {
            for (var i = 0; i < (bY - aY) + 1; i++) {
                line.push([aX, aY + i]);
            }
        }
        else if (aY === bY) {
            for (var i = 0; i < (bX - aX) + 1; i++) {
                line.push([aX + i, aY]);
            }
        }
        else {
            return line;
        }
        return line;
    };
    RandomizedRecursive.prototype.draw = function () {
        // for(var i = 0; i < this.lines.length; i++) {
        //     for(var j = 0; j < this.lines[i].length; j++) {
        //         this.grid.at(this.lines[i][j][0], this.lines[i][j][1]).classList.add("wall");
        //     }
        // }
        this.draw_impl(0, 0, this);
    };
    RandomizedRecursive.prototype.draw_impl = function (i, j, m) {
        var _this = this;
        console.log("draw_impl()");
        if (i < this.lines.length) {
            if (j < this.lines[i].length) {
                this.grid.at(this.lines[i][j][0], this.lines[i][j][1]).classList.add("wall");
                j++;
            }
            else {
                i++;
                j = 0;
                setTimeout(function (i, j, m) {
                    _this.draw_impl(i, j, _this);
                }, 50, i, j, this);
            }
        }
    };
    return RandomizedRecursive;
}());
;
