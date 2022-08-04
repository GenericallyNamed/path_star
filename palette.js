var Palette = /** @class */ (function () {
    function Palette(commands, defaults) {
        this.state = 0; //0 = default command search, 1 = selector
        this.suggestions = [];
        this.palette = document.querySelector("#palette");
        this.palette_in = document.querySelector("#palette > input");
        this.palette_default = this.palette.textContent;
        this.palette_hint = document.querySelector("#palette > #hint");
        this.palette_items = document.querySelector("#palette > #suggestions");
        this.defaults = [];
        this.hint = "";
        this.command_items = [];
        this.search_items = []; //list of current items considered // updates depending on what you are searching i.e. all commands or choosing items for a selector
        this.displayed_items = [];
        this.override = false;
        // opened():boolean {
        //     return this.palette.matches(".activated");
        // }
        // secondary functions
        this.selectorActivated = false;
        this.locked = false;
        this.opened = false;
        this.commands = commands;
        for (var i = 0; i < defaults.length; i++) {
            this.defaults.push(commands[defaults[i]]);
        }
        this.init_items(commands);
        this.s_command = commands[0];
        this.palette_in.p = this;
        this.palette_in.addEventListener("input", function (e) {
            var p = e.target;
            p.p.query_update();
        });
        this.palette_in.addEventListener("focus", function (e) {
            var p = e.target;
            p.p.open();
        });
        // this.palette_in.addEventListener("blur", function(e:Event) {
        //     let p:any = e.target;
        //     if(e.currentTarget != p.p.palette) {
        //         p.p.hide();
        //     }
        //     });
    }
    Palette.prototype.init_items = function (commands) {
        for (var i = 0; i < commands.length; i++) {
            console.log("appending new command item initialization");
            var p = new PaletteItem(commands[i].names[0], commands[i].type, commands[i].caption, commands[i]);
            this.command_items.push(p);
        }
        this.search_items = this.command_items;
    };
    Palette.prototype.activate_command = function (name) {
        var p_i = this.get_command(name);
        if (p_i != undefined) {
            this.run_command(p_i);
        }
        else {
            throw 'ReferenceError: Unkown function name';
        }
    };
    Palette.prototype.get_command = function (command_name) {
        for (var i = 0; i < this.command_items.length; i++) {
            if (this.command_items[i].getName() == command_name) {
                return this.command_items[i];
            }
        }
        return undefined;
    };
    Palette.prototype.run_command = function (p_i) {
        this.palette_in.value = "";
        if (p_i.getType() === 1) {
            console.log("run command, selectorActived = " + this.selectorActivated);
            this.selectorActivated = true;
            this.start_selector(p_i);
        }
        else if (this.selectorActivated) {
            console.log("attempting selection");
            console.log(this.search_items.indexOf(p_i));
            p_i.command.action(this.search_items.indexOf(p_i));
            console.log("palette close inside RUN_COMMAND");
            this.close();
        }
        else {
            console.log("default behavior");
            p_i.action(this);
        }
    };
    // what the item list does: show a filtered selection of items depending on the entry in the text field. the top suggestion becomes an autofill suggestion.
    // so then what do we need?
    // a function that queries the masterlist and sends back the results from the list
    // a function that sets the hint/autofill
    /**
     * Serves the basic purpose of taking query input, displaying results of input and defining behavior.
     *
     */
    Palette.prototype.query_update = function () {
        // this.search_items = this.command_items;
        var query_in = this.get_input();
        var query_out = this.query_items(query_in);
        this.display_items(query_out);
        if (query_out.length > 0) {
            this.set_hint(query_out[0].getName());
            this.set_highlighted_item(0);
        }
        else {
            this.set_hint("");
        }
    };
    Palette.prototype.query_items = function (input) {
        var r = [];
        for (var i = 0; i < this.search_items.length; i++) {
            if (this.search_items[i].getName().indexOf(input) != -1) {
                r.push(this.search_items[i]);
            }
        }
        return r;
    };
    Palette.prototype.set_highlighted_item = function (index) {
        for (var i = 0; i < this.displayed_items.length; i++) {
            this.displayed_items[i].highlighted = false;
        }
        this.displayed_items[index].highlighted = true;
        this.display_items(this.displayed_items);
        this.set_hint(this.displayed_items[index].getName());
    };
    Palette.prototype.get_highlighted_index = function () {
        for (var i = 0; i < this.displayed_items.length; i++) {
            if (this.displayed_items[i].highlighted) {
                return i;
            }
        }
        return 0;
    };
    Palette.prototype.get_display_item = function (index) {
        return this.displayed_items[index];
    };
    /**
     * These functions define display
     */
    Palette.prototype.add_item = function (item) {
        this.displayed_items.push(item);
        var elem = item.getHTML();
        elem.p_i = item;
        elem.p = this;
        this.palette_items.appendChild(elem);
        this.palette_items.lastElementChild.addEventListener("click", function (e) {
            var t = e.currentTarget;
            t.p_i.action(t.p);
        });
        // this.palette_items.appendChild(item.getHTML());
    };
    Palette.prototype.display_items = function (items) {
        this.palette_items.innerHTML = "";
        this.displayed_items = [];
        for (var i = 0; i < items.length; i++) {
            this.add_item(items[i]);
        }
    };
    Palette.prototype.clear_display_items = function () {
        this.displayed_items = [];
        this.palette_items.innerHTML = "";
    };
    // hint/auto-fill suggestion management
    Palette.prototype.set_hint = function (hint) {
        this.hint = hint;
        if (!this.opened && this.get_input().length == 0) {
            this.palette_hint.innerHTML = "<key_hint> CTRL</key_hint> + <key_hint> ALT</key_hint> + <key_hint> P</key_hint> to open the command palette";
        }
        else if (this.get_input() === this.hint) {
            this.palette_hint.innerHTML = hint;
        }
        else if (this.get_input() != hint && hint.indexOf(this.get_input()) != -1 && hint.length > 0) {
            if (hint.substring(0, this.get_input().length) == this.get_input()) {
                this.palette_hint.innerHTML = hint + " <key_hint> ↹</key_hint>";
            }
            else {
                this.palette_hint.innerHTML = "";
            }
        }
        else {
            this.palette_hint.innerHTML = "";
        }
    };
    Palette.prototype.cycle_up = function () {
        var i = this.get_highlighted_index();
        if (i === 0) {
            this.set_highlighted_item(this.displayed_items.length - 1);
        }
        else {
            this.set_highlighted_item(i - 1);
        }
    };
    Palette.prototype.cycle_down = function () {
        var i = this.get_highlighted_index();
        if (i === this.displayed_items.length - 1) {
            this.set_highlighted_item(0);
        }
        else {
            this.set_highlighted_item(i + 1);
        }
    };
    Palette.prototype.fill_suggestion = function () {
        if (this.opened) {
            this.palette_in.value = this.hint;
            this.query_update();
        }
    };
    Palette.prototype.clear = function () {
        this.palette_in.value = "";
    };
    Palette.prototype.close = function () {
        this.opened = false;
        console.log("hiding the palette");
        this.palette_in.blur();
        if (this.selectorActivated) {
            this.end_selector();
        }
        this.palette.classList.add("hidden");
        this.palette.classList.remove("activated");
        this.set_hint("");
        this.palette_items.classList.add("hidden");
    };
    Palette.prototype.open = function () {
        this.opened = true;
        this.override = false;
        console.log("unhiding palette");
        this.palette.classList.remove("hidden");
        if (this.get_input().length === 0) {
            this.set_hint("");
        }
        this.palette_items.classList.remove("hidden");
        this.palette_in.focus();
        this.query_update();
        console.log("test B");
        this.palette.classList.add("activated");
    };
    Palette.prototype.get_input = function () {
        return this.palette_in.value;
    };
    Palette.prototype.start_selector = function (p) {
        if (!this.opened) {
            this.open();
        }
        this.selectorActivated = true;
        this.override = true;
        console.log("selector started, selectorActivated==" + this.selectorActivated);
        this.search_items = [];
        var items = p.getSelection();
        for (var i = 0; i < items.length; i++) {
            this.search_items.push(items[i]);
        }
        this.query_update();
        this.palette_in.focus();
        // this.override = false;
    };
    Palette.prototype.end_selector = function () {
        console.log("end selector");
        this.selectorActivated = false;
        this.search_items = this.command_items;
    };
    Palette.prototype.lock = function () {
        this.palette_in.hide();
        this.palette.classList.add("unclickable");
    };
    Palette.prototype.unlock = function () {
        this.palette.classList.remove("unclickable");
    };
    return Palette;
}());
var PaletteItem = /** @class */ (function () {
    function PaletteItem(name, type, caption, command) {
        this.highlighted = false;
        this.name = name;
        this.caption = (caption !== undefined) ? caption : undefined;
        if (caption !== undefined) {
        }
        ;
        this.type = type;
        // console.log("COMMAND NAME: " + name);
        // console.log("========== ↓↓↓ command action ==========");
        // console.log(command!.action);
        // console.log("========== ↑↑↑ command action ==========");
        this.command = command;
    }
    PaletteItem.prototype.getHTML = function () {
        var item = document.createElement("div");
        item.classList.add("palette_item");
        item.innerHTML = this.getName() + " <key_hint> ↵</key_hint";
        if (this.caption != undefined) {
            var i_1 = document.createElement("div");
            i_1.innerHTML = this.caption;
            i_1.classList.add("caption");
            item.appendChild(i_1);
        }
        if (this.highlighted)
            item.classList.add("selected");
        return item;
    };
    PaletteItem.prototype.getName = function () {
        return this.name;
    };
    PaletteItem.prototype.getType = function () {
        return this.type;
    };
    PaletteItem.prototype.getSelection = function () {
        var r = [];
        for (var i = 0; i < this.command.selection.length; i++) {
            var p_i = new PaletteItem(this.command.selection[i], 3, undefined, this.command);
            r.push(p_i);
        }
        return r;
    };
    PaletteItem.prototype.action = function (p) {
        console.log("running action type " + this.getType());
        if (this.getType() === 0) {
            console.log(this.command !== undefined && this.command.type === 0);
            if (this.command !== undefined && this.command.type === 0) {
                this.command.action();
                console.log("palette close inside ACTION");
                p.close();
            }
        }
        else if (this.getType() === 1) {
            p.start_selector(this);
        }
        else if (this.getType() === 3) {
            p.run_command(this);
        }
    };
    return PaletteItem;
}());
// array datastructure to store commands
var commands = [
    // {
    //     names: ["preferences"],
    //     action: () => { toggle_prefs() },
    //     caption: "change app settings like theme and more",
    //     type: 0
    // },
    {
        names: ["about"],
        action: function () { toggle_splash(); },
        caption: "view information about Path Star",
        type: 0
    },
    {
        names: ["path:run"],
        action: function () { sim.gen_path(); },
        caption: "simulate the pathing algorithm",
        type: 0
    },
    {
        names: ["path:reset"],
        action: function () { grid.reset(); },
        caption: "reset the grid to initial state",
        type: 0
    },
    {
        names: ["path:clear"],
        action: function () { grid.clear(); },
        caption: "clear the grid",
        type: 0
    },
    {
        names: ["path:configure"],
        caption: "choose a pathing algorithm",
        action: function (n) {
            if (n != undefined)
                set_path_alg(n);
        },
        type: 1,
        selection: ["djikstra's algorithm"]
    },
    {
        names: ["maze:generate"],
        action: function () { sim.gen_maze(); },
        caption: "generate a new maze",
        type: 0
    },
    {
        names: ["maze:configure"],
        action: function (n) {
            if (n != undefined)
                set_maze_alg(n);
        },
        caption: "select a different maze generation algorithm",
        type: 1,
        selection: ["chaotic randomized prim's algorithm", "weighted randomized prim's algorithm"]
    },
    {
        names: ["maze:clear"],
        caption: "clear all walls from grid",
        action: function () { grid.clear_walls(); sim.reset_maze(); },
        type: 0
    },
    {
        names: ["maze:reset"],
        caption: "resets the maze generator. try this if you've encountered an error!",
        action: function () { sim.reset_maze(); debug.notice("Attempting to reset maze"); },
        type: 0
    },
    {
        names: ["delay:set"],
        caption: "set the delay for the simulation",
        action: function (input) { sim.set_delay(input); },
        type: 4
    }
];
var palette = new Palette(commands, [0, 1]);
var keys_p = {
    "Control": false,
    "Shift": false,
    "p": false
};
window.addEventListener("keyup", function (e) {
    keys_p[e.key] = (keys_p[e.key]) ? false : true;
    if (e.ctrlKey && e.key == "p") {
        e.preventDefault();
    }
    if (e.ctrlKey && e.shiftKey && e.key === "p") {
        e.preventDefault();
    }
});
window.addEventListener("keydown", function (e) {
    keys_p[e.key] = (keys_p[e.key]) ? false : true;
    if (e.key === " ") {
        if (overlay.active) {
            e.preventDefault();
            toggle_splash();
        }
    }
    else if (e.key === "Tab") {
        if (palette.opened) {
            e.preventDefault();
        }
        palette.fill_suggestion();
    }
    else if (palette.opened) {
        if (e.key === "Escape") {
            console.log("palette close inside ESCAPE_KEYDOWN");
            palette.close();
        }
        else if (e.key === "Enter") {
            console.log(palette.displayed_items[palette.get_highlighted_index()].getName());
            palette.run_command(palette.displayed_items[palette.get_highlighted_index()]);
            // palette.run_command();
        }
        else if (e.ctrlKey && e.altKey && e.key === "p") {
            console.log("palette close inside SHRTCT_KEYDOWN");
            e.preventDefault();
            palette.close();
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();
            palette.cycle_down();
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            palette.cycle_up();
        }
    }
    else if (!palette.opened) {
        if (e.ctrlKey && e.altKey && e.key === "p") {
            palette.palette_in.focus();
        }
    }
});
palette.palette_items.onwheel = function (e) {
    console.log("wheel scrolled");
};
palette.palette_items.onscroll = function (e) {
    console.log("onscroll event triggered");
};
window.addEventListener("click", function (e) {
    var t = e.target;
    var valid_click = document.querySelector("#palette").contains(t) || t.matches(".palette_item");
    if (!valid_click && !palette.override) {
        console.log("clicked outside the palette!");
        if (palette.opened) {
            console.log("palette close inside CLICK EVENT");
            palette.close();
        }
    }
    if (palette.override) {
        palette.override = false;
    }
    // else if(t.matches(".palette_item") || t.parentElement.matches(".palette_item")) {
    //     debug.log("clicked!");
    //     t.p_i.action(palette);
    // }
});
