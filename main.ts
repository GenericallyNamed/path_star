exports = {}


window.onerror = function(msg,url,line) {
    debug.alert("Warning: an error occured on line " + line + " in " + url + ". Error message: " + msg + "\nIf you can, please make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>");
}

// meta
var app_ver:string = "0.5.0";
document.querySelector("#about_app.title")!.innerHTML = "v" + app_ver + " • created by Alex Shandilis"
// globals & defaults
var winHeight = window.innerHeight;
var winWidth = window.innerWidth;
var container:any = document.getElementById("container");
var overlay:any = document.getElementById("overlay");
var header:any = document.getElementById("header");
var body:any = document.getElementById("body");
var footer:any = document.getElementById("footer");
var table:any = document.querySelector("#body > table");
var h_in:any = document.getElementById("height_in");
var w_in:any = document.getElementById("width_in");
var undo_btn:any = document.getElementById("undo_btn");
var redo_btn:any = document.getElementById("redo_btn");
var run_btn:any = document.getElementById("start_btn");
var skip_back_btn:any = document.getElementById("skip_back_btn");
var skip_next_btn:any = document.getElementById("skip_next_btn");
var restart_btn:any = document.getElementById("reset_btn");
var clear_btn:any = document.getElementById("clear_btn");
var paint_btn:any = document.getElementById("add_wall_btn");
var set_start_btn:any = document.getElementById("add_start_btn");
var set_finish_btn:any = document.getElementById("add_finish_btn");
var timer_btn:any = document.getElementById("timing_btn");
var randomize_btn:any = document.getElementById("randomize_btn");
var maze_selector:any = document.querySelector("#maze_controls > .controls > .selector");
var gen_path_btn:any = document.getElementById("gen_path_btn");
var path_selector:any = document.querySelector("#alg_controls > .controls > .selector");
var splash:any = document.getElementById("splash");
var prefs:any = document.getElementById("prefs");
var widgets:any = document.getElementById("widget_container");
// var palette:any = document.querySelector("#palette");
var palette_in:any = document.querySelector("#palette > input");
// var palette_default:HTMLInputElement = palette.textContent;
var palette_hint = document.querySelector("#palette > #hint");
var palette_suggestions = document.querySelector("#palette > #suggestions");

var start_w = 30, start_h = 30;
w_in.value = start_w;
h_in.value = start_h;
table.style.display = "none";
// set-up
var grid = new Grid(start_w, start_h, table);
interface HTMLElement {
    active: boolean
}
overlay.active = false;
update_window();
toggle_splash();

// window configuration
function update_window() {
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    overlay.style.width = winWidth + "px";
    overlay.style.height = winHeight + "px";
    container.style.width = winWidth + "px";
    container.style.height = winHeight + "px";
    var h_height = 75, f_height = 100;
    header.style.height = h_height + "px";
    footer.style.height = f_height + "px";
    body.style.height = winHeight - (h_height + f_height) - 2 + "px";
    let table_max_height = body.offsetHeight;
    let table_max_width = body.offsetWidth;
    let height_prop = table_max_height / grid.height;
    let width_prop = table_max_width / grid.width;
    let use_vert = height_prop < width_prop;
    var dim = use_vert ? height_prop : width_prop;
    let total_margin_spaces = grid.height;
    let total_margin_height = table_max_height * 0.1;
    let border = 1;
    let cell_height:number = table_max_height / grid.height;
    // let cell_height = total_cell_height / grid.height;
    let margin = total_margin_height / (total_margin_spaces + 1); 
    let len = cell_height;
    document.documentElement.style.setProperty("--cell-margin", margin + "px");
    document.documentElement.style.setProperty("--cell-border", border + "px");
    document.documentElement.style.setProperty("--cell-len", len + "px");
}

window.addEventListener("resize", function() {
    update_window();
});

// grid configurations

grid.set_start(1,1);
grid.set_finish(5,5);

h_in.addEventListener("change", function() {
    let v = parseInt(h_in.value);
    if(v < grid.min_dim) {
        v = grid.min_dim;
        h_in.value = v;
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    } else if(v > grid.max_dim) {
        v = grid.max_dim;
        h_in.value = v;
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    } else if(v > grid.min_dim && v < grid.max_dim) {
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    } else {
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    }
});

w_in.addEventListener("change", function() {
    let v = parseInt(w_in.value);
    if(v < grid.min_dim) {
        v = grid.min_dim;
        w_in.value = v;
        grid.set_columns(v);
        grid.set_width = v;
        update_window();
    } else if(v > grid.max_dim) {
        grid.set_width = v;
        v = grid.max_dim;
        w_in.value = v;
        grid.set_columns(grid.max_dim);
        update_window();
    } else if(v > grid.min_dim && v < grid.max_dim) {
        grid.set_width = v;
        grid.set_columns(v);
        update_window();
    } else {
        grid.set_width = v;
        grid.set_columns(v);
        update_window();
    }
});
function toggle_splash() {
    if(overlay.active === false) {
        overlay.active = true;
        overlay.classList.remove("invisible");
        splash.classList.remove("shrink");
    } else {
        overlay.active = false;
        overlay.classList.add("invisible");
        splash.classList.add("shrink");
        if(grid.revealed === false) {
            // wave(grid);
            // widgets.classList.remove("hide");
        }
    }
}
function toggle_prefs() {
    if(overlay.active === false) {
        console.log("testy test");
        overlay.active = true;
        overlay.classList.remove("invisible");
        prefs.classList.remove("shrink");
    } else {
        overlay.active = false;
        overlay.classList.add("invisible");
        prefs.classList.add("shrink");
    }
}

grid.update_coords();

function blank_all_cells(grid:any) {
    for(var i = 0; i < grid.height; i++) {
        for(var j = 0; j < grid.width; j++) {
            console.log('test');
        }
    }   
}

class Debugger {
    constructor(debugger_elem:any) {
        this.d_elem = debugger_elem;
    }

    log(debug:string) {
        var prev_l:any = document.querySelector("#debug_output")!.lastChild;
        if(prev_l!.childNodes[1].textContent === " " + debug + " ") {
            let num:number = parseInt(prev_l!.querySelector(".log-count").innerHTML);
            let new_num:number = num + 1;
            prev_l!.querySelector(".log-count").innerHTML = new_num;
            prev_l!.querySelector(".log-count").style.visibility = "unset";
            prev_l.lastChild.style.visibility = "visible";
        } else {
            let d:HTMLElement = document.createElement('div');
            d.classList.add("debug");
            d.innerHTML = "<img src='icons/chevron.svg' class='chevron-symbol'> " + debug + " <div style='visibility:hidden;' class='log-count'>1</div";
            this.d_elem.appendChild(d);
            this.hide_elems_offscreen();
        }
    }
    
    alert(alert:string) {
        let a:HTMLElement = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("warn");
        a.innerHTML = "<img src='icons/warn.svg' class='warn-symbol'> " + alert;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
        if(document.querySelectorAll(".warn-symbol").length > 5) {
            this.notice("Several errors have occurred. Please try refreshing the page to resolve the issue. You may also consider filling out a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>.");
        }
    }

    notice(notice:string) {
        let a:HTMLElement = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("notice");
        a.innerHTML = "<img src='icons/notice.svg' class='notice-symbol'> " + notice;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
    }

    info(info:string) {
        let a:HTMLElement = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("info");
        a.innerHTML = "<img src='icons/info.svg' class='info-symbol'> " + info;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
    }
    
    hide_elems_offscreen():void {
        var elems:any = document.querySelectorAll(".debug");
        for(var i = 0; i < elems.length; i++) {
            if(elems[i].offsetTop < 0) {
                elems[i].remove();
            }
        }
    }

    clear() {
        this.d_elem.innerHTML = "";
    }

    d_elem:any;
}
var debug = new Debugger(document.getElementById("debug_output"));

debug.alert("This app is in-development. Errors and in-stability are likely to occur. If you encounter freezing, try pressing ctrl+w repeatedly or crying.");
debug.notice("Optimization issues are likely to occur due to optimization issues.");
debug.info("Path Star v" + app_ver + " by Alex Shandilis"); 

class HoverHint {
    constructor(elem:any) {
        this.elem = elem;
        this.elem.hintClass = this;
        elem.addEventListener("focus", function(e:Event) {
            let ev:any = e;
            let el:any = e.currentTarget;
            el.hintClass.reveal_hint();
            ev.currentTarget!.hintClass!.activated = true;
        });
        elem.addEventListener("mouseover", function(e:Event) {
            let ev:any = e;
            let el:any = e.currentTarget;
            if(ev.currentTarget!.hintClass!.hintActivated == undefined || !ev.currentTarget!.hintClass!.hintActivated) {
                el.hintClass.reveal_hint();
            }
        });
        elem.addEventListener("mouseleave", function(e:Event) {
            let ev:any = e;
            ev.currentTarget!.hintClass!.activated = false;
            let el:any = e.currentTarget;
            el.hintClass.hide_hint();
        });
        elem.addEventListener("blur", function(e:Event) {
            let ev:any = e;
            ev.currentTarget!.hintClass!.activated = false;
            let el:any = e.currentTarget;
            el.hintClass.hide_hint();
        });
    }

    reveal_hint():void {
        if(!this.hintActivated && !this.elem.classList.contains("lock")) {
            this.hintActivated = true;
            if(this.hint_elem != undefined) this.hint_elem.remove();
            let e:HTMLElement = document.createElement('div');  
            var x:number = this.elem.offsetLeft + (this.elem.offsetWidth / 2);
            var y:number = this.elem.offsetTop - 10;
            e.classList.add("hover_hint");
            e.innerText = this.get_hint();
            e.style.position = "absolute";
            e.style.left = x + "px";
            e.style.top = y + "px";
            document.body.appendChild(e);
            this.hint_elem = e;
        }
    }

    hide_hint():void {
        if(this.hintActivated) {
            this.hintActivated = false;
            this.hint_elem.classList.add("hidden");
            var el:HTMLElement = this.hint_elem;
        }
    }

    get_hint():string {
        return this.elem.getAttribute("hover_hint");
    }

    elem:any;
    hint_elem:any;
    hintActivated:boolean = false;
}
var hint_elems = document.querySelectorAll("[hover_hint]");
var hints:HoverHint[] = [];
for(var i:number = 0; i < hint_elems.length; i++) {
    hints.push(new HoverHint(hint_elems[i]));
}
grid.activate_paint();
grid.create_floating_element();

class UserInterface {
    constructor() {

    }
    // pause-play behavior
    private paused:boolean = false;
    pause() {
        run_btn.firstElementChild.setAttribute("src","icons/play.svg");
        this.paused = true;
    }
    play() {
        run_btn.firstElementChild.setAttribute("src","icons/pause.svg");
        this.paused = false;
    }
    toggle_pause() {
        if(this.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    // general locks
    lock_all():void {

    }
    unlock_all():void {
        
    }
    
    customization_lock():void {
        this.maze_gen_lock();
        this.path_gen_lock();
        this.dim_lock();
        this.design_lock();
    }
    customization_unlock():void {
        this.maze_gen_unlock();
        this.path_gen_unlock();
        this.dim_unlock();
        this.design_unlock();
    }

    maze_gen_lock() {
        randomize_btn.classList.add("lock");
        maze_selector.classList.add("lock");
    }
    maze_gen_unlock() {
        randomize_btn.classList.remove("lock");
        maze_selector.classList.remove("lock");
    }
    path_gen_lock() {
        gen_path_btn.classList.add("lock");
        path_selector.classList.add("lock");
    }
    path_gen_unlock() {
        gen_path_btn.classList.remove("lock");
        path_selector.classList.remove("lock");
    }

    // specific locks
    lock_path_run_btn():void {

    }
    unlock_path_run_btn():void {

    }
    dim_lock():void {
        h_in.classList.add("lock");
        w_in.classList.add("lock");
    }
    dim_unlock():void {
        h_in.classList.remove("lock");
        w_in.classList.remove("lock");
    }
    undo_redo_lock():void {
        this.undo_lock();
        this.redo_lock();

    }
    undo_redo_unlock():void {
        this.undo_unlock();
        this.redo_unlock();
    }
    undo_lock():void {
        undo_btn.classList.add("lock");
    }
    undo_unlock():void {
        undo_btn.classList.remove("lock");
    }
    redo_lock():void {
        redo_btn.classList.add("lock");
        
    }
    redo_unlock():void {
        redo_btn.classList.remove("lock");

    }
    grid_lock():void {
        grid.lock();
    }
    grid_unlock():void {
        grid.unlock();
    }

    design_lock():void {
        clear_btn.classList.add("lock");
        set_start_btn.classList.add("lock");
        set_finish_btn.classList.add("lock");
        this.paint_btn_lock();
        this.grid_lock();
        this.undo_redo_lock();
    }
    design_unlock():void {
        clear_btn.classList.remove("lock");
        set_start_btn.classList.remove("lock");
        set_finish_btn.classList.remove("lock");
        this.paint_btn_unlock();
        this.grid_unlock();
        this.undo_redo_unlock();
    }
    skip_btn_lock():void {
        skip_back_btn.disabled = true;
        skip_back_btn.disabled = true;
        skip_back_btn.classList.add("lock");
        skip_next_btn.classList.add("lock");
    }
    skip_btn_unlock():void {
        skip_back_btn.disabled = false;
        skip_next_btn.disabled = false;
        skip_back_btn.classList.remove("lock");
        skip_next_btn.classList.remove("lock");
    }
    restart_btn_lock():void {
        restart_btn.disabled = true;
        restart_btn.classList.add("lock");
    }
    restart_btn_unlock():void {
        restart_btn.disabled = false;
        restart_btn.classList.remove("lock");
    }
    paint_btn_lock():void {
        paint_btn.classList.add("lock");
    }
    paint_btn_unlock():void {
        paint_btn.classList.remove("lock");

    }

    set_play_btn_type(type:number) {
        if(type === 0) {
            run_btn.firstElementChild.setAttribute("src","icons/play.svg");
        } else if(type === 1) {
            run_btn.firstElementChild.setAttribute("src","icons/path_play.svg");
        } else if(type === 2) {
            run_btn.firstElementChild.setAttribute("src","icons/maze_play.svg");
        }
    }

    add_warning(button:any):void {
        button.classList.add("warning");
        var w = document.createElement<any>("img");
        w.btn = button;
        w.setAttribute("src","icons/warning.svg");
        button.w = w;
        w.style.position = "absolute";
        w.style.width = "1rem";
        w.style.height = "1rem";
        document.body.appendChild(w);
        w.style.left = (button.offsetWidth + button.offsetLeft - (w.offsetWidth * 0.6)) + "px";
        w.style.top = (button.offsetTop - (w.offsetHeight * 0.4)) + "px";
    }
    remove_warning(button:any):void {
        button.classList.remove("warning");
        button.w.remove();
    }

    // button lock data store

}

// ui = new UserInterface();
ui.restart_btn_lock();
ui.skip_btn_lock();
ui.add_warning(gen_path_btn);

function add_warn(button:any) {
    ui.add_warning(button);
}
function remove_warn(button:any) {
    ui.remove_warning(button);
}