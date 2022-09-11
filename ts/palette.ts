class Palette {
    constructor(commands: Command[], defaults: number[]) {
        this.commands = commands;
        for(var i = 0; i < defaults.length; i++) {
            this.defaults.push(commands[defaults[i]]);
        }  
        this.init_items(commands);
        this.s_command = commands[0];
        this.palette_in.p = this;
        this.palette_in.addEventListener("input", function(e:Event) {
            let p:any = e.target;
            p.p.query_update()});
        this.palette_in.addEventListener("focus", function(e:Event) {
            let p:any = e.target;
            p.p.open()});
        // this.palette_in.addEventListener("blur", function(e:Event) {
        //     let p:any = e.target;
        //     if(e.currentTarget != p.p.palette) {
        //         p.p.hide();
        //     }
        //     });
    }
    
    // primary data stores
    commands:Command[];
    s_command:Command;
    state:number = 0; //0 = default command search, 1 = selector
    suggestions:Command[] = [];
    palette:any = document.querySelector("#palette");
    palette_in:any = document.querySelector("#palette > input");
    palette_default:HTMLInputElement = this.palette.textContent;
    palette_hint:any = document.querySelector("#palette > #hint");
    palette_items:any = document.querySelector("#palette > #suggestions");
    defaults:Command[] = [];
    hint:string = "";
    command_items:PaletteItem[] = [];
    search_items:PaletteItem[] = []; //list of current items considered // updates depending on what you are searching i.e. all commands or choosing items for a selector
    displayed_items:PaletteItem[] = [];

    override:boolean = false;
    
    init_items(commands:Command[]):void {
        for(var i = 0; i < commands.length; i++) {
            console.log("appending new command item initialization");
            var p:PaletteItem = new PaletteItem(commands[i].names[0], commands[i].type, commands[i].caption, commands[i]);
            this.command_items.push(p);
        }
        this.search_items = this.command_items;
    }

    activate_command(name:string) {
        let p_i:PaletteItem|undefined = this.get_command(name);
        if(p_i != undefined) {
            this.run_command(p_i);
        } else {
            throw 'ReferenceError: Unkown function name';
        }
    }

    get_command(command_name:string):PaletteItem|undefined {
        for(var i:number = 0; i < this.command_items.length; i++) {
            if(this.command_items[i].getName() == command_name) {
                return this.command_items[i];
            }
        }
        return undefined;
    }

    run_command(p_i:PaletteItem) {
        this.palette_in.value = "";
        if(p_i.getType() === 1) {
            console.log("run command, selectorActived = " + this.selectorActivated);
            this.selectorActivated = true;
            this.start_selector(p_i);
        } else if(this.selectorActivated) {
            console.log("attempting selection");
            console.log(this.search_items.indexOf(p_i));
            p_i.command!.action(this.search_items.indexOf(p_i));
            console.log("palette close inside RUN_COMMAND");
            this.close();
        } else {
            console.log("default behavior")
            p_i.action(this);
        }
    }

    enter():void {
        if(this.displayed_items.length === 0) {
            debug.alert("Nothing was returned for your input. Is there a typo in your query?");
        } else {
            this.run_command(palette.displayed_items[palette.get_highlighted_index()]);
        }

    }

    // what the item list does: show a filtered selection of items depending on the entry in the text field. the top suggestion becomes an autofill suggestion.
    // so then what do we need?
    // a function that queries the masterlist and sends back the results from the list
    // a function that sets the hint/autofill

    /**
     * Serves the basic purpose of taking query input, displaying results of input and defining behavior.
     * 
     */
    query_update() {
        // this.search_items = this.command_items;
        let query_in:string = this.get_input();
        let query_out:PaletteItem[] = this.query_items(query_in);
        this.display_items(query_out);
        if(query_out.length > 0) {
            this.set_hint(query_out[0].getName());   
            this.set_highlighted_item(0);
        } else {
            this.set_hint("");
        }

    }
    query_items(input:string):PaletteItem[] {
        let r:PaletteItem[] = [];
        for(var i = 0; i < this.search_items.length; i++) {
            if(this.search_items[i].getName().indexOf(input) != -1) {
                r.push(this.search_items[i]);
            }
        }
        return r;
    }
    set_highlighted_item(index:number) {
        for(var i = 0; i < this.displayed_items.length; i++) {
            this.displayed_items[i].highlighted = false;
        }
        this.displayed_items[index].highlighted = true;
        this.display_items(this.displayed_items);
        this.set_hint(this.displayed_items[index].getName());
    }
    get_highlighted_index():number {
        for(var i = 0; i < this.displayed_items.length; i++) {
            if(this.displayed_items[i].highlighted) {
                return i;
            }
        }
        return 0;
    }
    get_display_item(index:number) {
        return this.displayed_items[index];
    }

    /**
     * These functions define display
     */

    add_item(item:PaletteItem):void {
        this.displayed_items.push(item);
        let elem:any = item.getHTML();
        elem.p_i = item;
        elem.p = this;
        this.palette_items.appendChild(elem);
        this.palette_items.lastElementChild.addEventListener("click",function(e:Event){
            let t:any = e.currentTarget;
            t.p_i.action(t.p);
        });
        // this.palette_items.appendChild(item.getHTML());
    }
    display_items(items:PaletteItem[]):void {
        this.palette_items.innerHTML = "";
        this.displayed_items = [];
        for(var i = 0; i < items.length; i++) {
            this.add_item(items[i]);
        }
    }
    clear_display_items():void {
        this.displayed_items = [];
        this.palette_items.innerHTML = "";
    }
    // hint/auto-fill suggestion management
    set_hint(hint:string) {
        this.hint = hint;
        if(!this.opened && this.get_input().length == 0) {
            this.palette_hint.innerHTML = "<key_hint> CTRL</key_hint> + <key_hint> ALT</key_hint> + <key_hint> P</key_hint> to open the command palette";
        } else if(this.get_input() === this.hint) {
            this.palette_hint.innerHTML = hint;
        } else if(this.get_input() != hint && hint.indexOf(this.get_input()) != -1 && hint.length > 0) {
            if(hint.substring(0,this.get_input().length) == this.get_input()) {
                this.palette_hint.innerHTML = hint + " <key_hint> ↹</key_hint>"; 
            } else {
                this.palette_hint.innerHTML = "";
            }
        } else {
            this.palette_hint.innerHTML = "";
        }
    }
    cycle_up() {
        var i:number = this.get_highlighted_index();
        if(i === 0) {
            this.set_highlighted_item(this.displayed_items.length - 1);
        } else {
            this.set_highlighted_item(i - 1);
        }
    }
    cycle_down() {
        var i:number = this.get_highlighted_index();
        if(i === this.displayed_items.length - 1) {
            this.set_highlighted_item(0);
        } else {
            this.set_highlighted_item(i + 1);
        }
    }
    fill_suggestion() {
        if(this.opened) {
            this.palette_in.value = this.hint;
            this.query_update();
        }
    }
    clear():void {
        this.palette_in.value = "";
    }
    close():void {
        this.opened = false;
        console.log("hiding the palette");
        this.palette_in.blur();
        if(this.selectorActivated) {
            this.end_selector();
        }
        this.palette.classList.add("hidden");
        this.palette.classList.remove("activated");
        this.set_hint("");
        this.palette_items.classList.add("hidden");
    }
    open():void {
        this.opened = true;
        this.override = false;
        console.log("unhiding palette");
        this.palette.classList.remove("hidden");
        if(this.get_input().length === 0) {
            this.set_hint("");
        }
        this.palette_items.classList.remove("hidden");
        this.palette_in.focus();
        this.query_update();
        console.log("test B");
        this.palette.classList.add("activated");
    }
    get_input():string {
        return this.palette_in.value;
    }
    // opened():boolean {
    //     return this.palette.matches(".activated");
    // }

    // secondary functions
    selectorActivated:boolean = false;
    start_selector(p:PaletteItem) {
        if(!this.opened) {
            this.open();
        }
        this.selectorActivated = true;
        this.override = true;
        console.log("selector started, selectorActivated==" + this.selectorActivated);
        this.search_items = [];
        let items:PaletteItem[] = p.getSelection();
        for(var i:number = 0; i < items.length; i++) {
            this.search_items.push(items[i]);
        }
        this.query_update();
        this.palette_in.focus();
        // this.override = false;
    }
    end_selector():void {
        console.log("end selector");
        this.selectorActivated = false;
        this.search_items = this.command_items;
    }

    lock():void {
        this.palette_in.hide();
        this.palette.classList.add("unclickable");
    }
    unlock():void {
        this.palette.classList.remove("unclickable");

    }
    private locked:boolean = false;
    public opened:boolean = false;
}


class PaletteItem {
    constructor(name:string, type:number, caption:string | undefined, command:Command | undefined) {
        this.name = name;
        this.caption = (caption !== undefined) ? caption : undefined;
        if(caption !== undefined) { 
        };
        this.type = type;
        // console.log("COMMAND NAME: " + name);
        // console.log("========== ↓↓↓ command action ==========");
        // console.log(command!.action);
        // console.log("========== ↑↑↑ command action ==========");
        this.command = command;
    }
    getHTML():HTMLElement {
        let item:HTMLElement = document.createElement("div");
        item.classList.add("palette_item");
        item.innerHTML = this.getName() + " <key_hint> ↵</key_hint";
        if(this.caption != undefined) {
            let i = document.createElement("div");
            i.innerHTML = this.caption;
            i.classList.add("caption");
            item.appendChild(i);
        }
        if(this.highlighted) item.classList.add("selected");
        return item;
    }
    getName():string {
        return this.name;
    }
    getType():number {
        return this.type;
    }
    getSelection():PaletteItem[] {
        let r:PaletteItem[] = [];
        for(var i:number = 0; i < this.command!.selection!.length; i++) {
            let p_i:PaletteItem = new PaletteItem(this.command!.selection![i], 3, undefined, this.command);
            r.push(p_i);
        }
        return r;
    }
    action(p:Palette):void {
        console.log("running action type " + this.getType());
        if(this.getType() === 0) {
            console.log(this.command !== undefined && this.command.type === 0);
            if(this.command !== undefined && this.command.type === 0) {
                this.command.action();
                console.log("palette close inside ACTION");
                p.close();
            }
        } else if(this.getType() === 1) {
            p.start_selector(this);
        } else if(this.getType() === 3) {
            p.run_command(this);
        }
    }
    
    // type
    private type: number;
    
    private name: string;
    private caption: string | undefined;
    public command: Command | undefined;
    public highlighted:boolean = false;    
}

// command data type: stores key information about command
// about command types
    // sub-commands are commands that you can access by first entering a root command. you can either enter the commands one-by-one, or use the special indicator character where necessary.
    // selectors are commands where you are given a list of options to choose from. the program can use this to enable a variety of configurations.
    // commands are basic commands to run by entering their name.

type Command = {
    names: string[];
    action: (n?:any) => void;
    //0 for command, 1 for selector command, 2 for subcommands, 3 for user input;
    type: number;
    caption?: string
    selection?: string[];
    subcommands?: Command[];
}

// array datastructure to store commands
var commands: Command[] = [
    // {
    //     names: ["preferences"],
    //     action: () => { toggle_prefs() },
    //     caption: "change app settings like theme and more",
    //     type: 0
    // },
    {
        names: ["about"],
        action: () => { toggle_splash() },
        caption: "view information about Path Star",
        type: 0
    },
    {
        names: ["path:run"],
        action: () => { sim.gen_path() },
        caption: "simulate the pathing algorithm",
        type: 0
    },
    {        
        names: ["path:reset"],
        action: () => { grid.reset() },
        caption: "reset the grid to initial state",
        type: 0
    },
    {
        names: ["path:clear"],
        action: () => { grid.clear() },
        caption: "clear the grid",
        type: 0
    },
    {
        names: ["path:configure"],
        caption: "choose a pathing algorithm",
        action: function(n:number|undefined):void {
            if(n!=undefined) set_path_alg(n);
        },
        type: 1,
        selection: ["djikstra's algorithm"]
    },
    {
        names: ["maze:generate"],
        action: () => { sim.gen_maze(); },
        caption: "generate a new maze",
        type: 0
    },
    {
        names: ["maze:configure"],
        action: function(n:number|undefined) {
            if(n!=undefined) set_maze_alg(n);
        },
        caption: "select a different maze generation algorithm",
        type: 1,
        selection: ["chaotic randomized prim's algorithm","weighted randomized prim's algorithm"]
    },
    {
        names: ["maze:clear"],
        caption: "clear all walls from grid",
        action: () => { grid.clear_walls(); sim.reset_maze(); },
        type:0
    },
    {
        names: ["maze:reset"],
        caption: "resets the maze generator. try this if you've encountered an error!",
        action: () => { sim.reset_maze(); debug.notice("Attempting to reset maze")},
        type: 0
    },
    {
        names: ["delay:set"],
        caption: "set the delay for the simulation",
        action: (input:number) => { sim.set_delay(input); },
        type: 4
    }
]

var palette:Palette = new Palette(commands, [0,1]);

var keys_p:any = {
    "Control":false,
    "Shift":false,
    "p":false
};
window.addEventListener("keyup",function(e) {
    keys_p[e.key] = (keys_p[e.key]) ? false : true;
    if(e.ctrlKey && e.key == "p") {
        e.preventDefault();
    }
    if(e.ctrlKey && e.shiftKey && e.key === "p") {
        e.preventDefault();
    }
});
window.addEventListener("keydown",function(e) {
    keys_p[e.key] = (keys_p[e.key]) ? false : true;
    if(e.key === " ") {
        if(overlay.active) {
            e.preventDefault();
            toggle_splash();
        }
    } else if(e.key === "Tab") {
        if(palette.opened) {
            e.preventDefault();
        }
        palette.fill_suggestion();
    } else if(palette.opened) {
        if(e.key === "Escape") {
            console.log("palette close inside ESCAPE_KEYDOWN");
            palette.close();
        } else if(e.key === "Enter") {
            palette.enter();
            // palette.run_command();
        } else if(e.ctrlKey && e.altKey && e.key === "p") {
            console.log("palette close inside SHRTCT_KEYDOWN");
            e.preventDefault();
            palette.close();
        } else if(e.key === "ArrowDown") {
            e.preventDefault();
            palette.cycle_down();
        } else if(e.key === "ArrowUp") {
            e.preventDefault();
            palette.cycle_up();
        }
    } else if(!palette.opened) {
        if(e.ctrlKey && e.altKey && e.key === "p") {
            palette.palette_in.focus();
        }
    }
});

palette.palette_items.onwheel = function(e:Event) {
    console.log("wheel scrolled")
}
palette.palette_items.onscroll = function(e:Event) {
    console.log("onscroll event triggered");
}

window.addEventListener("click", function(e:Event) {
    var t:any = e.target;
    var valid_click:boolean = document!.querySelector("#palette")!.contains(t) || t.matches(".palette_item");
    if(!valid_click && !palette.override) {
        if(palette.opened) {
            console.log("palette close inside CLICK EVENT");
            palette.close();
        }
    }
    if(palette.override) {
        palette.override = false;
    }
    // else if(t.matches(".palette_item") || t.parentElement.matches(".palette_item")) {
    //     debug.log("clicked!");
    //     t.p_i.action(palette);
    // }
});