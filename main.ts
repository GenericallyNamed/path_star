exports = {}


window.onerror = function(msg,url,line) {
    debug.alert("Warning: an error occured on line " + line + " in " + url + ". Error message: " + msg + "\nIf you can, please make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>");
}

// meta
var app_ver:string = "0.5.1 infdev";
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
var stop_btn:any = document.getElementById("stop_btn");
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
        var handler = new Error();
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
        var handler = new Error();
        var s:string = handler!.stack!;
        console.log(s);
        var line_num:string = s.substring(s.indexOf(":", s.indexOf(".js", s.indexOf("at", s.indexOf("at") + 1))) + 1, s.indexOf(":", s.indexOf(":", s.indexOf(".js", s.indexOf("at", s.indexOf("at") + 1))) + 1));
        let a:HTMLElement = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("warn");
        a.innerHTML = "<img src='icons/warn.svg' class='warn-symbol'> " + ("<line_num>" + line_num + ":</line_num> ") + alert;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
        if(document.querySelectorAll(".warn-symbol").length > 5) {
            this.notice("Several errors have occurred. Please try refreshing the page to resolve the issue. You may also consider filling out a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>.");
        }
    }

    notice(notice:string) {
        var handler = new Error();
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
            var text:string;
            if(this.elem.hasAttribute("hover_warn")) {
                e.classList.add("warn");
                text = this.get_hint();
            } else if(this.elem.hasAttribute("hover_notice")) {
                e.classList.add("notice");
                text = this.get_hint();
            } else {
                text = this.get_hint();
            }
            if(this.elem.hasAttribute("hover_tag")) {
                text = text + "<i> —" + this.elem.getAttribute("hover_tag") + " </i>"
            }
            e.innerHTML = text;
            e.classList.add("hover_hint");
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
        this.disable(randomize_btn);
        this.disable(maze_selector);
    }
    maze_gen_unlock() {
        this.enable(randomize_btn);
        this.enable(maze_selector);
    }
    path_gen_lock() {
        this.disable(gen_path_btn);
        this.disable(path_selector);
    }
    path_gen_unlock() {
        this.enable(gen_path_btn);
        this.enable(path_selector);
    }

    // specific locks
    lock_path_run_btn():void {

    }
    unlock_path_run_btn():void {

    }
    dim_lock():void {
        this.disable(h_in);
        this.disable(w_in);
    }
    dim_unlock():void {
        this.enable(h_in);
        this.enable(w_in);
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
        this.disable(undo_btn);
    }
    undo_unlock():void {
        this.enable(undo_btn);
    }
    redo_lock():void {
        this.disable(redo_btn);
    }
    redo_unlock():void {
        this.enable(redo_btn);

    }
    grid_lock():void {
        grid.lock();
    }
    grid_unlock():void {
        grid.unlock();
    }

    design_lock():void {
        this.disable(clear_btn);
        this.disable(set_start_btn);
        this.disable(set_finish_btn);
        this.paint_btn_lock();
        this.grid_lock();
        this.undo_redo_lock();
    }
    design_unlock():void {
        this.enable(clear_btn);
        this.enable(set_start_btn);
        this.enable(set_finish_btn);
        this.path_gen_unlock();
        this.maze_gen_unlock();
        this.paint_btn_unlock();
        this.grid_unlock();
        this.undo_redo_unlock();
    }
    skip_btn_lock():void {
        this.disable(skip_back_btn);
        this.disable(skip_next_btn);
    }
    skip_btn_unlock():void {
        this.enable(skip_back_btn);
        this.enable(skip_next_btn);
    }
    restart_btn_lock():void {
        this.disable(restart_btn);
    }
    restart_btn_unlock():void {
        this.enable(restart_btn);
    }
    paint_btn_lock():void {
        this.disable(paint_btn);
    }
    paint_btn_unlock():void {
        this.enable(paint_btn);
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

    disable(button:any):void {
        button.disabled = true;
        button.tab_index = parseInt(button.getAttribute("tabindex"));
        button.setAttribute("tabIndex", -1);
        button.classList.add("lock");
    }
    enable(button:any):void {
        button.disabled = false;
        button.setAttribute("tabIndex", button.tab_index);
        button.classList.remove("lock");
    }

    add_warning(button:any):void {
        button.classList.add("warning");
        var warning_icon = document.createElement<any>("img");
        warning_icon.classList.add("button_warning_icon");
        warning_icon.btn = button;
        warning_icon.setAttribute("src","icons/warning.svg");
        button.warning_icon = warning_icon;
        warning_icon.style.position = "absolute";
        warning_icon.style.width = "1rem";
        warning_icon.style.height = "1rem";
        document.body.appendChild(warning_icon);
        warning_icon.style.left = (button.offsetWidth + button.offsetLeft - (warning_icon.offsetWidth * 0.6)) + "px";
        warning_icon.style.top = (button.offsetTop - (warning_icon.offsetHeight * 0.4)) + "px";
    }
    remove_warning(button:any):void {
        button.classList.remove("warning");
        if(button.warning_icon !== undefined) button.w.remove();
    }
    
    add_notice(button:any):void {
        button.classList.add("notice");
        var notice_icon = document.createElement<any>("img");
        notice_icon.classList.add("button_notice_icon");
        notice_icon.btn = button;
        notice_icon.setAttribute("src","icons/notice_filled.svg");
        button.n_icon = notice_icon;
        notice_icon.style.position = "absolute";
        notice_icon.style.width = "1rem";
        notice_icon.style.height = "1rem";
        document.body.appendChild(notice_icon);
        notice_icon.style.left = (button.offsetWidth + button.offsetLeft - (notice_icon.offsetWidth * 0.6)) + "px";
        notice_icon.style.top = (button.offsetTop - (notice_icon.offsetHeight * 0.4)) + "px";
    }
    remove_notice(button:any):void {
        button.classList.remove("notice");
        if(button.n_icon !== undefined) button.n_icon.remove();
    }

    create_load_animation(container_elem:any):void {
        var anim_container = document.createElement("div");
        anim_container.classList.add("anim_elem");
        let container:any = container_elem;
        anim_container.style.borderRadius = getComputedStyle(container).borderRadius;
        anim_container.style.width = container.offsetWidth + "px";
        anim_container.style.height = container.offsetHeight + "px";
        anim_container.style.left = container.offsetLeft + "px";
        anim_container.style.top = container.offsetTop + "px";
        var anim_elem = document.createElement('div');
        anim_elem.classList.add("anim_elem_i");
        anim_container.appendChild(anim_elem);
        document.body.appendChild(anim_container);

    }
    // button lock data store

}

ui = new UserInterface();
grid.set_ui(ui);
// grid configurations
// ui.create_load_animation(randomize_btn);
grid.set_start(1,1);
grid.set_finish(5,5);

ui.restart_btn_lock();
ui.disable(restart_btn);
ui.disable(stop_btn);
ui.skip_btn_lock();
// ui.add_warning(gen_path_btn);

function add_warn(button:any) {
    ui.add_warning(button);
}
function remove_warn(button:any) {
    ui.remove_warning(button);
}