function formTrans(e) {
	e = e.split(/[ ,]+/).join(",");
	return e
}

function checkEl(e) {
	if (($(e).prop("tagName") == "ellipse" || $(e).prop("tagName") == "circle" || $(e).prop("tagName") == "rect" || $(e).prop("tagName") == "polyline" || $(e).prop("tagName") == "g" || $(e).prop("tagName") == "polygon" || $(e).prop("tagName") == "path" || $(e).prop("tagName") == "polygon" || $(e).prop("tagName") == "line") && ($(e).attr("fill") != "none" || $(e).attr("stroke-width"))) {
		return true
	} else {
		return false
	}
}
function svgJson(e, t, n, r, i) {
	var s = {};
	var o = "";
	if ($(e).attr("id")) {
		o = "r" + i + $(e).attr("id").toLowerCase()
	} else {
		o = "ranqt" + Math.floor(Math.random() * 10001)
	}
	if ($(e).children().length > 0) {
		var u = [];
		var a = "";
		if ($(e).attr("transform")) {
			a = formTrans($(e).attr("transform"))
		}
		u = gAtt($(e), t, n, r);
		if (checkEl($(e))) {
			var f = fData($(e));
			s[o] = {
				id : o,
				pos : "",
				type : $(e).prop("tagName"),
				data : [f],
				children : [],
				trans : a,
				attribs : u
			}
		}
		$.each($(e).children(), function() {
			var u = "";
			if (checkEl($(this))) {
				var a = {};
				a = svgJson($(this), t, n, r, i);
				if (checkEl($(e))) {
					s[o].children.push(a)
				} else {
					$.extend(s, a)
				}
			}
		});
		return s
	} else {
		var u = [];
		u = gAtt($(e), t, n, r);
		var l = "yes";
		if ($(e).attr("id")) {
			if (u.length > 0) {
				$.each(u, function(e) {
					if (this[0] == "fill") {
						return false
					} else if (this[0] != "fill" && e + 1 === u.length) {
						u.push(["fill", t]);
						return true
					} else {
						return true
					}
				})
			} else {
				u.push(["fill", t])
			}
		}
		var f = fData($(e));
		var c = [{
			x : 0
		}, {
			y : 0
		}];
		if ($(e).prop("tagName") == "text") {
			if ($(e).attr("x")) {
				c[0].x = $(e).attr("x")
			}
			if ($(e).attr("y")) {
				c[0].y = $(e).attr("y")
			}
		} else if ($(e).prop("tagName") == "circle") {
			if ($(e).attr("cx")) {
				c[0].x = $(e).attr("cx")
			}
			if ($(e).attr("cy")) {
				c[0].y = $(e).attr("cy")
			}
		} else if ($(e).prop("tagName") == "ellipse") {
			if ($(e).attr("cx")) {
				c[0].x = $(e).attr("cx")
			}
			if ($(e).attr("cy")) {
				c[0].y = $(e).attr("cy")
			}
		}
		var a = "";
		if ($(e).attr("transform")) {
			a = formTrans($(e).attr("transform"))
		}
		if (checkEl($(e))) {
			s[o] = {
				id : o,
				type : $(e).prop("tagName"),
				pos : c,
				data : [f],
				children : [],
				trans : a,
				attribs : u
			}
		}
		return s
	}
}

function convertPolyToPath(e) {
	var e = e.split(/\s+|,/);
	var t = e.shift(), n = e.shift();
	var r = "M" + t + "," + n + "L" + e.join(",");
	return r
}

function fData(e) {
	var t = "";
	switch($(e).prop("tagName")) {
		case"path":
			t = $(e).attr("d");
			break;
		case"polygon":
			t = $(e).attr("points");
			pArr = [];
			pArr = t.split(" ");
			var n = "";
			$.each(pArr, function(e) {
				n += this + " L"
			});
			n = n.substring(0, n.length - 1);
			t = "M" + n + "Z";
			break;
		case"rect":
			t = $(e).attr("x") + "," + $(e).attr("y") + "," + $(e).attr("width") + "," + $(e).attr("height");
			break;
		case"circle":
			t = $(e).attr("r");
			break;
		case"text":
			t = $(e).text();
			break;
		case"polyline":
			t = $(e).attr("points");
			pArr = [];
			pArr = t.split(" ");
			var n = "";
			$.each(pArr, function(e) {
				n += this + " L"
			});
			n = n.substring(0, n.length - 1);
			t = "M" + n + "";
			break;
		case"line":
			t = "M " + $(e).attr("x1") + " " + $(e).attr("y1") + " L " + $(e).attr("x2") + " " + $(e).attr("y2");
			break;
		case"ellipse":
			t = $(e).attr("rx") + "," + $(e).attr("ry")
	}
	return t
}

function eT(e) {
	var t = [];
	if ($(e).attr("font-family")) {
		t.push(["font-family", "Arial"])
	}
	if ($(e).attr("font-size")) {
		t.push(["font-size", $(e).attr("font-size")])
	}
	if ($(e).attr("fill")) {
		t.push(["fill", $(e).attr("fill")])
	}
	return t
}

function boom(e, t, n, r, i) {
	$.each(e, function(s, o) {
		var u = "no";
		if (e[s].children.length > 0) {
			window[s] = t.set();
			$.each(e[s].children, function() {
				boom(this, t, s, r, i)
			})
		} else if (e[s].type != "g") {
			switch(e[s].type) {
				case"path":
					window[s] = t.path(e[s].data.toString());
					break;
				case"polygon":
					window[s] = t.path(e[s].data.toString());
					break;
				case"polyline":
					window[s] = t.path(e[s].data.toString());
					break;
				case"line":
					window[s] = t.path(e[s].data.toString());
					break;
				case"rect":
					var a = e[s].data.toString().split(",");
					window[s] = t.rect(a[0], a[1], a[2], a[3]);
					break;
				case"text":
					var f = {};
					if (e[s].attribs.length > 0) {
						$.each(e[s].attribs, function() {
							f[this[0]] = this[1]
						})
					}
					window[s] = t.text(e[s].pos[0].x, e[s].pos[0].y, e[s].data).attr(f);
					break;
				case"circle":
					window[s] = t.circle(e[s].pos[0].x, e[s].pos[0].y, e[s].data);
					break;
				case"ellipse":
					window[s] = t.ellipse(e[s].pos[0].x, e[s].pos[0].y, e[s].data.toString().split(",")[0], e[s].data.toString().split(",")[1]);
					break
			}
		} else {
			u = "yes"
		}
		if (u == "no") {
			var l = {};
			if (s.indexOf("ranqt") === 0 && n.indexOf("ranqt") === 0) {
				$.extend(l, i)
			} else {
				$.extend(l, r)
			}
			if (e[s].attribs && e[s].attribs.length > 0) {
				$.each(e[s].attribs, function() {
					l[this[0]] = this[1]
				})
			}
			window[s].attr(l);
			if (n != "none") {
				window[n].push(window[s])
			}
			if (e[s].trans) {
				var c = e[s].trans.toString();
				c = c.replace("translate(", "t").replace("scale(", "s").replace("rotate(", "r").replace("matrix(", "m").replace(") ", "...").replace(")", "...").replace(" ", ",");
				window[s].transform(c)
			}
		}
	})
}

function loopData(e, t, n, r) {
	var i = 0;
	var s = 999999999;
	var o = 999999999;
	var u = 0;
	var a = 0;
	for (var f = 0; f < e.Rows.length; f++) {
		var l = e.Rows[f];
		var c = parseFloat(l[1].text);
		if (c > i) {
			i = c
		}
	}
	var h = [];
	for (var f = 0; f < e.Rows.length; f++) {
		var l = e.Rows[f];
		var p = l[0].text;
		var d = l[1].text;
		var v = l[2].text;
		var m = l[3].text;
		if ( typeof window["r" + r + p.toLowerCase()] != "undefined") {
			if (m && m != "" && m != "0" && m != "-") {
				window["r" + r + p.toLowerCase()].mousemove(popS).hover(function() {
					$("#hoverBox p").html(this.data("pop"))
				}, function() {
					$("#hoverBox").hide()
				})
			} else {
				window["r" + r + p.toLowerCase()].unmousemove(popS)
			}
			if (!window["r" + r + p.toLowerCase()].data("r")) {
				window["r" + r + p.toLowerCase()].click(function() {
					searchMe(e, this.data("r"))
				})
			} else if (window["r" + r + p.toLowerCase()].length) {
				$.each(window["r" + r + p.toLowerCase()], function() {
					if (!this.data("r")) {
						this.click(function() {
							searchMe(e, this.data("r"))
						})
					}
				})
			}
			window["r" + r + p.toLowerCase()].attr({
				fill : v,
				"fill-opacity" : d / i + (1 - d / i) * .2,
				cursor : "pointer"
			}).data({
				r : p,
				rVal : d,
				pop : m
			});
			n.push(window["r" + r + p.toLowerCase()])
		}
	}
	return n
}

function svgMap_Example_Done() {
	Qva.AddExtension("svgMap", function() {
		var e;
		var t = $(".qvtr-tabs li.selectedtab").attr("id");
		var n = this;
		var r = n.Layout.ObjectId.replace("\\", "_");
		if (!window["ref" + r]) {
			window["ref" + r] = "no"
		}
		$(".qvtr-tabs li").click(function() {
			if ($(this).attr("class") != "selectedtab" && $(this).attr("id") == t) {
				window["ref" + r] = "yes"
			}
		});
		var i;
		var s, o, u;
		Qva.LoadCSS("/QvAjaxZfc/QvsViewClient.aspx?public=only&name=Extensions/svgMap/style.css");
		$("body").append('<div class="arrowDown" id="hoverBox"><p></p></div>');
		var a = n.Layout.Text1.text.toString();
		var f = n.Layout.Text5.text.toString();
		var l = n.Layout.Text6.text.toString();
		if (!f) {
			f = 0
		}
		if (!l) {
			l = 0
		}
		var c = [];
		var h = n.Layout.Text0.text.toString();
		alert(a + " f:" + f + " l:" + l + " h:" + h);
		var p = Math.floor(Math.random() * 10001);
		var d = [];
		if (!window["vb" + r]) {
			window["vb" + r] = ""
		}
		if (!window["R" + r]) {
			window["R" + r] = {}
		}
		if (!window["set" + r]) {
			window["set" + r] = ""
		}
		if (!window["svg" + r]) {
			window["svg" + r] = ""
		}
		if (!window["sj" + r]) {
			window["sj" + r] = ""
		}
		var v = [];
		v = [n.Layout.Text0.text.toString(), n.Layout.Text1.text.toString(), n.Layout.Text4.text.toString(), n.Layout.Text5.text.toString()];
		if (!arraysEqual(window["set" + r], v)) {
			window["set" + r] = v;
			window["ref" + r] = "yes"
		}
		if (window["svg" + r] != n.Layout.Text2.text.toString() && window["svg" + r] != n.Layout.Text3.text.toString()) {
			window["ref" + r] = "yes"
		}
		if (n.Element.children.length == 0) {
			window["ref" + r] = "yes";
			var m = document.createElement("div");
			m.setAttribute("id", r);
			n.Element.appendChild(m)
		} else if (window["ref" + r] == "yes") {
			$("#" + r).empty()
		}
		n.Element.style.overflow = "hidden";
		n.Element.style.position = "relative";
		$("#" + r).css("position", "relative");
		exPosX = $("#" + r).parent().parent().position().left;
		exPosY = $("#" + r).parent().parent().position().top;
		var g = {
			stroke : "#454545"
		};
		var y = {
			stroke : "#454545",
			"fill-opacity" : 0
		};
		if (a == "1") {
			g["stroke-width"] = .5;
			y["stroke-width"] = .5
		} else {
			g["stroke-width"] = 0;
			y["stroke-width"] = 0
		}
		var b = n.Layout.Text2.text.toString();
		if (n.Layout.Text3.text.toString()) {
			b = n.Layout.Text3.text.toString()
		} else if (b == "none") {
			b = ""
		}
		var w = n.Layout.Text4.text.toString();
		if (!w) {
			w = 0
		}
		if (b) {
			if (b != window["svg" + r] || window["ref" + r] == "yes") {
				window["ref" + r] = "no";
				window["svg" + r] = b;
				alert("HEY");
				$.ajax({
					url : path + b,
					type : "GET",
					dataType : "text",
					success : function(t) {
						var a = null;
						if (window.DOMParser) {
							var l = new DOMParser;
							a = l.parseFromString(t, "text/xml")
						} else if (window.ActiveXObject) {
							a = new ActiveXObject("Microsoft.XMLDOM");
							a.async = false;
							a.loadXML(t)
						}
						var p = $(a).find("svg");
						if ($(p).attr("height")) {
							s = unitCheck($(p).attr("height"))
						}
						if ($(p).attr("width")) {
							o = unitCheck($(p).attr("width"))
						}
						o = parseFloat(o);
						s = parseFloat(s);
						i = 1;
						if (s > o) {
							i = n.GetHeight() / s
						} else {
							i = n.GetWidth() / o
						}
						window["sj" + r] = svgJson($(p), h, i, w, r);
						window["R" + r] = Raphael(r, n.GetWidth(), n.GetHeight());
						e = window["R" + r].set();
						boom(window["sj" + r], window["R" + r], "none", g, y);
						e = loopData(n.Data, f, e, r);
						if (parseInt(f) === 1) {
							var d = e.getBBox();
							c = [d.x, d.y, d.width, d.height]
						} else {
							if ($(p).attr("viewBox")) {
								u = $(p).attr("viewBox")
							} else {
								u = ""
							}
							if (u) {
								c = $(p).attr("viewBox").toString().split(" ")
							} else {
								c = ["0", "0", o, s]
							}
						}
						window["vb" + r] = c;
						window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
					}
				})
			} else if (window["sj" + r]) {
				window["R" + r].forEach(function(e) {
					if (e.attr("fill") != h && e.attr("fill") != "none") {
						e.attr("fill", h);
						e.attr("fill-opacity", 1)
					}
				});
				c = window["vb" + r];
				e = window["R" + r].set();
				e.attr({
					stroke : "#ff0000"
				});
				e = loopData(n.Data, f, e, r);
				if (parseInt(f) === 1) {
					var E = e.getBBox();
					c = [E.x, E.y, E.width, E.height]
				} else {
					if ($(svgInfo).attr("viewBox")) {
						u = $(svgInfo).attr("viewBox")
					} else {
						u = ""
					}
					if (u) {
						c = $(svgInfo).attr("viewBox").toString().split(" ")
					} else {
						c = ["0", "0", o, s]
					}
				}
				window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
			}
			if (parseInt(l) === 1) {
				$(".cHold").remove();
				$("<div />").addClass("cHold").html("<div class='controls'></div>").appendTo("#" + r);
				$(".controls").css("background", "url(" + path + "controls.png) transparent top left");
				$("<a />").addClass("zoomIn").click(function() {
					var e = .8;
					c[2] = c[2] * e;
					c[3] = c[3] * e;
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).appendTo(".controls");
				$("<a />").addClass("zoomOut").click(function() {
					var e = 1.25;
					c[2] = c[2] * e;
					c[3] = c[3] * e;
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).appendTo(".controls");
				$("<a />").click(function() {
					var e = c[2] / 2;
					if (parseInt(c[0]) + e < o - e) {
						c[0] = parseInt(c[0]) + e
					} else {
						c[0] = o - e
					}
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).addClass("panRight").appendTo(".controls");
				$("<a />").click(function() {
					var e = parseInt(c[0]);
					var t = c[2] / 2;
					if (parseInt(c[0]) - t > 0) {
						c[0] = parseInt(c[0]) - t
					} else {
						c[0] = 0
					}
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).addClass("panLeft").appendTo(".controls");
				$("<a />").click(function() {
					var e = c[3] / 2;
					if (parseInt(c[1]) + e < s) {
						c[1] = parseInt(c[1]) + e
					} else {
						c[1] = s
					}
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).addClass("panDown").appendTo(".controls");
				$("<a />").click(function() {
					var e = c[2] / 2;
					if (parseInt(c[1]) - e > 0) {
						c[1] = parseInt(c[1]) - e
					} else {
						c[1] = 0
					}
					window["R" + r].setViewBox(c[0], c[1], c[2], c[3])
				}).addClass("panUp").appendTo(".controls")
			}
		} else {
			$("#" + r).html("Please specify an SVG file to load from the extension directory")
		}
	}, false)
}
