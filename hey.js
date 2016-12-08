// var canvas_element = document.getElementById("myCanvas");
// var ctx = canvas_element.getContext("2d");
// var width = canvas_element.width;
// var height = canvas_element.height;

var width = 100;
var height = 100;

// generate random points
function generate_points(n)
{
    points = [];
    for(var i = 0; i < n; i++)
    {
        points.push({
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height),
            radius: Math.floor(Math.random() * 50) + 20
        });
        points[i].origin_x = points[i].x;
        points[i].origin_y = points[i].y;
    }
    return points
}

var notes_dict = {
    A: ["#0080ff"],
    B: ["#ff6666"],
    C: ["#00cc66"],
    D: ["#ffff80"],
    E: ["#ff6600"],
    F: ["#ffccee"],
    G: ["#cc4499"]
};

console.log(notes_dict.A);
var octave_dict = {
    0: ["#cce66f"],
    1: ["#666699"],
    2: ["#000"],
    3: ["#ff0099"],
    4: ["#990000"],
    5: ["#009900"],
    6: ["#993333"],
    7: ["#990099"],
    8: ["#cc0066"]
};
function draw_svg(note_name, note_octave) {
    rand_points = generate_points(1);

    // create svg drawing
    var svgEl = document.createElement('div');
    svgEl.className = 'art';
    var old = document.getElementsByClassName('art')[0];
    document.body.replaceChild(svgEl, old);
    var draw = SVG(svgEl);
    var rect = draw.rect(rand_points[0].x, rand_points[0].y);

    console.log(note_name, note_octave, notes_dict[note_name][0], octave_dict[note_octave][0]);
    var gradient = draw.gradient('linear', function(stop) {
        stop.at(0, notes_dict[note_name][0])
        stop.at(1, octave_dict[note_octave][0])
    });
    console.log(gradient);
    rect.attr({ fill: gradient });

    draw.viewbox({ x:0, y:0, width:100, height:100 });

    var group = draw.group();
}

WebMidi.enable(function (err) {

  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    console.log("WebMidi enabled!");
    console.log(WebMidi.inputs);
    console.log(WebMidi.outputs);
    input = WebMidi.inputs[0];
    console.log(input);
     input.addListener('noteon', "all",
        function (e) {
          console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
          draw_svg(e.note.name, e.note.octave);
        }
      );
  }

});