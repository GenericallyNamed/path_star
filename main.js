exports = {};
window.onerror = function (msg, url, line) {
    debug.alert("Warning: an error occured on line " + line + " in " + url + ". Error message: " + msg + "\nIf you can, please make a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>");
};
// meta
var app_ver = "0.6.1 alpha";
document.querySelector("#about_app.title").innerHTML = "v" + app_ver + " • created by Alex Shandilis";
// globals & defaults
var winHeight = window.innerHeight;
var winWidth = window.innerWidth;
var container = document.getElementById("container");
var overlay = document.getElementById("overlay");
var header = document.getElementById("header");
var body = document.getElementById("body");
var footer = document.getElementById("footer");
var table = document.querySelector("#body > table");
var h_in = document.getElementById("height_in");
var w_in = document.getElementById("width_in");
var undo_btn = document.getElementById("undo_btn");
var redo_btn = document.getElementById("redo_btn");
var run_btn = document.getElementById("start_btn");
var skip_back_btn = document.getElementById("skip_back_btn");
var skip_next_btn = document.getElementById("skip_next_btn");
var restart_btn = document.getElementById("reset_btn");
var stop_btn = document.getElementById("stop_btn");
var clear_btn = document.getElementById("clear_btn");
var paint_btn = document.getElementById("add_wall_btn");
var set_start_btn = document.getElementById("add_start_btn");
var set_finish_btn = document.getElementById("add_finish_btn");
var timer_btn = document.getElementById("timing_btn");
var randomize_btn = document.getElementById("randomize_btn");
var maze_selector = document.querySelector("#maze_controls > .controls > .selector");
var gen_path_btn = document.getElementById("gen_path_btn");
var path_selector = document.querySelector("#alg_controls > .controls > .selector");
var splash = document.getElementById("splash");
var prefs = document.getElementById("prefs");
var widgets = document.getElementById("widget_container");
// var palette:any = document.querySelector("#palette");
var palette_in = document.querySelector("#palette > input");
// var palette_default:HTMLInputElement = palette.textContent;
var palette_hint = document.querySelector("#palette > #hint");
var palette_suggestions = document.querySelector("#palette > #suggestions");
var start_w = 30, start_h = 30;
w_in.value = start_w;
h_in.value = start_h;
table.style.display = "none";
// set-up
var grid = new Grid(start_w, start_h, table);
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
    var table_max_height = body.offsetHeight;
    var table_max_width = body.offsetWidth;
    var height_prop = table_max_height / grid.height;
    var width_prop = table_max_width / grid.width;
    var use_vert = height_prop < width_prop;
    var dim = use_vert ? height_prop : width_prop;
    var total_margin_spaces = grid.height;
    var total_margin_height = table_max_height * 0.1;
    var border = 1;
    var cell_height = table_max_height / grid.height;
    // let cell_height = total_cell_height / grid.height;
    var margin = total_margin_height / (total_margin_spaces + 1);
    var len = cell_height;
    document.documentElement.style.setProperty("--cell-margin", margin + "px");
    document.documentElement.style.setProperty("--cell-border", border + "px");
    document.documentElement.style.setProperty("--cell-len", len + "px");
}
window.addEventListener("resize", function () {
    update_window();
});
h_in.addEventListener("change", function () {
    var v = parseInt(h_in.value);
    if (v < grid.min_dim) {
        v = grid.min_dim;
        h_in.value = v;
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    }
    else if (v > grid.max_dim) {
        v = grid.max_dim;
        h_in.value = v;
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    }
    else if (v > grid.min_dim && v < grid.max_dim) {
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    }
    else {
        grid.set_height = v;
        grid.set_rows(v);
        update_window();
    }
});
w_in.addEventListener("change", function () {
    var v = parseInt(w_in.value);
    if (v < grid.min_dim) {
        v = grid.min_dim;
        w_in.value = v;
        grid.set_columns(v);
        grid.set_width = v;
        update_window();
    }
    else if (v > grid.max_dim) {
        grid.set_width = v;
        v = grid.max_dim;
        w_in.value = v;
        grid.set_columns(grid.max_dim);
        update_window();
    }
    else if (v > grid.min_dim && v < grid.max_dim) {
        grid.set_width = v;
        grid.set_columns(v);
        update_window();
    }
    else {
        grid.set_width = v;
        grid.set_columns(v);
        update_window();
    }
});
function toggle_splash() {
    if (overlay.active === false) {
        overlay.active = true;
        overlay.classList.remove("invisible");
        splash.classList.remove("shrink");
    }
    else {
        overlay.active = false;
        overlay.classList.add("invisible");
        splash.classList.add("shrink");
        if (grid.revealed === false) {
            // wave(grid);
            // widgets.classList.remove("hide");
        }
    }
}
function toggle_prefs() {
    if (overlay.active === false) {
        console.log("testy test");
        overlay.active = true;
        overlay.classList.remove("invisible");
        prefs.classList.remove("shrink");
    }
    else {
        overlay.active = false;
        overlay.classList.add("invisible");
        prefs.classList.add("shrink");
    }
}
grid.update_coords();
function blank_all_cells(grid) {
    for (var i = 0; i < grid.height; i++) {
        for (var j = 0; j < grid.width; j++) {
            console.log('test');
        }
    }
}
var Debugger = /** @class */ (function () {
    function Debugger(debugger_elem) {
        this.d_elem = debugger_elem;
    }
    Debugger.prototype.log = function (debug) {
        var _a;
        var handler = new Error();
        if (debug.indexOf("undefined") !== -1) {
            console.log("BRUH!");
        }
        var prev_l = document.querySelector("#debug_output").lastChild;
        if (prev_l.childNodes[1].textContent === " " + debug + " ") {
            var num = parseInt(prev_l.querySelector(".log-count").innerHTML);
            var new_num = num + 1;
            prev_l.querySelector(".log-count").innerHTML = new_num;
            prev_l.querySelector(".log-count").style.visibility = "unset";
            prev_l.lastChild.style.visibility = "visible";
        }
        else {
            var d = document.createElement('div');
            d.classList.add("debug");
            d.innerHTML = "<img src='icons/chevron.svg' class='chevron-symbol'> " + debug + " <div style='visibility:hidden;' class='log-count'>1</div";
            if (((_a = d.innerText) === null || _a === void 0 ? void 0 : _a.indexOf("undefined")) !== -1) {
                console.log("BRUGH!!!!");
            }
            this.d_elem.appendChild(d);
            this.hide_elems_offscreen();
        }
    };
    Debugger.prototype.alert = function (alert) {
        var handler = new Error();
        var s = handler.stack;
        console.log(s);
        var line_num = s.substring(s.indexOf(":", s.indexOf(".js", s.indexOf("at", s.indexOf("at") + 1))) + 1, s.indexOf(":", s.indexOf(":", s.indexOf(".js", s.indexOf("at", s.indexOf("at") + 1))) + 1));
        var a = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("warn");
        a.innerHTML = "<img src='icons/warn.svg' class='warn-symbol'> " + ("<line_num>" + line_num + ":</line_num> ") + alert;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
        if (document.querySelectorAll(".warn-symbol").length > 3) {
            this.notice("Several errors have occurred. Please try refreshing the page to resolve the issue. You may also consider filling out a bug report at <a href='https://github.com/genericallynamed' style='text-decoration:underline;display:contents;'>github.com/genericallynamed</a>.");
        }
    };
    Debugger.prototype.notice = function (notice) {
        var handler = new Error();
        var a = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("notice");
        a.innerHTML = "<img src='icons/notice.svg' class='notice-symbol'> " + notice;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
    };
    Debugger.prototype.info = function (info) {
        var a = document.createElement('div');
        a.classList.add("debug");
        a.classList.add("info");
        a.innerHTML = "<img src='icons/info.svg' class='info-symbol'> " + info;
        this.d_elem.appendChild(a);
        this.hide_elems_offscreen();
    };
    Debugger.prototype.hide_elems_offscreen = function () {
        var elems = document.querySelectorAll(".debug");
        for (var i = 0; i < elems.length; i++) {
            if (elems[i].offsetTop < 0) {
                elems[i].remove();
            }
        }
    };
    Debugger.prototype.clear = function () {
        this.d_elem.innerHTML = "";
    };
    return Debugger;
}());
var debug = new Debugger(document.getElementById("debug_output"));
debug.alert("This app is in-development. Errors and in-stability are likely to occur. If you encounter freezing or other major issues, please let me know via my GitHub, <a href='https://github.com/genericallynamed'>github.com/genericallynamed</a>");
debug.notice("Due to optimization issues with HTML tables, it is recommended to not use a table with dimensions greater than 30 by 30.");
debug.info("Path Star v" + app_ver + " by Alex Shandilis");
var HoverHint = /** @class */ (function () {
    function HoverHint(elem) {
        this.hintActivated = false;
        this.elem = elem;
        this.elem.hintClass = this;
        elem.addEventListener("focus", function (e) {
            var ev = e;
            var el = e.currentTarget;
            el.hintClass.reveal_hint();
            ev.currentTarget.hintClass.activated = true;
        });
        elem.addEventListener("mouseover", function (e) {
            var ev = e;
            var el = e.currentTarget;
            if (ev.currentTarget.hintClass.hintActivated == undefined || !ev.currentTarget.hintClass.hintActivated) {
                el.hintClass.reveal_hint();
            }
        });
        elem.addEventListener("mouseleave", function (e) {
            var ev = e;
            ev.currentTarget.hintClass.activated = false;
            var el = e.currentTarget;
            el.hintClass.hide_hint();
        });
        elem.addEventListener("blur", function (e) {
            var ev = e;
            ev.currentTarget.hintClass.activated = false;
            var el = e.currentTarget;
            el.hintClass.hide_hint();
        });
    }
    HoverHint.prototype.reveal_hint = function () {
        if (!this.hintActivated && !this.elem.classList.contains("lock")) {
            this.hintActivated = true;
            if (this.hint_elem != undefined)
                this.hint_elem.remove();
            var e = document.createElement('div');
            var x = this.elem.offsetLeft + (this.elem.offsetWidth / 2);
            var y = this.elem.offsetTop - 10;
            var text;
            if (this.elem.hasAttribute("hover_warn")) {
                e.classList.add("warn");
                text = this.get_hint();
            }
            else if (this.elem.hasAttribute("hover_notice")) {
                e.classList.add("notice");
                text = this.get_hint();
            }
            else {
                text = this.get_hint();
            }
            if (this.elem.hasAttribute("hover_tag")) {
                text = text + "<i> —" + this.elem.getAttribute("hover_tag") + " </i>";
            }
            e.innerHTML = text;
            e.classList.add("hover_hint");
            e.style.position = "absolute";
            e.style.left = x + "px";
            e.style.top = y + "px";
            document.body.appendChild(e);
            this.hint_elem = e;
        }
    };
    HoverHint.prototype.hide_hint = function () {
        if (this.hintActivated) {
            this.hintActivated = false;
            this.hint_elem.classList.add("hidden");
            var el = this.hint_elem;
        }
    };
    HoverHint.prototype.get_hint = function () {
        return this.elem.getAttribute("hover_hint");
    };
    return HoverHint;
}());
var hint_elems = document.querySelectorAll("[hover_hint]");
var hints = [];
for (var i = 0; i < hint_elems.length; i++) {
    hints.push(new HoverHint(hint_elems[i]));
}
grid.activate_paint();
grid.create_floating_element();
var UserInterface = /** @class */ (function () {
    function UserInterface() {
        // pause-play behavior
        this.paused = false;
    }
    UserInterface.prototype.pause = function () {
        run_btn.firstElementChild.setAttribute("src", "icons/play.svg");
        this.enable(restart_btn);
        this.paused = true;
    };
    UserInterface.prototype.play = function () {
        run_btn.firstElementChild.setAttribute("src", "icons/pause.svg");
        this.enable(restart_btn);
        this.paused = false;
    };
    UserInterface.prototype.toggle_pause = function () {
        if (this.paused) {
            this.play();
        }
        else {
            this.pause();
        }
    };
    // general locks
    UserInterface.prototype.lock_all = function () {
    };
    UserInterface.prototype.unlock_all = function () {
    };
    UserInterface.prototype.customization_lock = function () {
        this.maze_gen_lock();
        this.path_gen_lock();
        this.dim_lock();
        this.design_lock();
    };
    UserInterface.prototype.customization_unlock = function () {
        this.maze_gen_unlock();
        this.path_gen_unlock();
        this.dim_unlock();
        this.design_unlock();
    };
    UserInterface.prototype.maze_gen_lock = function () {
        this.disable(randomize_btn);
        this.disable(maze_selector);
    };
    UserInterface.prototype.maze_gen_unlock = function () {
        this.enable(randomize_btn);
        this.enable(maze_selector);
    };
    UserInterface.prototype.path_gen_lock = function () {
        this.disable(gen_path_btn);
        this.disable(path_selector);
    };
    UserInterface.prototype.path_gen_unlock = function () {
        this.enable(gen_path_btn);
        this.enable(path_selector);
    };
    // specific locks
    UserInterface.prototype.lock_path_run_btn = function () {
    };
    UserInterface.prototype.unlock_path_run_btn = function () {
    };
    UserInterface.prototype.dim_lock = function () {
        this.disable(h_in);
        this.disable(w_in);
    };
    UserInterface.prototype.dim_unlock = function () {
        this.enable(h_in);
        this.enable(w_in);
    };
    UserInterface.prototype.undo_redo_lock = function () {
        this.undo_lock();
        this.redo_lock();
    };
    UserInterface.prototype.undo_redo_unlock = function () {
        this.undo_unlock();
        this.redo_unlock();
    };
    UserInterface.prototype.undo_lock = function () {
        this.disable(undo_btn);
    };
    UserInterface.prototype.undo_unlock = function () {
        this.enable(undo_btn);
    };
    UserInterface.prototype.redo_lock = function () {
        this.disable(redo_btn);
    };
    UserInterface.prototype.redo_unlock = function () {
        this.enable(redo_btn);
    };
    UserInterface.prototype.grid_lock = function () {
        grid.lock();
    };
    UserInterface.prototype.grid_unlock = function () {
        grid.unlock();
    };
    UserInterface.prototype.design_lock = function () {
        this.disable(clear_btn);
        this.disable(set_start_btn);
        this.disable(set_finish_btn);
        this.paint_btn_lock();
        this.grid_lock();
        this.undo_redo_lock();
        this.dim_lock();
    };
    UserInterface.prototype.design_unlock = function () {
        this.enable(clear_btn);
        this.enable(set_start_btn);
        this.enable(set_finish_btn);
        this.path_gen_unlock();
        this.maze_gen_unlock();
        this.paint_btn_unlock();
        this.grid_unlock();
        this.undo_redo_unlock();
        this.dim_unlock();
    };
    UserInterface.prototype.skip_btn_lock = function () {
        this.disable(skip_back_btn);
        this.disable(skip_next_btn);
    };
    UserInterface.prototype.skip_btn_unlock = function () {
        this.enable(skip_back_btn);
        this.enable(skip_next_btn);
    };
    UserInterface.prototype.restart_btn_lock = function () {
        this.disable(restart_btn);
    };
    UserInterface.prototype.restart_btn_unlock = function () {
        this.enable(restart_btn);
    };
    UserInterface.prototype.paint_btn_lock = function () {
        this.disable(paint_btn);
    };
    UserInterface.prototype.paint_btn_unlock = function () {
        this.enable(paint_btn);
    };
    UserInterface.prototype.set_play_btn_type = function (type) {
        this.enable(run_btn);
        if (type === 0) {
            run_btn.firstElementChild.setAttribute("src", "icons/play.svg");
            run_btn.onclick = function () { sim.play(); };
        }
        else if (type === 1) {
            run_btn.firstElementChild.setAttribute("src", "icons/runner.svg");
            run_btn.onclick = function () { sim.gen_path(); };
        }
        else if (type === 2) {
            run_btn.firstElementChild.setAttribute("src", "icons/randomize.svg");
            run_btn.onclick = function () { sim.gen_maze(); };
        }
    };
    UserInterface.prototype.disable = function (button) {
        button.disabled = true;
        button.tab_index = parseInt(button.getAttribute("tabindex"));
        button.setAttribute("tabIndex", -1);
        button.classList.add("lock");
    };
    UserInterface.prototype.enable = function (button) {
        button.disabled = false;
        button.setAttribute("tabIndex", button.tab_index);
        button.classList.remove("lock");
    };
    UserInterface.prototype.add_warning = function (button) {
        button.classList.add("warning");
        var warning_icon = document.createElement("img");
        warning_icon.classList.add("button_warning_icon");
        warning_icon.btn = button;
        warning_icon.setAttribute("src", "icons/warning.svg");
        button.warning_icon = warning_icon;
        warning_icon.style.position = "absolute";
        warning_icon.style.width = "1rem";
        warning_icon.style.height = "1rem";
        document.body.appendChild(warning_icon);
        warning_icon.style.left = (button.offsetWidth + button.offsetLeft - (warning_icon.offsetWidth * 0.6)) + "px";
        warning_icon.style.top = (button.offsetTop - (warning_icon.offsetHeight * 0.4)) + "px";
    };
    UserInterface.prototype.remove_warning = function (button) {
        button.classList.remove("warning");
        if (button.warning_icon !== undefined)
            button.w.remove();
    };
    UserInterface.prototype.add_notice = function (button) {
        button.classList.add("notice");
        var notice_icon = document.createElement("img");
        notice_icon.classList.add("button_notice_icon");
        notice_icon.btn = button;
        notice_icon.setAttribute("src", "icons/notice_filled.svg");
        button.n_icon = notice_icon;
        notice_icon.style.position = "absolute";
        notice_icon.style.width = "1rem";
        notice_icon.style.height = "1rem";
        document.body.appendChild(notice_icon);
        notice_icon.style.left = (button.offsetWidth + button.offsetLeft - (notice_icon.offsetWidth * 0.6)) + "px";
        notice_icon.style.top = (button.offsetTop - (notice_icon.offsetHeight * 0.4)) + "px";
    };
    UserInterface.prototype.remove_notice = function (button) {
        button.classList.remove("notice");
        if (button.n_icon !== undefined)
            button.n_icon.remove();
    };
    UserInterface.prototype.create_load_animation = function (container_elem) {
        var anim_container = document.createElement("div");
        anim_container.classList.add("anim_elem");
        var container = container_elem;
        anim_container.style.borderRadius = getComputedStyle(container).borderRadius;
        anim_container.style.width = container.offsetWidth + "px";
        anim_container.style.height = container.offsetHeight + "px";
        anim_container.style.left = container.offsetLeft + "px";
        anim_container.style.top = container.offsetTop + "px";
        var anim_elem = document.createElement('div');
        anim_elem.classList.add("anim_elem_i");
        anim_container.appendChild(anim_elem);
        document.body.appendChild(anim_container);
    };
    return UserInterface;
}());
ui = new UserInterface();
grid.set_ui(ui);
// grid configurations
// ui.create_load_animation(randomize_btn);
grid.set_start(1, 1);
grid.set_finish(5, 5);
ui.restart_btn_lock();
ui.disable(restart_btn);
ui.disable(stop_btn);
ui.skip_btn_lock();
// ui.add_warning(gen_path_btn);
function add_warn(button) {
    ui.add_warning(button);
}
function remove_warn(button) {
    ui.remove_warning(button);
}
