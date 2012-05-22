STK.register("tool.util.listener",
function(f) {
    var g = {},
    b = {},
    k = "CUSTOM_RID",
    l = 0,
    a = Object.prototype.toString,
    j = {},
    e = function(m) {
        var n;
        for (n in m) {
            break
        }
        return ! n
    },
    h = function(m) {
        m = m === window ? j: m;
        if (!/^\[object (Number|String)\]$/.test(a.call(m))) {
            m = m[k] || (m[k] = ++l)
        }
        return m
    };
    g.defined = function(m, o) {
        var n;
        if (! (n = b[h(m)])) {
            return false
        }
        if (! (n = n[o])) {
            return false
        }
        return ! e(n)
    };
    g.remove = function(m, o, n) {
        m = h(m);
        if (! (d = b[m])) {
            return
        }
        if (n) {
            d = d[o];
            if (n[k] == null || !d) {
                return
            }
            delete d[n[k]];
            e(d) && g.remove(m, o);
            return
        }
        if (o) {
            delete d[o];
            e(d) && g.remove(m);
            return
        }
        delete b[m]
    };
    g.register = function(m, p, o) {
        if (typeof o !== "function") {
            return
        }
        m = h(m);
        var n = h(o);
        c = b[m] = b[m] || {};
        c = c[p] = c[p] || {};
        c[n] = c[n] || o
    };
    g.fire = function(n, q) {
        var p = h(n);
        if (g.defined(p, q)) {
            var r = b[p][q],
            o = [];
            Array.prototype.push.apply(o, arguments);
            o.splice(0, 2);
            o.length === 0 && (o = [n, q]);
            for (var m in r) {
                r[m].apply(null, o)
            }
        }
    };
    return g
});
STK.register("module.suggest",
function(a) {
    return function(f, h, k) {
        var e = {
            fie: false,
            index: 0,
            width: "",
            height: "",
            panelClass: "",
            container: document.body,
            timer: 20,
            defValue: ""
        };
        a.parseParam(e, h || {});
        var g = 0;
        k.poll = k.poll || null;
        var l = {};
        l.layer = null,
        l.panel = null,
        l.frame = null,
        l.input = f,
        l.pars = e,
        l.timer = null;
        var b = ((/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent) || {
            1 : 7
        })[1] < 7);
        var j = {
            init: function() {
                if (!l.layer) {
                    var m = j.build();
                    l.layer = m.layer;
                    l.panel = m.panel
                }
                l.input.value = e.defValue;
                j.bind()
            },
            poll: function(m) {
                switch (m.type) {
                case "focus":
                    if (!l.timer) {
                        l.timer = a.timer.add(function() {
                            j.timerAdd()
                        })
                    }
                    a.timer.play(l.timer);
                    if (e.fie && b && l.frame == null) {
                        j.ieFrame()
                    }
                    break;
                case "blur":
                    a.timer.pause(l.timer);
                    setTimeout(function() {
                        j.hide()
                    },
                    500);
                    break
                }
            },
            ieFrame: function() {
                l.frame = a.C("iframe");
                l.frame.style.cssText = "z-index:-1;position:absolute;filter:alpha(opacity=0);";
                a.setStyle(l.frame, "width", e.width);
                a.setStyle(l.frame, "height", e.height);
                l.layer.insertBefore(l.frame, l.panel)
            },
            resetFrame: function() {
                var m = a.position(l.layer);
                a.setStyle(l.frame, "width", l.layer.clientWidth + "px");
                a.setStyle(l.frame, "height", l.layer.clientHeight + "px")
            },
            timerAdd: function() {
                if (g >= e.timer) {
                    k.poll();
                    g = 0
                }
                g++
            },
            build: function() {
                var n = a.C("div");
                a.addClassName(n, e.panelClass);
                a.setStyle(n, "zIndex", e.index);
                a.setStyle(n, "width", e.width);
                a.setStyle(n, "height", e.height);
                a.setStyle(n, "position", "absolute");
                a.setStyle(n, "display", "none");
                var m = a.C("div");
                m.setAttribute("node-type", "panel");
                n.appendChild(m);
                e.container.appendChild(n);
                return {
                    layer: n,
                    panel: m
                }
            },
            setPos: function() {
                var o = l.input;
                var m = a.position(o);
                var n = o.offsetHeight;
                a.setStyle(l.layer, "top", m.t + n + "px");
                a.setStyle(l.layer, "left", m.l + "px")
            },
            hide: function() {
                a.setStyle(l.layer, "display", "none")
            },
            show: function() {
                if (e.defValue != l.input.value) {
                    j.setPos();
                    a.setStyle(l.layer, "display", "");
                    e.fie && b && j.resetFrame()
                }
            },
            bind: function() {
                a.addEvent(l.input, "focus",
                function(m) {
                    k.poll && j.poll(m)
                });
                a.addEvent(l.input, "blur",
                function(m) {
                    k.poll && j.poll(m)
                })
            }
        };
        j.init();
        return {
            init: function() {
                j.init()
            },
            startPoll: function() {
                a.timer.play(l.timer)
            },
            stopPoll: function() {
                a.timer.pause(l.timer)
            },
            getPanel: function() {
                return l.panel
            },
            getLayer: function() {
                return l.layer
            },
            show: function(m) {
                m && m(l);
                j.show()
            },
            hide: function(m) {
                m && m(l);
                j.hide()
            },
            value: function(m) {
                if (m) {
                    l.input && (l.input.value = m)
                } else {
                    return l.input.value
                }
            }
        }
    }
});
STK.register("common.suggest",
function(a) {
    return function(e, b, h) {
        var j = a.tool.util.listener,
        g = {};
        b.keyEventType = b.keyEventType || "keydown";
        b.type = b.type || "json";
        b.onClass = b.onClass || "";
        b.panelClass = b.panelClass || "";
        b.lockValue = false || b.lockValue;
        b.itemClick = b.itemClick || null;
        h.selected = h.selected || null;
        h.setPars = h.setPars ||
        function() {};
        var l = {};
        l.list = [],
        l.selectedItem = null,
        l.panel = {},
        _tmpCon = null;
        h.poll = function() {
            if (k.value() != "" && b.defValue != k.value()) {
                k.stopPoll();
                k.hide();
                f.clearPanel();
                var m = l.panel[k.value()];
                if (m) {
                    l.list = a.selector("li", m);
                    f.selectedItem(m.childNodes[0]);
                    k.getPanel().appendChild(m);
                    k.show()
                } else {
                    h.onComplete()
                }
            } else {
                k.hide()
            }
        };
        var k = null;
        var f = {
            init: function() {
                k = a.module.suggest(e, b, h);
                j.register(g, "setPars", h.setPars);
                j.register(g, "onComplete", f.onComplete);
                a.addEvent(e, b.keyEventType, f.listAction);
                _tmpCon = a.C("div");
                _tmpCon.style.display = "none";
                document.body.appendChild(_tmpCon)
            },
            build: function(p) {
                var s = a.C("ul");
                if (b.type == "html") {
                    var o = a.builder(p);
                    l.list = o.list.option;
                    s.appendChild(o.box)
                } else {
                    l.list = [];
                    for (var n = 0,
                    m = p.length; n < m; n++) {
                        var r = p[n];
                        var q = a.C("li");
                        q.innerHTML = r.text;
                        q.setAttribute("item_id", r.value);
                        l.list.push(q);
                        s.appendChild(q)
                    }
                }
                k.getPanel().appendChild(s);
                l.panel[k.value()] = s;
                f.itemEvent();
                f.selectedItem(l.list[0]);
                if (s.childNodes.length > 0) {
                    k.show()
                }
            },
            clearPanel: function() {
                k.getLayer().className = b.panelClass;
                var m = k.getPanel();
                m.childNodes[0] && _tmpCon.appendChild(m.childNodes[0])
            },
            itemEvent: function() {
                var o = l.list;
                for (var n = 0,
                m = o.length; n < m; n++) {
                    var p = o[n];
                    a.setStyle(p, "cursor", "pointer");
                    a.hasClassName(p, b.onClass) && (l.selectedItem = o[n]);
                    a.addEvent(p, "mouseover", (function(q) {
                        return function(r) {
                            if (a.contains(q, a.fixEvent(r).target)) {
                                return
                            }
                            f.selectedItem(q)
                        }
                    })(p));
                    a.addEvent(p, "click", f.itemClick)
                }
            },
            selectedItem: function(m) {
                l.selectedItem && a.removeClassName(l.selectedItem, b.onClass);
                l.selectedItem = m;
                l.selectedItem && a.addClassName(l.selectedItem, b.onClass)
            },
            itemHover: function(n) {
                var m = n.target || n.srcElement;
                f.selectedItem(m)
            },
            itemClick: function(n) {
                var m = n.target || n.srcElement;
                f.selectedItem(m);
                if (typeof b.itemClick === "function") {
                    b.itemClick(g, l.selectedItem);
                    return
                }
                l.selectedItem && f.setValue();
                k.hide()
            },
            setValue: function() { ! b.lockValue && k.value(l.selectedItem ? l.selectedItem.innerHTML: "");
                h.selected && h.selected(l.selectedItem)
            },
            listAction: function() {
                var n = a.getEvent();
                var o = true;
                var m = {
                    left: 37,
                    right: 39,
                    enter: 13,
                    up: 38,
                    down: 40
                };
                switch (n.keyCode) {
                case m.enter:
                    a.stopEvent();
                    if (typeof b.itemClick === "function") {
                        b.itemClick(g, l.selectedItem);
                        return
                    }
                    if (l.selectedItem && k.value() == l.selectedItem.innerHTML) {
                        return
                    }
                    f.setValue();
                    o = false;
                    break;
                case m.down:
                    a.stopEvent();
                    l.selectedItem && a.removeClassName(l.selectedItem, b.onClass);
                    if (!l.selectedItem) {
                        l.selectedItem = l.list[0]
                    } else {
                        if (a.domNext(l.selectedItem)) {
                            l.selectedItem = a.domNext(l.selectedItem)
                        } else {
                            l.selectedItem = l.list[0]
                        }
                    }
                    a.addClassName(l.selectedItem, b.onClass);
                    o = false;
                    break;
                case m.up:
                    a.stopEvent();
                    l.selectedItem && a.removeClassName(l.selectedItem, b.onClass);
                    if (!l.selectedItem) {
                        l.selectedItem = l.list[0]
                    } else {
                        if (a.domPrev(l.selectedItem)) {
                            l.selectedItem = a.domPrev(l.selectedItem)
                        } else {
                            l.selectedItem = l.list[l.list.length - 1]
                        }
                    }
                    a.addClassName(l.selectedItem, b.onClass);
                    o = false;
                    break;
                case m.left:
                    o = false;
                    break;
                case m.right:
                    o = false;
                    break
                }
                o && k.startPoll()
            },
            onComplete: function(m) {
                if (k.value() != "" && b.defValue != k.value()) {
                    f.build(m)
                }
            },
            fire: function(n, m) {
                m = m || {};
                n && j.fire(g, n, m)
            }
        };
        f.init();
        g.startPoll = k.startPoll;
        g.stopPoll = k.stopPoll;
        g.show = k.show;
        g.hide = k.hide;
        g.fire = f.fire;
        g.getSelected = function() {
            return {
                id: l.selectedItem.getAttribute("item_id") || "",
                value: k.value,
                object: l.selectedItem
            }
        };
        g.getPanel = k.getPanel;
        g.clear = f.clearPanel;
        g.value = k.value;
        return g
    }
});
STK.register("module.input",
function(b) {
    var a = b.tool.util.listener;
    return function(f, j, h) {
        var m = {};
        var g = b.parseParam({
            defValue: "",
            sucClass: "",
            errClass: "",
            focClass: ""
        },
        j || {});
        var l = b.parseParam({
            sucClass: null,
            errClass: null,
            focClass: null
        },
        h || {});
        var e = {
            className: "",
            style: ""
        };
        var k = {
            init: function() {
                g.initValue = g.value = f.value;
                if (k.isEmpty(f.value)) {
                    f.value = g.defValue
                }
                e.className = f.className;
                e.style = f.style.cssText;
                b.addEvent(f, "blur", k.blur);
                b.addEvent(f, "focus", k.focus);
                b.addEvent(f, "keyup", k.keyup);
                k.regListener()
            },
            isEmpty: function(n) {
                return /^\s*$/g.test(n.replace(/^\s+|\s+$/g, ""))
            },
            blur: function() {
                if (k.isEmpty(f.value)) {
                    f.value = g.defValue
                }
                k.recoverStyle();
                l.blurClass && l.blurClass(f);
                a.fire(m, "blur", f.value)
            },
            focus: function() {
                g.defValue == f.value && (f.value = "");
                k.recoverStyle();
                b.addClassName(f, g.focClass);
                l.focClass && l.focClass(f);
                a.fire(m, "focus", f.value)
            },
            keyup: function() {
                a.fire(m, "keyup", f.value)
            },
            error: function(n) {
                k.recoverStyle();
                b.addClassName(f, g.errClass);
                l.errClass && l.errClass(f)
            },
            success: function(n) {
                k.recoverStyle();
                b.addClassName(f, g.sucClass);
                l.sucClass && l.sucClass(f)
            },
            recoverStyle: function() {
                f.className = e.className;
                f.style.cssText = e.style
            },
            fire: function(o, n) {
                o && a.fire(m, o, n)
            },
            regListener: function() {
                a.register(m, "error", k.error);
                a.register(m, "success", k.success)
            },
            value: function(n) {
                if (n != null) {
                    f.value = g.value = n
                }
                return (f.value == g.defValue) ? "": f.value
            },
            reset: function() {
                k.recoverStyle();
                f.value = g.initValue || g.defValue
            },
            defValue: function(n) {
                if (n != null) {
                    g.value = n;
                    g.defValue = n
                } else {
                    return g.defValue
                }
            },
            isChange: function() {
                return (g.initValue != k.value())
            }
        };
        m.fire = k.fire;
        m.input = f;
        m.recoverStyle = k.recoverStyle;
        m.value = k.value;
        m.reset = k.reset;
        m.defValue = k.defValue;
        m.isChange = k.isChange;
        k.init();
        return m
    }
});
STK.register("common.language",
function(a) {
    window.$LANGUAGE || (window.$LANGUAGE = {});
    return function(b) {
        return a.core.util.language(b, $LANGUAGE)
    }
});
STK.register("comp.search",
function(a) {
    var b = a.common.language;
    return function(h) {
        var g = a.parseParam({
            input: null,
            button: null,
            suggest: true,
            lockValue: true,
            defValue: "",
            panelClass: "resultTip",
            onClass: "cur",
            type: "html",
            width: ""
        },
        h || {});
        var m = {
            S00001: b("#L{含}"),
            S00002: b("#L{的微博}"),
            S00003: b("#L{的人}")
        };
        var k = {},
        f = null,
        e = null;
        var l = {
            feed: "/k/",
            user: "/search/user.php?search="
        };
        var j = {
            init: function() {
                f = a.module.input(g.input, {
                    defValue: g.defValue
                });
                if (g.suggest) {
                    e = a.common.suggest(g.input, g, {
                        selected: j.selected,
                        onComplete: j.onComplete
                    });
                    var o = a.C("span");
                    o.innerHTML = "请选择搜索的微博";
                    var n = e.getPanel();
                    n.parentNode.insertBefore(o, n)
                }
                a.addEvent(g.button, "click", j.doSearch)
            },
            selected: function(n) {
                var o = n.tagName.toLowerCase() == "cite" ? n: a.selector("cite", n)[0];
                window.location.href = o.getAttribute("href") + e.value() + "&Refer=Setting_header"
            },
            onComplete: function() {
                var o = f.value();
                if (a.bLength(o) > 16) {
                    o = a.leftB(o, 16) + "..."
                }
                var n = '<li node-type="option">' + m.S00001 + '<cite href="' + l.feed + '">' + o + "</cite>" + m.S00002 + '</li>							<li node-type="option">' + m.S00001 + '<cite href="' + l.user + '">' + o + "</cite>" + m.S00003 + "</li>";
                e.fire("onComplete", n)
            },
            doSearch: function() {
                a.stopEvent();
                if (f.value() !== "") {
                    window.location.href = l.feed + f.value() + "&Refer=Setting_header"
                } else {
                    f.input.focus()
                }
            }
        };
        j.init();
        k.value = f.value;
        return k
    }
});
STK.jobsM.register("job.search",
function(e) {
    var h = e.common.language;
    var f = {
        S00001: h("#L{搜索微博、找人}"),
        S00002: h("#L{找人}")
    };
    var g = $CONFIG.$FW == 0 && true;
    var a = {
        defValue: g ? f.S00001: f.S00002,
        width: e.E("m_keyword").offsetWidth + "px",
        input: e.E("m_keyword"),
        button: e.E("m_submit"),
        suggest: g
    };
    var b = e.comp.search(a)
});
STK.register("module.layer",
function(a) {
    var b = function(f) {
        var e = {};
        if (f.style.display == "none") {
            f.style.visibility = "hidden";
            f.style.display = "";
            e.w = f.offsetWidth;
            e.h = f.offsetHeight;
            f.style.display = "none";
            f.style.visibility = "visible"
        } else {
            e.w = f.offsetWidth;
            e.h = f.offsetHeight
        }
        return e
    };
    return function(f) {
        var j = a.core.dom.builder(f.template);
        var e = (new Date()).getTime() + "" + Math.random() * Math.pow(10, 17);
        var h = {};
        var k = a.core.dom.cascadeNode(j.list.inner[0]);
        var g = null;
        h.show = function() {
            j.list.outer[0].style.display = "";
            return h
        };
        h.hide = function() {
            j.list.outer[0].style.display = "none";
            return h
        };
        h.getPosition = function(o) {
            o = o || "topleft";
            var l = true;
            var n = null;
            var p = j.list.outer[0];
            if (p.style.display == "none") {
                p.style.visibility = "hidden";
                p.style.display = "";
                n = a.core.dom.position(p);
                p.style.display = "none";
                p.style.visibility = "visible"
            } else {
                n = a.core.dom.position(p)
            }
            var m = b(p);
            if (o === "topleft") {} else {
                if (o === "topright") {
                    n.l = n.l + m.w
                } else {
                    if (o === "bottomleft") {
                        n.t = n.t + m.h
                    } else {
                        if (o === "bottomright") {
                            n.l = n.l + m.w;
                            n.t = n.t + m.h
                        }
                    }
                }
            }
            return n
        };
        h.getSize = function(l) {
            if (l || !g) {
                g = b.apply(h, j.list.outer)
            }
            return g
        };
        h.html = function(l) {
            if (typeof l !== "string") {
                throw "layer's html function need string as arguments"
            }
            k.html(l);
            return h
        };
        h.text = function(l) {
            if (typeof l !== "string") {
                throw "layer's text function need string as arguments"
            }
            k.ttext(l);
            return h
        };
        h.appendChild = function(l) {
            j.list.inner[0].appendChild(l);
            return h
        };
        h.set = function(l, m) {
            return h
        };
        h.get = function(l) {
            if (l === "sourceid") {
                return e
            }
            if (l === "parentNode") {
                return j.list.outer[0].parentNode
            }
            if (l === "domList") {
                return j.list
            }
            if (l === "outer") {
                return j.list.outer[0]
            }
            if (l === "inner") {
                return j.list.inner[0]
            }
            return j.list[l]
        };
        h.getDom = function(m, l) {
            return j.list[m][l || 0]
        };
        h.getCascadeDom = function(m, l) {
            return a.core.dom.cascadeNode(j.list[m][l || 0])
        };
        return h
    }
});
STK.register("module.dialog",
function(a) {
    return function(b) {
        var g = a.module.layer({
            template: b.template
        });
        var j = g.get("outer");
        j.style.display = "none";
        j.style.position = "absolute";
        j.style.zIndex = b.zIndex || 1000;
        a.foreach(["boxShadow", "webkitBoxShadow", "MozBoxShadow", "mozBoxShadow", "oBoxShadow", "msBoxShadow"],
        function(l) {
            j.style[l] = "0px 0px 100px #FFFFFF"
        });
        document.body.appendChild(j);
        var k = g.getDom("close");
        var f = function() {
            g.hide();
            if (typeof b.onClose === "function") {
                b.onClose()
            }
        };
        var e = function() {
            g.show();
            if (typeof b.onOpen === "function") {
                b.onOpen()
            }
        };
        if (k) {
            a.core.evt.addEvent(k, "click", f)
        }
        var h = {};
        h.setMiddle = function() {
            var l = a.core.util.winSize();
            var m = g.getSize(true);
            j.style.top = a.core.util.scrollPos()["top"] + (l.height - m.h) / 2 + "px";
            j.style.left = (l.width - m.w) / 2 + "px";
            return h
        };
        h.setPosition = function(l) {
            j.style.top = l.t + "px";
            j.style.left = l.l + "px";
            return h
        };
        h.setContent = function(m) {
            var l = g.get("inner");
            while (l.childNodes.length) {
                l.removeChild(l.childNodes[0])
            }
            l.appendChild(m)
        };
        h.close = function() {
            f();
            return h
        };
        h.open = function() {
            e();
            return h
        };
        h.show = g.show;
        h.hide = g.hide;
        h.html = g.html;
        h.text = g.text;
        h.get = g.get;
        h.set = g.set;
        h.getPosition = g.getPosition;
        h.appendChild = g.appendChild;
        h.getSize = g.getSize;
        h.getDom = g.getDom;
        h.getCascadeDom = g.getCascadeDom;
        a.core.obj.cascade(h, ["show", "hide", "set", "appendChild"]);
        return h
    }
});
STK.register("tool.dom.drag",
function(a) {
    return function(f) {
        var k = {};
        var e = {};
        var j = function(m) {
            var l = a.core.dom.position(f.actionEl);
            l.clientX = m.clientX;
            l.clientY = m.clientY;
            f.onstart(l);
            document.body.onselectstart = function() {
                return false
            };
            a.core.evt.addEvent(document, "mousemove", b);
            a.core.evt.addEvent(document, "mouseup", h);
            a.core.evt.addEvent(document, "click", g, true);
            if (!a.IE) {
                m.preventDefault();
                m.stopPropagation()
            }
            return false
        };
        var b = function(m) {
            var l = {};
            l.clientX = m.clientX;
            l.clientY = m.clientY;
            f.ondrag(l);
            m.cancelBubble = true
        };
        var h = function(m) {
            var l = {};
            l.clientX = m.clientX;
            l.clientY = m.clientY;
            f.onend(l);
            document.body.onselectstart = function() {
                return true
            };
            a.core.evt.removeEvent(document, "mousemove", b);
            a.core.evt.removeEvent(document, "mouseup", h);
            a.core.evt.removeEvent(document, "click", g, true)
        };
        var g = function(l) {
            l.cancelBubble = true;
            return false
        };
        a.core.evt.addEvent(f.actionEl, "mousedown", j);
        return k
    }
});
STK.register("module.dragLayer",
function(a) {
    return function(r) {
        var s = r.layer;
        var h = s.getDom("outer");
        var p = h;
        if (r.dragtype === "none") {
            return s
        }
        var n = {};
        var f = function(t) {
            r.onStart && r.onStart()
        };
        var b = function(t) {
            if (typeof r.onmoving == "function") {
                r.onmoving({
                    t: n.t + (t.clientY - n.clientY),
                    l: n.l + (t.clientX - n.clientX)
                })
            }
        };
        var j = function() {
            r.onEnd && r.onEnd()
        };
        if (r.dragtype === "perch") {
            var m = a.C("div");
            var g = false;
            var k = false;
            m.style.cssText = r.perchstyle || "border:solid #999999 2px";
            m.style.position = "absolute";
            p = m;
            f = function(u) {
                m.style.zIndex = h.style.zIndex + 10;
                var t = s.getSize();
                m.style.width = t.w + "px";
                m.style.height = t.h + "px";
                m.style.left = u.l + "px";
                m.style.top = u.t + "px";
                k = true;
                setTimeout(function() {
                    if (k) {
                        document.body.appendChild(m);
                        g = true
                    }
                },
                200);
                r.onStart && r.onStart()
            };
            j = function(t) {
                k = false;
                h.style.top = m.style.top;
                h.style.left = m.style.left;
                if (g) {
                    document.body.removeChild(m);
                    g = false
                }
                b(t);
                r.onEnd && r.onEnd()
            }
        }
        var o = function(u) {
            var t = a.core.dom.position(h);
            f(t);
            n = t;
            n.clientX = u.clientX;
            n.clientY = u.clientY;
            if (typeof p.setCapture === "function") {
                p.setCapture()
            }
        };
        var e = function(t) {
            j(t);
            if (typeof p.setCapture === "function") {
                p.releaseCapture()
            }
        };
        var q = function(w) {
            var u = a.core.util.pageSize()["page"];
            var v = n.t + (w.clientY - n.clientY);
            var t = n.l + (w.clientX - n.clientX);
            if (v + s.getSize()["h"] >= (u.height - 5)) {
                p.style.top = (u.height - s.getSize()["h"] - 5) + "px"
            } else {
                if (v > 0) {
                    p.style.top = v + "px"
                } else {
                    p.style.top = 0 + "px"
                }
            }
            if (t + s.getSize()["w"] >= (u.width - 5)) {
                p.style.left = (u.width - s.getSize()["w"] - 5) + "px"
            } else {
                if (t > 0) {
                    p.style.left = t + "px"
                } else {
                    p.style.left = 0 + "px"
                }
            }
            if (r.dragtype !== "perch") {
                b(w)
            }
        };
        var l = a.tool.dom.drag({
            actionEl: r.act ? r.act: h,
            onstart: o,
            onend: e,
            ondrag: q
        })
    }
});
STK.register("module.mask",
function(a) {
    var b = document,
    e = b.documentElement || {};
    return function(l) {
        var m = a.parseParam({
            zIndex: 999,
            opacity: 0.35,
            backgroundColor: "#000000"
        },
        l || {});
        var j = {},
        w = a.C("div"),
        v = ["background-color:", m.backgroundColor].join(""),
        t = ((/MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent) || {
            1 : 7
        })[1] < 7),
        h = t ? 0 : m.opacity,
        g = ["filter:alpha(opacity=", h * 100, ");opacity:", h].join(""),
        z = "position:fixed;left:0px;top:0px",
        u = "visibility:hidden",
        r = ["z-index:", m.zIndex].join(""),
        s = {},
        p = {},
        x = false,
        n,
        A,
        k,
        q,
        o;
        var f = function() {
            var B = a.pageSize().win;
            if (p.width != B.width || p.height != B.height) {
                q = ["width:", (p.width = B.width), "px;height:", (p.height = B.height), "px"].join("")
            }
        };
        var y = function() {
            var B = a.scrollPos();
            if (!t) {
                k = z;
                return
            }
            if (s.top != B.top || s.left != B.left) {
                k = ["position:absolute;top:", (s.top = B.top), "px;left:", (s.left = B.left), "px"].join("")
            }
        };
        o = function() {
            clearTimeout(A);
            A = setTimeout(function() {
                f();
                y();
                n && (n.style.cssText = [u, k, q, r - 1, g].join(";"));
                w.style.cssText = [u, k, q, v, g, r].join(";")
            },
            200)
        };
        j.show = function() {
            u = "visibility:visible";
            o();
            a.addEvent(window, "resize", o);
            a.addEvent(window, "scroll", o)
        };
        j.hidden = function() {
            u = "visibility:hidden";
            o();
            a.removeEvent(window, "resize", o);
            a.removeEvent(window, "scroll", o)
        };
        t && (function() {
            n = a.C("iframe");
            n.src = "about:blank";
            b.body.appendChild(n)
        })();
        b.body.appendChild(w);
        return j
    }
});
STK.register("module.flyLayer",
function(a) {
    return function(n) {
        var j = a.parseParam({
            startRect: null,
            endRect: null,
            style: "border:solid #333 1px;background-color:#fff",
            onFlyEnd: function() {}
        },
        n || {});
        var m = false;
        var e = [];
        var b = 6;
        for (var g = 0; g < b; g += 1) {
            var f = {
                l: j.startRect.l + (j.endRect.l - j.startRect.l) * g / b,
                t: j.startRect.t + (j.endRect.t - j.startRect.t) * g / b,
                w: j.startRect.w + (j.endRect.w - j.startRect.w) * g / b,
                h: j.startRect.h + (j.endRect.h - j.startRect.h) * g / b
            };
            e.push(j.style + a.templet(";width:#{w}px;height:#{h}px;left:#{l}px;top:#{t}px;", f) + "position:absolute;opacity:" + ((0.4) + (0.4) * g / b) + ";filter:alpha(opacity=" + 50 + ");")
        }
        var l = 0;
        var k = a.C("DIV");
        var h = true;
        document.body.appendChild(k);
        var o = a.timer.add(function() {
            if (l >= e.length) {
                a.timer.remove(o);
                document.body.removeChild(k);
                j.onFlyEnd();
                return true
            }
            k.style.cssText = e[l];
            l += 1
        })
    }
});
STK.register("common.dialog",
function(b) {
    var a = '<table class="mBlogLayer" node-type="outer">		<tr><td class="top_l"></td><td class="top_c"></td><td class="top_r"></td></tr>		<tr>			<td class="mid_l"></td>			<td class="mid_c">				<div class="layerBox">					<div class="layerBoxTop">						<div node-type="title" class="topCon">							<strong node-type="titlestring"></strong>							<a href="javascript:void(0)" class="close" node-type="close" title="#L{关闭}"></a>							<div class="clearit"></div>						</div>					</div>					<div class="layerBoxCon" style="height:auto; width:390px;" node-type="inner"></div>				</div>			</td>			<td class="mid_r"></td>		</tr>		<tr><td class="bottom_l"></td><td class="bottom_c"></td><td class="bottom_r"></td></tr>	</table>';
    return function(g) {
        var e = b.module.mask();
        var j = [];
        if (g.onOpen) {
            j.push("onOpen")
        }
        if (g.onClose) {
            j.push("onClose")
        }
        var f = b.core.obj.sup(g, j);
        g.onOpen = function() {
            if (f.onOpen) {
                f.onOpen.apply(this, arguments)
            }
            e.show()
        };
        g.onClose = function() {
            if (f.onClose) {
                f.onClose.apply(this, arguments)
            }
            e.hidden()
        };
        g.template = b.common.language(a);
        var l = b.module.dialog(g);
        var k = l.getDom;
        b.module.dragLayer({
            layer: l,
            dragtype: g.dragtype || "perch",
            act: k("title"),
            perchstyle: null,
            onmoving: g.onMoving || null,
            onStart: g.onMoveStart || null,
            onEnd: g.onMoveEnd || null
        });
        var h = b.core.obj.sup(l, ["open", "close", "getPosition", "getSize"]);
        l.open = function(r) {
            if (r === false) {
                h.open()
            } else {
                if (r) {
                    var q = b.position(r);
                    var p = {
                        l: q.l,
                        t: q.t,
                        w: r.offsetWidth,
                        h: r.offsetHeight
                    }
                } else {
                    var o = b.winSize();
                    var p = {
                        l: 0,
                        t: document.documentElement.scrollTop,
                        w: o.width,
                        h: o.height
                    }
                }
                var n = h.getPosition();
                var s = h.getSize();
                var m = {
                    l: n.l,
                    t: n.t,
                    w: s.w,
                    h: s.h
                };
                b.module.flyLayer({
                    startRect: p,
                    endRect: m,
                    onFlyEnd: function() {
                        h.open()
                    }
                })
            }
            return l
        };
        l.close = function(m) {
            h.close();
            return l
        };
        return l
    }
});
STK.register("common.customDialog",
function(a) {
    return function(f) {
        var g = a.module.layer({
            template: f.template
        });
        var k = a.common.dialog({
            zIndex: f.zIndex,
            onClose: f.onClose,
            onOpen: f.onOpen,
            onMoving: f.onMoving,
            onMoveStart: f.onMoveStart,
            onMoveEnd: f.onMoveEnd,
            dragtype: f.dragtype,
            perchstyle: f.perchstyle
        });
        k.setContent(g.get("outer"));
        var e = a.core.obj.sup(k, ["setContent", "getDom", "get", "getCascadeDom"]);
        var b = function(l) {
            a.core.dom.cascadeNode(e.getDom("titlestring")).ttext(l);
            return h
        };
        var j = function(l) {
            e.getDom("inner").style.cssText = l
        };
        b(f.title || "");
        if (typeof f.style === "string") {
            j(f.style)
        }
        var h = k;
        h.setContent = function(m) {
            var l = g.get("inner");
            while (l.childNodes.length) {
                l.removeChild(l.childNodes[0])
            }
            l.appendChild(m);
            return h
        };
        h.getDom = function(l) {
            if (l === "close" || l === "title") {
                return e.getDom(l)
            }
            return g.getDom(l)
        };
        h.getCascadeDom = function(l) {
            if (l === "close" || l === "title") {
                return e.getCascadeDom(l)
            }
            return g.getCascadeDom(l)
        };
        h.get = function(l) {
            if (l.indexOf("_dia_") === 0) {
                return e.get(l.slice(4))
            }
            return g.get(l)
        };
        h.set = g.set;
        h.html = g.html;
        h.text = g.text;
        h.appendChild = g.appendChild;
        h.setTitle = function(l) {
            b(l);
            return h
        };
        h.setIndex = function(l) {
            a.core.dom.cascadeNode(e.getDom("outer")).style.zIndex = l;
            return h
        };
        h.setStyle = function(l) {
            j(l);
            return h
        };
        a.core.obj.cascade(h, ["set", "appendChild"]);
        return h
    }
});
STK.register("common.confirm",
function(g) {
    var b = '<div class="commonLayer2" node-type="outer">		<div class="layerL"><img node-type="icon" src="' + $CONFIG.$BASECSS + 'style/images/common/PY_ib.gif" class="PY_ib PY_ib_3"></div>		<div style="width: 284px;" class="layerR">			<p class="txt font_14" node-type="inner"></p>			<div class="MIB_btn">				<a href="javascript:void(0);" class="btn_normal" node-type="apply"><em node-type="okLabel">确定</em></a>				<a href="javascript:void(0);" class="btn_notclick" node-type="cancel"><em node-type="cancelLabel">取消</em></a>			</div>		</div>		<div class="clearit"></div>	</div>';
    var a = {
        warning: "PY_ib PY_ib_1",
        error: "PY_ib PY_ib_2",
        success: "PY_ib PY_ib_3",
        doubt: "PY_ib PY_ib_4"
    };
    var f = [];
    var h = function() {
        var j = {};
        var k = null;
        j.template = b;
        j.onOpen = function() {
            k.inUsed = true
        };
        j.onClose = function() {
            if (k.cancelFunction && !k.applyClick) {
                k.cancelFunction()
            }
            k.cancelFunction = null;
            k.applyFunction = null;
            k.applyClick = null;
            k.inUsed = false
        };
        k = g.common.customDialog(j);
        k.okLabel = function(l) {
            k.getDom("okLabel").innerHTML = l
        };
        k.cancelLabel = function(l) {
            k.getDom("cancelLabel").innerHTML = l
        };
        g.addEvent(k.getDom("cancel"), "click",
        function() {
            k.close();
            return false
        });
        g.addEvent(k.getDom("apply"), "click",
        function() {
            k.applyClick = true;
            if (k.applyFunction) {
                k.applyFunction()
            }
            k.close();
            return false
        });
        return k
    };
    var e = function() {
        for (var j = 0; j < f.length; j += 1) {
            if (!f[j]["inUsed"]) {
                return f[j]
            }
        }
        var k = h();
        f.push(k);
        return k
    };
    return function(j) {
        if (typeof j === "string") {
            var l = j;
            j = {
                text: l
            }
        }
        var k = e();
        if (typeof j.text === "string") {
            k.text(j.text)
        }
        if (typeof j.html === "string") {
            k.html(j.html)
        }
        k.okLabel(j.okLabel || "确定");
        k.cancelLabel(j.cancelLabel || "取消");
        if (j.OK) {
            k.applyFunction = j.OK
        }
        if (j.cancel) {
            k.cancelFunction = j.cancel
        }
        if (!j.icon) {
            j.icon = "doubt"
        }
        k.getDom("icon").className = a[j.icon];
        k.setMiddle().open(j.from || null).setTitle(j.title || "提示")
    }
});
STK.register("tool.io.ajax",
function(a) {
    return function(e, l) {
        var o = {};
        var j = {};
        var k = null;
        var h = a.core.util.queue();
        o.url = e;
        o.params = {};
        o.onEmpty = function() {};
        o.onComplete = o.onEmpty;
        o.onTraning = o.onEmpty;
        o.onFail = o.onEmpty;
        o.method = l.method;
        if (typeof l.onComplete === "function") {
            o.onComplete = l.onComplete
        }
        if (typeof l.onTraning === "function") {
            o.onTraning = l.onTraning
        }
        if (typeof l.onFail === "function") {
            o.onFail = l.onFail
        }
        var f = function(p) {
            try {
                var q = k ? (k.onComplete || o.onComplete) : o.onComplete;
                q(p, k.params)
            } catch(r) {} finally {
                k = null;
                n()
            }
        };
        var b = function(p) {
            var q = k ? (k.onFail || o.onFail) : o.onFail;
            q(p, o.params);
            k = null;
            n()
        };
        var m = function(p) {
            var q = k ? (k.onTraning || o.onTraning) : o.onTraning;
            q(p, o.params)
        };
        var g = function(r) {
            if (!r) {
                r = o.params
            }
            o.params = r;
            if (typeof r === "object") {
                var q = {};
                for (var p in r) {
                    if (typeof r[p] === "string" || typeof r[p] === "number" || a.core.arr.isArray(r[p])) {
                        q[p] = r[p]
                    }
                }
                r = q
            }
            a.core.io.ajax({
                url: o.url,
                args: r,
                method: o.method,
                asynchronous: o.asynchronous,
                contentType: o.contentType,
                encoding: o.encoding,
                responseType: o.responseType,
                timeout: o.timeout,
                onComplete: f,
                onTraning: m,
                isEncode: true,
                onFail: b
            });
            return j
        };
        var n = function() {
            if (k === null) {
                k = h.get();
                if (k) {
                    g(k.params)
                } else {
                    k = null
                }
            }
        };
        j.request = function(p) {
            h.add({
                params: p,
                onSuccess: o.onComplete,
                onTraning: o.onTraning,
                onError: o.onFail,
                onFail: o.onFail
            });
            n();
            return j
        };
        j.set = function(p, q) {
            if (p === "onComplete" || p === "onTraning" || p === "onFail") {
                if (typeof q !== "function") {
                    throw p + "need a function"
                }
            }
            if (p === "params" || p === "onEmpty") {
                throw "you can't set " + p
            }
            o[p] = q;
            return j
        };
        j.get = function(p) {
            return o[p]
        };
        return j
    }
});
STK.register("tool.io.inter",
function(a) {
    return function() {
        var e = {};
        var b = {};
        b.trans = {};
        e.register = function(g, f) {
            if (b.trans[g] !== undefined) {
                throw g + " interface has been registered"
            }
            b.trans[g] = a.tool.io.ajax(f.url, f);
            b.trans[g]["hookComplate"] = {};
            b.trans[g]["regComplate"] = function() {};
            b.trans[g].set("onComplete", (function(h) {
                return function(k, m) {
                    var j = b.trans[h]["hookComplate"];
                    for (var o in j) {
                        if (typeof j[o] === "function") {
                            try {
                                j[o](k, m)
                            } catch(l) {}
                        }
                    }
                    b.trans[h]["regComplate"](k, m)
                }
            })(g));
            return e
        };
        e.regComplate = function(f, g) {
            b.trans[f]["regComplate"] = g;
            return e
        };
        e.hookComplate = function(f, h) {
            var g = a.core.util.getUniqueKey();
            b.trans[f]["hookComplate"][g] = h;
            return g
        };
        e.removeHook = function(f, g) {
            try {
                delete b.trans[f]["hookComplate"][g]
            } catch(h) {}
        };
        e.regError = function(f, g) {
            b.trans[f].set("onFail", g);
            return e
        };
        e.request = function(f, g) {
            b.trans[f].request(g);
            return e
        };
        return e
    }
});
STK.register("common.trans.global",
function(e) {
    var a = e.tool.io.inter();
    var b = a.register;
    b("language", {
        url: "/person/aj_select_lang.php",
        method: "post"
    });
    return a
});
STK.jobsM.register("job.language",
function(a) {
    if (!window.scope) {
        window.scope = {}
    }
    scope.langList = function(f) {
        var e = f.value;
        var b = {
            "zh-cn": "#L{确认切换到简体版吗}",
            "zh-tw": "#L{确认切换到繁体版吗}"
        };
        a.common.trans.global.regComplate("language",
        function(g, h) {
            if (g.code === "A00006") {
                window.location.reload()
            }
        });
        a.common.confirm({
            text: a.common.language(b[e]),
            OK: function() {
                a.common.trans.global.request("language", {
                    uid: $CONFIG.$uid,
                    lang: e
                })
            },
            cancel: function() {
                f.value = $CONFIG.$lang == "zh" ? "zh-cn": $CONFIG.$lang
            },
            from: f
        })
    }
});
STK.jobsM.register("job.suda",
function(a) {
    try {
        setTimeout(GB_SUDA._S_pSt, 2000)
    } catch(b) {}
});
var SSL = {
    Config: {},
    Space: function(f) {
        var b = f,
        e = null;
        b = b.split(".");
        e = SSL;
        for (i = 0, len = b.length; i < len; i++) {
            e[b[i]] = e[b[i]] || {};
            e = e[b[i]]
        }
        return e
    }
};
SSL.Space("Global");
SSL.Space("Core.Dom");
SSL.Space("Core.Event");
SSL.Space("App");
SSL.Global = {
    win: window || {},
    doc: document,
    nav: navigator,
    loc: location
};
SSL.Core.Dom = {
    get: function(a) {
        return document.getElementById(a)
    }
};
SSL.Core.Event = {
    on: function() {}
};
SSL.App = {
    _S_gConType: function() {
        var a = "";
        try {
            SSL.Global.doc.body.addBehavior("#default#clientCaps");
            a = SSL.Global.doc.body.connectionType
        } catch(b) {
            a = "unkown"
        }
        return a
    },
    _S_gKeyV: function(j, b, g, f) {
        if (j == "") {
            return ""
        }
        if (f == "") {
            f = "="
        }
        b = b + f;
        var h = j.indexOf(b);
        if (h < 0) {
            return ""
        }
        h = h + b.length;
        var a = j.indexOf(g, h);
        if (a < h) {
            a = j.length
        }
        return j.substring(h, a)
    },
    _S_gUCk: function(a) {
        if ((undefined == a) || ("" == a)) {
            return ""
        }
        return SSL.App._S_gKeyV(SSL.Global.doc.cookie, a, ";", "")
    },
    _S_sUCk: function(g, a, b, f) {
        if (a != null) {
            if ((undefined == f) || (null == f)) {
                f = "sina.com.cn"
            }
            if ((undefined == b) || (null == b) || ("" == b)) {
                SSL.Global.doc.cookie = g + "=" + a + ";domain=" + f + ";path=/"
            } else {
                var e = new Date();
                var h = e.getTime();
                h = h + 86400000 * b;
                e.setTime(h);
                h = e.getTime();
                SSL.Global.doc.cookie = g + "=" + a + ";domain=" + f + ";expires=" + e.toUTCString() + ";path=/"
            }
        }
    },
    _S_gJVer: function(h, b) {
        var g, a, j, e = 1,
        f = 0;
        if ("MSIE" == b) {
            a = "MSIE";
            g = h.indexOf(a);
            if (g >= 0) {
                j = parseInt(h.substring(g + 5));
                if (3 <= j) {
                    e = 1.1;
                    if (4 <= j) {
                        e = 1.3
                    }
                }
            }
        } else {
            if (("Netscape" == b) || ("Opera" == b) || ("Mozilla" == b)) {
                e = 1.3;
                a = "Netscape6";
                g = h.indexOf(a);
                if (g >= 0) {
                    e = 1.5
                }
            }
        }
        return e
    },
    _S_gFVer: function(nav) {
        var ua = SSL.Global.nav.userAgent.toLowerCase();
        var flash_version = 0;
        if (SSL.Global.nav.plugins && SSL.Global.nav.plugins.length) {
            var p = SSL.Global.nav.plugins["Shockwave Flash"];
            if (typeof p == "object") {
                for (var i = 10; i >= 3; i--) {
                    if (p.description && p.description.indexOf(" " + i + ".") != -1) {
                        flash_version = i;
                        break
                    }
                }
            }
        } else {
            if (ua.indexOf("msie") != -1 && ua.indexOf("win") != -1 && parseInt(SSL.Global.nav.appVersion) >= 4 && ua.indexOf("16bit") == -1) {
                for (var i = 10; i >= 2; i--) {
                    try {
                        var object = eval("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + i + "');");
                        if (object) {
                            flash_version = i;
                            break
                        }
                    } catch(e) {}
                }
            } else {
                if (ua.indexOf("webtv/2.5") != -1) {
                    flash_version = 3
                } else {
                    if (ua.indexOf("webtv") != -1) {
                        flash_version = 2
                    }
                }
            }
        }
        return flash_version
    },
    _S_gMeta: function(b, e) {
        var f = SSL.Global.doc.getElementsByName(b);
        var a = 0;
        if (e > 0) {
            a = e
        }
        return (f.length > a) ? f[a].content: ""
    },
    _S_gHost: function(b) {
        var a = new RegExp("^http(?:s)?://([^/]+)", "im");
        if (b.match(a)) {
            return b.match(a)[1].toString()
        } else {
            return ""
        }
    },
    _S_gDomain: function(a) {
        var b = a.indexOf(".sina.");
        if (b > 0) {
            return a.substr(0, b)
        } else {
            return a
        }
    },
    _S_gTJMTMeta: function() {
        return SSL.App._S_gMeta("mediaid")
    },
    _S_gTJZTMeta: function() {
        var a = SSL.App._S_gMeta("subjectid");
        a.replace(",", ".");
        a.replace(";", ",");
        return a
    },
    _S_isFreshMeta: function() {
        var b = SSL.Global.doc.documentElement.innerHTML.substring(0, 1024);
        var a = new RegExp("<meta\\s*http-equiv\\s*=((\\s*refresh\\s*)|('refresh')|(\"refresh\"))s*contents*=", "ig");
        return a.test(b)
    },
    _S_isIFrameSelf: function(b, a) {
        if (SSL.Global.win.top == SSL.Global.win) {
            return false
        } else {
            try {
                if (SSL.Global.doc.body.clientHeight == 0) {
                    return false
                }
                if ((SSL.Global.doc.body.clientHeight >= b) && (SSL.Global.doc.body.clientWidth >= a)) {
                    return false
                } else {
                    return true
                }
            } catch(f) {
                return true
            }
        }
    },
    _S_isHome: function(b) {
        var a = "";
        try {
            SSL.Global.doc.body.addBehavior("#default#homePage");
            a = SSL.Global.doc.body.isHomePage(b) ? "Y": "N"
        } catch(f) {
            a = "unkown"
        }
        return a
    }
};
function SUDA(L, k, j) {
    var h = SSL.Global,
    A = SSL.Core.Dom,
    x = SSL.Core.Event,
    l = SSL.App;
    var I = "webbug_meta_ref_mod_noiframe_async_fc_:9.10c",
    m = "-9999-0-0-1";
    var b = h.nav.appName.indexOf("Microsoft Internet Explorer") > -1 ? "MSIE": h.nav.appName;
    var w = h.nav.appVersion;
    var s = h.loc.href.toLowerCase();
    var B = h.doc.referrer.toLowerCase();
    var r = "";
    var p = "",
    M = "SUP",
    y = "",
    v = "Apache",
    z = "SINAGLOBAL",
    t = "ULV",
    J = "UOR",
    u = "_s_upa",
    a = 320,
    n = 240,
    K = 0,
    q = "",
    o = "",
    Q = 0,
    N = 10000,
    H = 0,
    f = "_s_acc";
    var F = s.indexOf("https") > -1 ? "https://": "http://",
    E = "beacon.sina.com.cn",
    G = F + E + "/a.gif",
    P = F + E + "/d.gif",
    O = F + E + "/e.gif",
    D = F + E + "/fc.html";
    var g = 100,
    e = 500;
    var R = "_s_tentry";
    var C = {
        _S_sSID: function() {
            C._S_p2Bcn("", P)
        },
        _S_gsSID: function() {
            var S = l._S_gUCk(v);
            if ("" == S) {
                C._S_sSID()
            }
            return S
        },
        _S_sGID: function(S) {
            if ("" != S) {
                l._S_sUCk(z, S, 3650)
            }
        },
        _S_gGID: function() {
            return l._S_gUCk(z)
        },
        _S_gsGID: function() {
            if ("" != z) {
                var S = l._S_gUCk(z);
                if ("" == S) {
                    C._S_IFC2GID()
                }
                return S
            } else {
                return ""
            }
        },
        _S_IFC2GID: function() {
            var T = D + "?a=g&n=" + z + "&r=" + Math.random();
            var S = A.get("SUDA_CS_DIV").parentNode.childNodes[0];
            S.innerHTML = '<iframe id="SUDA_FC" src="' + T + '" width="1" height="1" SCROLLING="NO" FRAMEBORDER="0"></iframe>'
        },
        _S_gCid: function() {
            try {
                var S = l._S_gMeta("publishid");
                if ("" != S) {
                    var U = S.split(",");
                    if (U.length > 0) {
                        if (U.length >= 3) {
                            m = "-9999-0-" + U[1] + "-" + U[2]
                        }
                        return U[0]
                    }
                } else {
                    return "0"
                }
            } catch(T) {
                return "0"
            }
        },
        _S_gAEC: function() {
            return l._S_gUCk(f)
        },
        _S_sAEC: function(S) {
            if ("" == S) {
                return
            }
            var T = C._S_gAEC();
            if (T.indexOf(S + ",") < 0) {
                T = T + S + ","
            }
            l._S_sUCk(f, T, 7)
        },
        _S_p2Bcn: function(V, U) {
            var S = A.get("SUDA_CS_DIV");
            if (null != S) {
                var T = new Date();
                S.innerHTML = "<img width=0 height=0 src='" + U + "?" + V + "&gUid_" + T.getTime() + "' border='0' alt='' />"
            }
        },
        _S_gSUP: function() {
            if (y != "") {
                return y
            }
            var U = unescape(l._S_gUCk(M));
            if (U != "") {
                var T = l._S_gKeyV(U, "ag", "&", "");
                var S = l._S_gKeyV(U, "user", "&", "");
                var V = l._S_gKeyV(U, "uid", "&", "");
                var X = l._S_gKeyV(U, "sex", "&", "");
                var W = l._S_gKeyV(U, "dob", "&", "");
                y = T + ":" + S + ":" + V + ":" + X + ":" + W;
                return y
            } else {
                return ""
            }
        },
        _S_gsLVisit: function(U) {
            var W = l._S_gUCk(t);
            var V = W.split(":");
            var X = "";
            if (V.length >= 6) {
                if (U != V[4]) {
                    var T = new Date();
                    var S = new Date(parseInt(V[0]));
                    V[1] = parseInt(V[1]) + 1;
                    if (T.getMonth() != S.getMonth()) {
                        V[2] = 1
                    } else {
                        V[2] = parseInt(V[2]) + 1
                    }
                    if (((T.getTime() - S.getTime()) / 86400000) >= 7) {
                        V[3] = 1
                    } else {
                        if (T.getDay() < S.getDay()) {
                            V[3] = 1
                        } else {
                            V[3] = parseInt(V[3]) + 1
                        }
                    }
                    X = V[0] + ":" + V[1] + ":" + V[2] + ":" + V[3];
                    V[5] = V[0];
                    V[0] = T.getTime();
                    l._S_sUCk(t, V[0] + ":" + V[1] + ":" + V[2] + ":" + V[3] + ":" + U + ":" + V[5], 360)
                } else {
                    X = V[5] + ":" + V[1] + ":" + V[2] + ":" + V[3]
                }
            } else {
                var T = new Date();
                X = ":1:1:1";
                l._S_sUCk(t, T.getTime() + X + ":" + U + ":", 360)
            }
            return X
        },
        _S_gUOR: function() {
            var S = l._S_gUCk(J);
            var T = S.split(":");
            if (T.length >= 2) {
                return T[0]
            } else {
                return ""
            }
        },
        _S_sUOR: function() {
            var W = l._S_gUCk(J),
            ab = "",
            T = "",
            aa = "",
            V = "";
            var ac = /[&|?]c=spr(_[A-Za-z0-9]{1,}){3,}/;
            var X = new Date();
            if (s.match(ac)) {
                aa = s.match(ac)[0]
            } else {
                if (B.match(ac)) {
                    aa = B.match(ac)[0]
                }
            }
            if (aa != "") {
                aa = aa.substr(3) + ":" + X.getTime()
            }
            if (W == "") {
                if (l._S_gUCk(t) == "" && l._S_gUCk(t) == "") {
                    ab = l._S_gDomain(l._S_gHost(B));
                    T = l._S_gDomain(l._S_gHost(s))
                }
                l._S_sUCk(J, ab + "," + T + "," + aa, 365)
            } else {
                var Y = 0,
                Z = W.split(",");
                if (Z.length >= 1) {
                    ab = Z[0]
                }
                if (Z.length >= 2) {
                    T = Z[1]
                }
                if (Z.length >= 3) {
                    V = Z[2]
                }
                if (aa != "") {
                    Y = 1
                } else {
                    var U = V.split(":");
                    if (U.length >= 2) {
                        var S = new Date(parseInt(U[1]));
                        if (S.getTime() < (X.getTime() - 86400000 * 30)) {
                            Y = 1
                        }
                    }
                }
                if (Y) {
                    l._S_sUCk(J, ab + "," + T + "," + aa, 365)
                }
            }
        },
        _S_gRef: function() {
            var S = /^[^\?&#]*.swf([\?#])?/;
            if ((B == "") || (B.match(S))) {
                var T = l._S_gKeyV(s, "ref", "&", "");
                if (T != "") {
                    return T
                }
            }
            return B
        },
        _S_MEvent: function() {
            if (Q == 0) {
                Q++;
                var T = l._S_gUCk(u);
                if (T == "") {
                    T = 0
                }
                T++;
                if (T < N) {
                    var S = /[&|?]c=spr(_[A-Za-z0-9]{2,}){3,}/;
                    if (s.match(S) || B.match(S)) {
                        T = T + N
                    }
                }
                l._S_sUCk(u, T)
            }
        },
        _S_gMET: function() {
            var S = l._S_gUCk(u);
            if (S == "") {
                S = 0
            }
            return S
        },
        _S_gCInfo_v2: function() {
            var S = new Date();
            return "sz:" + screen.width + "x" + screen.height + "|dp:" + screen.colorDepth + "|ac:" + h.nav.appCodeName + "|an:" + b + "|cpu:" + h.nav.cpuClass + "|pf:" + h.nav.platform + "|jv:" + l._S_gJVer(w, b) + "|ct:" + l._S_gConType() + "|lg:" + h.nav.systemLanguage + "|tz:" + S.getTimezoneOffset() / 60 + "|fv:" + l._S_gFVer(h.nav)
        },
        _S_gPInfo_v2: function(S, T) {
            if ((undefined == S) || ("" == S)) {
                S = C._S_gCid() + m
            }
            return "pid:" + S + "|st:" + C._S_gMET() + "|et:" + H + "|ref:" + escape(T) + "|hp:" + l._S_isHome(s) + "|PGLS:" + l._S_gMeta("stencil") + "|ZT:" + escape(l._S_gTJZTMeta()) + "|MT:" + escape(l._S_gTJMTMeta()) + "|keys:"
        },
        _S_gUInfo_v2: function(S) {
            return "vid:" + S + "|sid:" + C._S_gsSID() + "|lv:" + C._S_gsLVisit(C._S_gsSID()) + "|un:" + C._S_gSUP() + "|uo:" + C._S_gUOR() + "|ae:" + C._S_gAEC()
        },
        _S_gEXTInfo_v2: function(T, S) {
            q = (undefined == T) ? q: T;
            o = (undefined == S) ? o: S;
            return "ex1:" + q + "|ex2:" + o
        },
        _S_pBeacon: function(W, V, T) {
            try {
                var Y = C._S_gsGID();
                if ("" == Y) {
                    if (K < 1) {
                        setTimeout(function() {
                            C._S_pBeacon(W, V, T)
                        },
                        e);
                        K++;
                        return
                    } else {
                        Y = C._S_gsSID();
                        C._S_sGID(Y)
                    }
                }
                var aa = "V=2";
                var X = C._S_gCInfo_v2();
                var ac = C._S_gPInfo_v2(W, C._S_gRef());
                var U = C._S_gUInfo_v2(Y);
                var S = C._S_gEXTInfo_v2(V, T);
                var ab = aa + "&CI=" + X + "&PI=" + ac + "&UI=" + U + "&EX=" + S;
                C._S_p2Bcn(ab, G)
            } catch(Z) {}
        },
        _S_acTrack_i: function(S, U) {
            if (("" == S) || (undefined == S)) {
                return
            }
            C._S_sAEC(S);
            if (0 == U) {
                return
            }
            var T = "AcTrack||" + C._S_gGID() + "||" + C._S_gsSID() + "||" + C._S_gSUP() + "||" + S + "||";
            C._S_p2Bcn(T, O)
        },
        _S_uaTrack_i: function(U, S) {
            var T = "UATrack||" + C._S_gGID() + "||" + C._S_gsSID() + "||" + C._S_gSUP() + "||" + U + "||" + S + "||";
            C._S_p2Bcn(T, O)
        },
        _S_sTEntry: function() {
            var V = "-";
            if ("" == l._S_gUCk(R)) {
                if ("" != B) {
                    V = l._S_gHost(B)
                }
                l._S_sUCk(R, V, "", "t.sina.com.cn")
            }
            var T = /t.sina.com.cn\/reg.php/;
            if (s.match(T)) {
                var U = l._S_gKeyV(unescape(s), "sharehost", "&", "");
                var S = l._S_gKeyV(unescape(s), "appkey", "&", "");
                if ("" != U) {
                    l._S_sUCk(R, U, "", "t.sina.com.cn")
                }
                l._S_sUCk("appkey", S, "", "t.sina.com.cn")
            }
        },
        _S_gSPR: function() {
            var S = C._S_gUOR();
            var T = S.split(",");
            if (T.length >= 3) {
                return T[2]
            } else {
                return ""
            }
        },
        _S_upExt1: function() {
            var W = new Array(/t.sina.com.cn\/reg.php/, /t.sina.com.cn\/reg\/reg_succ.php/, /t.sina.com.cn\/reg\/reg_active.php/, /t.sina.com.cn\/person\/full_info.php\?.*type=3.*/, /t.sina.com.cn\/person\/guide_interest.php\?.*type=3.*/, /t.sina.com.cn\/person\/guide_invite.php\?.*type=3.*/, /t.sina.com.cn\/person\/full_info.php\?.*type=2.*/, /t.sina.com.cn\/person\/guide_interest.php\?.*type=2.*/, /t.sina.com.cn\/person\/guide_invite.php\?.*type=2.*/, /t.sina.com.cn\/reg_sinamail.php/, /t.sina.com.cn\/person\/full_info.php\?.*type=1.*/, /t.sina.com.cn\/person\/guide_interest.php\?.*type=1.*/, /t.sina.com.cn\/person\/guide_invite.php\?.*type=1.*/, /v.t.sina.com.cn\/widget\/full_info.php\?.*type=4.*/, /v.t.sina.com.cn\/share\/share.php\?.*type=4.*/);
            var X = new Array("reg_input", "reg_succ", "reg_active", "reg_full_info", "reg_interest", "reg_invite", "act_fullinfo", "act_interest", "act_invite", "mail_act", "mail_full_info", "mail_interest", "mail_invite", "wgt_full_info", "wgt_succ");
            var Z = "";
            var U = W.length;
            var S = X.length;
            var T = C._S_gSPR();
            try {
                for (var V = 0; V < U && V < S; V++) {
                    if (s.match(W[V])) {
                        Z = T + ",flw," + X[V];
                        break
                    }
                }
            } catch(Y) {}
            return Z
        }
    };
    if (Q == 0) {
        if ("MSIE" == b) {
            SSL.Global.doc.attachEvent("onclick", C._S_MEvent);
            SSL.Global.doc.attachEvent("onmousemove", C._S_MEvent);
            SSL.Global.doc.attachEvent("onscroll", C._S_MEvent)
        } else {
            SSL.Global.doc.addEventListener("click", C._S_MEvent, false);
            SSL.Global.doc.addEventListener("mousemove", C._S_MEvent, false);
            SSL.Global.doc.addEventListener("scroll", C._S_MEvent, false)
        }
    }
    C._S_sUOR();
    C._S_sTEntry();
    return {
        _S_pSt: function(S, U, T) {
            try {
                if ((l._S_isFreshMeta()) || (l._S_isIFrameSelf(n, a))) {
                    return
                }
                if (H > 0) {
                    return
                }++H;
                setTimeout(function() {
                    C._S_gsSID()
                },
                g);
                setTimeout(function() {
                    C._S_pBeacon(S, ((undefined == U) ? C._S_upExt1() : U), T, 0)
                },
                e)
            } catch(V) {}
        },
        _S_pStM: function(S, U, T) {++H;
            C._S_pBeacon(S, ((undefined == U) ? C._S_upExt1() : U), T)
        },
        _S_acTrack: function(S, U) {
            try {
                if ((undefined != S) && ("" != S)) {
                    setTimeout(function() {
                        C._S_acTrack_i(S, U)
                    },
                    g)
                }
            } catch(T) {}
        },
        _S_uaTrack: function(T, S) {
            try {
                if (undefined == T) {
                    T = ""
                }
                if (undefined == S) {
                    S = ""
                }
                if (("" != T) || ("" != S)) {
                    setTimeout(function() {
                        C._S_uaTrack_i(T, S)
                    },
                    g)
                }
            } catch(U) {}
        }
    }
}
var GB_SUDA;
if (GB_SUDA == null) {
    GB_SUDA = new SUDA({})
}
var _S_PID_ = "";
function _S_pSt(a, e, b) {
    GB_SUDA._S_pSt(a, e, b)
}
function _S_pStM(a, e, b) {
    GB_SUDA._S_pStM(a, e, b)
}
function _S_acTrack(a) {
    GB_SUDA._S_acTrack(a, 1)
}
function _S_uaTrack(b, a) {
    GB_SUDA._S_uaTrack(b, a)
}
STK.register("common.alert",
function(g) {
    var b = '<div class="commonLayer2" node-type="outer">		<div class="layerL"><img node-type="icon" src="' + $CONFIG.$BASECSS + 'style/images/common/PY_ib.gif"></div>		<div style="width: 284px;" class="layerR">			<p class="txt font_14" node-type="inner"></p>			<div class="MIB_btn"> <a href="javascript:void(0);" class="btn_normal" node-type="btn"><em>确定</em></a> </div>		</div>		<div class="clearit"></div>	</div>';
    var a = {
        warning: "PY_ib PY_ib_1",
        error: "PY_ib PY_ib_2",
        success: "PY_ib PY_ib_3",
        doubt: "PY_ib PY_ib_4"
    };
    var f = [];
    var h = function() {
        var j = {};
        var k = null;
        j.template = b;
        j.onOpen = function() {
            k.inUsed = true
        };
        j.onClose = function() {
            k.inUsed = false;
            if (k.OKFunction) {
                k.OKFunction()
            }
            k.OKFunction = null
        };
        k = g.common.customDialog(j);
        g.addEvent(k.getDom("btn"), "click",
        function() {
            k.close();
            return false
        });
        return k
    };
    var e = function() {
        for (var j = 0; j < f.length; j += 1) {
            if (!f[j]["inUsed"]) {
                return f[j]
            }
        }
        var k = h();
        f.push(k);
        return k
    };
    return function(j) {
        if (typeof j === "string") {
            var l = j;
            j = {
                text: l
            }
        }
        var k = e();
        if (typeof j.text === "string") {
            k.text(j.text)
        }
        if (typeof j.html === "string") {
            k.html(j.html)
        }
        if (j.OK) {
            k.OKFunction = j.OK
        }
        if (!j.icon) {
            j.icon = "warning"
        }
        k.getDom("icon").className = a[j.icon];
        k.setMiddle().open(j.from || null).setTitle(j.title || "提示");
        return k
    }
});
STK.register("common.sysmsg",
function(a) {
    var b = {
        A00001: "很抱歉，根据相关法规和政策，此功能正在维护中，会尽快恢复。如需帮助请联系@微博小秘书 或者致电客服电话400 690 0000。",
        A00003: "无权限操作。",
        A00006: "保存成功",
        E00001: "系统繁忙",
        E00002: "参数错误",
        E00003: "权限错误",
        M00003: "你尚未登录或登录已过期，请重新登录。",
        M00004: "系统繁忙，请稍后再试。",
        M00009: "参数错误",
        M01161: "服务器度假中，请隔天再试 ",
        M01120: "含有非法字符，请修改"
    };
    return function(f, h) {
        h = h || false;
        var e, g;
        if (typeof f == "object") {
            g = f.msg || "";
            f = f.code || ""
        }
        if (typeof h == "object") {
            e = h[f]
        }
        if (!e) {
            e = b[f]
        }
        return a.common.language(["#L{", (g || e || b.E00001), "}"].join(""))
    }
});
STK.register("module.bubble",
function(f) {
    var b = '<div node-type="outer" style="visibility:hidden"></div>',
    e;
    var a = function(g, r, q, o) {
        var j = Math.max(g, r),
        h = Math.min(g, r),
        p = [j],
        k = j - h,
        l = 1;
        p[q] = h;
        for (l; l < q; l++) {
            p[l] = (k = k / o) + h
        }
        return g > r ? p: p.reverse()
    };
    return function(o) {
        var q = f.parseParam({
            l: 0,
            t: 0,
            w: 200,
            h: 20,
            count: 8,
            sor: f.IE ? 1.5 : 1.2,
            gap: 20,
            zIndex: 500,
            alphaTo: 0.8,
            alphaFrom: 0.05,
            template: b,
            wipe: "pop",
            backgroundColor: "#ffffff",
            border: "1px solid #000000",
            boxShadowFrom: 10,
            boxShadowTo: 50,
            borderRadius: "3px"
        },
        o || {});
        var z = document.body,
        x = f.builder(q.template),
        y = x.list,
        g = y.outer[0],
        s = ["position:absolute;background-color:", q.backgroundColor, ";z-index:", q.zIndex, ";border:", q.border, ";"].join(""),
        h = ["-moz-border-radius:", q.borderRadius, ";-webkit-border-radius:", q.borderRadius, "-o-border-radius:", q.borderRadius, ";"].join(""),
        A,
        p,
        t,
        j,
        B,
        u,
        n,
        v,
        C,
        k;
        var m = function() {
            var D = [s, "left:", (p[n] == e ? q.l: p[n]), "px;", "top:", (t[n] == e ? q.t: t[n]), "px;", "width:", (j[n] == e ? q.w: j[n]), "px;", "height:", (B[n] == e ? q.h: B[n]), "px;", "filter:alpha(opacity=", (A[n] * 100), ");", "opacity:", A[n], ";", h, u[n]];
            g.style.cssText = D.join("");
            if (n == (v > 0 ? q.count: 0)) {
                clearInterval(C);
                g.style.visibility = "hidden";
                if (typeof k == "function") {
                    k()
                }
                return
            }
            n += v
        };
        var r = function() {
            if (n == null) {
                n = v > 0 ? 0 : q.count
            }
            clearInterval(C);
            C = setInterval(m, q.gap)
        };
        var w = {};
        w.pop = function() {
            j = a(0, q.w, q.count, q.sor);
            B = a(0, q.h, q.count, q.sor);
            p = f.foreach(j,
            function(E, D) {
                return (q.w - E) / 2 + q.l
            });
            t = f.foreach(B,
            function(E, D) {
                return (q.h - E) / 2 + q.t
            })
        };
        w.up = function() {
            p = j = [];
            B = a(0, q.h, q.count, q.sor);
            t = f.foreach(B,
            function(D) {
                return q.t + q.h - D
            })
        };
        w.down = function() {
            p = j = t = [];
            B = a(0, q.h, q.count, q.sor)
        };
        w.left = function() {
            t = B = [];
            j = a(0, q.w, q.count, q.sor);
            p = f.foreach(j,
            function(D) {
                return q.l + q.w - D
            })
        };
        w.right = function() {
            t = B = p = [];
            j = a(0, q.w, q.count, q.sor);
            A = a(q.alphaFrom, q.alphaTo, q.count, q.sor)
        };
        var l = {}; (l.rect = function(G, F, D, E) {
            q = f.parseParam(q, {
                l: G,
                t: F,
                w: D,
                h: E
            });
            w[q.wipe]();
            A = a(q.alphaFrom, q.alphaTo, q.count, q.sor);
            u = f.foreach(a(q.boxShadowFrom, q.boxShadowTo, q.count, q.sor),
            function(I) {
                var H = ["0 0 ", Math.ceil(I), "px #777"].join("");
                return ["-moz-box-shadow:", H, ";-webkit-box-shadow:", H, ";box-shadow:", H, ";"].join("")
            })
        })();
        l.show = function(D) {
            k = D;
            v = 1;
            r()
        };
        l.hidden = function(D) {
            k = D;
            v = -1;
            r()
        };
        z.appendChild(g);
        return l
    }
});
STK.register("common.bubble",
function(e) {
    var a = '<div node-type="outer" class="miniPopLayer" style="visibility:hidden;">				<div node-type="arrow"></div>			    <div class="txt1 gray6">			        <img class="tipicon tip1" node-type="icon" src="' + $CONFIG.$BASECSS + 'style/images/common/PY_ib.gif"/>			        <div node-type="inner"></div>			    </div>		</div>';
    var b = {
        doubt: 4,
        error: 2,
        success: 3,
        warning: 1
    };
    return function(s) {
        var m = e.parseParam({
            l: 100,
            t: 100,
            zIndex: 500,
            icon: "warning",
            content: '<div style="width:200px">　</div>',
            template: a,
            wipe: "pop"
        },
        s || {});
        var n = false,
        l, h, w, f = e.builder(m.template),
        k = f.list,
        p = (k.icon || [])[0],
        r = (k.arrow || [])[0],
        t = k.outer[0],
        v = k.inner[0],
        o = e.module.bubble({
            zIndex: m.zIndex - 1,
            wipe: m.wipe
        }),
        u = function() {
            var x = {};
            if (t.style.display == "none") {
                t.style.visibility = "hidden";
                t.style.display = "";
                x.w = t.offsetWidth;
                x.h = t.offsetHeight;
                t.style.display = "none";
                t.style.visibility = "visible"
            } else {
                x.w = t.offsetWidth;
                x.h = t.offsetHeight
            }
            return x
        },
        q = function() {
            t.style.visibility = "visible"
        },
        j = function() {
            t.style.visibility = "hidden"
        }; (l = function(x) {
            if (!n) {
                n = true;
                document.body.appendChild(t)
            }
            e.parseParam(m, {
                content: x
            });
            v.innerHTML = m.content;
            setTimeout(function() {
                var y = u();
                e.parseParam(m, {
                    w: y.w,
                    h: y.h
                });
                o.rect(m.l, m.t, y.w, y.h)
            },
            0)
        })(m.content); (h = function(x) {
            m = e.parseParam(m, x);
            t.style.cssText = ["clear:both;position:absolute;visibility:hidden;left:", m.l, "px;top:", m.t, "px;z-index:", m.zIndex].join("");
            if (x.l == m.l && x.t == m.t) {
                return
            }
            o.rect(m.l, m.t, m.w, m.h)
        })(m.l, m.t);
        w = function() {
            var y = e.core.util.winSize();
            var x = u();
            h({
                l: (y.width - x.w) / 2,
                t: e.core.util.scrollPos()["top"] + ((y.height - x.h) / 2)
            })
        };
        var g = {};
        g.content = l;
        g.position = h;
        g.middle = w;
        g.dom = f;
        g.getSize = u;
        g.show = function() {
            o.show(q)
        };
        g.hidden = function() {
            j();
            o.hidden()
        }; (g.icon = function(x) {
            if (!p) {
                return
            }
            p.className = ["tipicon tip", b[x]].join("")
        })(m.icon);
        g.arrow = function(x) {
            if (!r) {
                return
            }
            r.style.cssText = ["display:block;background-image:url(", $CONFIG.$BASEIMG, "style/images/common/poptips/poparrow.png);_background-image:url(", $CONFIG.$BASEIMG, "style/images/common/poptips/poparrow.gif); background-repeat:no-repeat;overflow:hidden;position:absolute;", {
                up: "background-position:0 0;width:17px;height:8px; margin-left:-9px; left:50%; top:-8px",
                right: "background-position:-30px 0;width:10px;height:18px; right:-10px;top:50%; margin-top:-9px",
                down: "background-position:0 -20px;width:19px;height:10px;margin-left:-9px; left:50%; bottom:-10px;",
                left: "background-position:-32px -20px;width:9px;height:20px; left:-8px; top:50%; margin-top:-10px"
            } [x || "up"]].join("")
        };
        return g
    }
});
STK.jobsM.register("job.settings.face",
function(f) {
    window.App = window.App || {};
    window.scope = window.scope || {};
    var m = f.common.sysmsg,
    e = f.common.language,
    j = f.common.bubble();
    var b = {
        M01106: e("#L{很抱歉，此功能正在维护中，暂时无法提供。}"),
        M01107: e("#L{请上传jpg、gif格式的图片。}"),
        M07006: e("#L{上传失败，请重新上传。}"),
        M01152: e("#L{请选择不超过2M的图片}"),
        M01109: e("#L{保存失败，请重试。}"),
        M01108: e("#L{请上传文件大小不超过5M的图片。}"),
        CX0182: e("#L{选择照片}"),
        CX0183: e("#L{正在加载现有的头像...}"),
        CX0184: e("#L{正在读取中，请稍候...}"),
        CX0185: e("#L{你的图片文件超出5M或宽高超出2880像素，请选择文件和尺寸较小的图片}"),
        CX0186: e("#L{取消}"),
        CX0187: e("#L{浏览...}"),
        CX0188: e("#L{保存}"),
        CX0189: [e("#L{您上传的头像会自动生成三种尺寸，}"), "\n", e("#L{请注意中小尺寸的头像是否清晰}")].join(""),
        CX0190: e("#L{大尺寸头像，180×180像素}"),
        CX0191: [e("#L{中尺寸头像}"), "\n", e("#L{50×50像素}"), "\n", e("#L{(自动生成)}")].join(""),
        CX0192: [e("#L{小尺寸头像}"), "\n", e("#L{30×30像素}"), "\n", e("#L{(自动生成)}")].join(""),
        CX0193: e("#L{仅支持JPG、GIF、PNG图片文件，且文件小于5M}"),
        CX0194: e("#L{向右旋转}"),
        CX0195: e("#L{向左旋转}"),
        CC1503: e("#L{请等待图片上传}"),
        CC1501: e("#L{请选择图片}"),
        CC1502: e("#L{文件格式不正确，请选择JPG或GIF图片格式}"),
        CC1503: e("#L{请等待图片上传 }")
    };
    var g = function(l) {
        var o = f.position(f.E("tips_place"));
        o.t = o.t - 62;
        o.l = o.l + 188;
        var n = m({
            code: l
        });
        j.content('<div style="width:60px;">' + n + "</div>");
        j.icon("success");
        j.position(o);
        j.show();
        setTimeout(j.hidden, 2000)
    };
    var k = function(l) {
        if (navigator.appName.indexOf("Microsoft") != -1) {
            return window[l]
        } else {
            return document[l]
        }
    };
    window.setticket = function(l) {
        if (l.retcode == 0) {
            var o = [];
            for (var n = 0; n < l.ticket.length; n++) {
                o.push([encodeURIComponent(l.ticket[n]), ((new Date()).getTime())])
            }
            k("Head_Cut_miniblog").setTicket(o)
        } else {
            k("Head_Cut_miniblog").setTicket(new Array())
        }
    };
    var h = (function() {
        var l = {},
        n = 791,
        o = 474;
        l.show = function(p, u) {
            var q = f.parseParam({
                swfurl: "/view/js/group/head4group.swf",
                width: 500,
                height: 500,
                uid: 0,
                ver: 0,
                uidurl: 0,
                tmpurl: "",
                tmpimgurl: "",
                imgurl: "",
                delurl: "",
                jsfunc: "afterComplete"
            },
            (u || {}));
            var s = [];
            for (var r in q) {
                s.push(r.toLowerCase() + "=" + encodeURIComponent(q[r]))
            }
            var t = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,28,0"						width="' + q.width + '" 						height="' + q.height + '" 						id="Head_Cut_miniblog">					<param name="movie" 						value="' + q.swfurl + "?" + s.join("&") + "&ct=" + (new Date().getTime()) + '" />					<param name="quality" value="high" />					<param name="wmode" value="transparent" />					<param name="allowScriptAccess" value="always" />					<embed 						src="' + q.swfurl + "?" + s.join("&") + "&ct=" + (new Date().getTime()) + '" 						quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" wmode="transparent" 						width="' + q.width + '" height="' + q.height + '" 						swLiveConnect="true" allowScriptAccess="always" name="Head_Cut_miniblog">					</embed>				</object><div id="tips_place"></div>';
            if (typeof p == "string") {
                p = f.E(p)
            }
            p.innerHTML = t;
            f.E("img_avatar").src = "http://tp" + (($CONFIG.$uid % 4) + 1) + ".sinaimg.cn/" + $CONFIG.$uid + "/180/" + $CONFIG.version + "/" + ($CONFIG.sex == "1" ? "1": "0");
            f.addEvent(f.E("uploadmode_js"), "click",
            function() {
                f.E("div_flashupload").style.display = "none";
                f.E("div_jsupload").style.display = "";
                a()
            })
        };
        return l
    })();
    function a() {
        var l = false;
        var n = function() {
            if (l) {
                return
            }
            l = true;
            var o = {};
            o.formupload = f.E("form_upload");
            o.sFilename = f.E("file_name");
            o.hiddenimage = f.E("hidden_image");
            o.headimage = f.E("img_avatar");
            o.uploadstatus = f.E("upload_status");
            if (o.sFilename.value == "" || o.sFilename.value == null) {
                o.uploadstatus.innerHTML = m({
                    code: "CC1501"
                },
                b);
                o.uploadstatus.style.display = "";
                return false
            }
            if (!/\.(gif|jpg|jpeg)$/i.test(o.sFilename.value)) {
                o.uploadstatus.innerHTML = m({
                    code: "CC1502"
                },
                b);
                o.uploadstatus.style.display = "";
                o.formupload.reset();
                return false
            }
            o.uploadstatus.innerHTML = m({
                code: "CC1503"
            },
            b);
            o.uploadstatus.style.display = "";
            scope.addImgSuccess = function(q) {
                if (q.ret == 1) {
                    o.uploadstatus.style.display = "none";
                    var p = q.version;
                    o.headimage.src = "http://tp" + (($CONFIG.$uid % 4) + 1) + ".sinaimg.cn/" + $CONFIG.$uid + "/180/" + (p ? p: 0) + "/" + ($CONFIG.sex == "1" ? "1": "0");
                    var r = f.position(f.E("link_upload"));
                    r.t = r.t - 50;
                    r.l = r.l - 10;
                    j.content('<div style="width:60px;">' + m(q) + "</div>");
                    j.icon("success");
                    j.position(r);
                    j.show();
                    setTimeout(function() {
                        window.location.href = "/" + $CONFIG.$uid
                    },
                    2000)
                } else {
                    o.uploadstatus.style.display = "none";
                    f.common.alert({
                        text: m(q)
                    });
                    o.formupload.reset();
                    l = false
                }
            };
            o.formupload.submit()
        };
        f.addEvent(f.E("link_upload"), "click", n)
    }
    App.requestLanguage = function() {
        return b
    };
    App.requestTicket = function(l) {
        var n = "http://login.sina.com.cn/sso/getst.php?entry=miniblog&service=tupian&cb=setticket&cnt=" + (l ? l: 1) + "&ctime=" + (new Date().getTime());
        var o = document.createElement("script");
        o.setAttribute("type", "text/javascript");
        o.setAttribute("src", n);
        document.getElementsByTagName("HEAD")[0].appendChild(o);
        k("Head_Cut_miniblog")
    };
    App.headAfterComplete = function(l) {
        if (l == "A00006") {
            g(l);
            setTimeout(function() {
                window.location.href = "/" + $CONFIG.$uid
            },
            2000)
        } else {
            if (l == "M00003") {
                window.location.href = "http://t.sina.com.cn/login.php"
            } else {
                if (l == "M01107" || l == "M01106") {
                    f.common.alert({
                        text: m({
                            code: l
                        },
                        b)
                    })
                } else {
                    f.common.confirm({
                        text: m({
                            code: l
                        },
                        b),
                        icon: ((l == "M01161") ? "warning": "doubt"),
                        OK: function() {
                            if (l == "M01161") {
                                window.location.reload();
                                return false
                            } else {
                                f.E("div_flashupload").style.display = "none";
                                f.E("div_jsupload").style.display = "";
                                a()
                            }
                        },
                        cancel: function() {
                            window.location.reload()
                        }
                    })
                }
            }
        }
    };
    h.show("miniblog_photo_swf", {
        swfurl: $CONFIG.$BASEJS + "home/static/swf/head4miniblog.swf",
        width: 700,
        height: 500,
        uid: $CONFIG.$uid,
        ver: $CONFIG.version ? $CONFIG.version: 0,
        uidurl: "http://tp" + (($CONFIG.$uid % 4) + 1) + ".sinaimg.cn/" + $CONFIG.$uid + "/180/" + ($CONFIG.version ? $CONFIG.version: 0) + "/" + ($CONFIG.sex == "1" ? "1": "0") + "&ct=" + (new Date().getTime()),
        tmpurl: "http://t.sina.com.cn/person/myface_post.php",
        tmpimgurl: "http://cache.mars.sina.com.cn/nd/t/headpic/" + $CONFIG.$uid,
        imgurl: "http://tt.upload.photo.sina.com.cn/upload_profile.php",
        delurl: "http://t.sina.com.cn/person/aj_setnewversion.php",
        jsfunc: "App.headAfterComplete"
    });
    f.E("file_name").onchange = function() {
        f.E("file_name_mask").value = f.E("file_name").value
    };
    f.E("flashupload") && f.addEvent(f.E("flashupload"), "click",
    function() {
        f.E("div_jsupload").style.display = "none";
        f.E("div_flashupload").style.display = ""
    })
});