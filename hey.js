// var canvas_element = document.getElementById("myCanvas");
// var ctx = canvas_element.getContext("2d");
// var width = canvas_element.width;
// var height = canvas_element.height;

var width = 100;
var height = 100;
var main_viz;

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
function draw_svg(note_name, note_octave, rawVelocity) {
    rand_points = generate_points(1);

    // create svg drawing
    var svgEl = document.createElement('div');
    svgEl.className = 'art';
    var old = document.getElementsByClassName('art')[0];
    document.body.replaceChild(svgEl, old);
    var draw = SVG(svgEl);
    main_viz = draw;
    // abs bruh
    main_viz.opacity(Math.abs((100-rawVelocity)/100));
    console.log(Math.abs((100-rawVelocity)/100));
    // var rect = draw.rect(rand_points[0].x, rand_points[0].y);
    var rect = draw.rect(rawVelocity, rand_points[0].y);
    // console.log(note_name, note_octave, notes_dict[note_name][0], octave_dict[note_octave][0]);
    var gradient = draw.gradient('linear', function(stop) {
        stop.at(0, notes_dict[note_name][0])
        stop.at(1, octave_dict[note_octave][0])
    });
    // console.log(gradient);
    rect.attr({ fill: gradient });

    draw.viewbox({ x:0, y:0, width:100, height:100 });

    var group = draw.group();
}

function edit_opac(opac) {
    main_viz.opacity(opac);
}
// noteon: play a note;
// noteoff: stop playing a note;
// keyaftertouch: alter the pressure value associated with a specific note;
// controlchange: send control information (modulation, volume, pan, etc.);
// channelmode: send channel status (all sounds off, reset, all notes off, etc.);
// programchange: change to a specific patch/program number;
// channelaftertouch: alter the global pressure associated with a channel;
// pitchbend: bend the pitch of the sound by a certain amount.

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
            console.log(e);
            draw_svg(e.note.name, e.note.octave, e.rawVelocity);
          // console.log(e);
          // console.log(e.type);
        }
      );

     input.addListener('channelaftertouch', 'all',
        function(e) {
            //modify opacity just to see effect
            // console.log(SVG.get(main_viz));
            edit_opac(Math.abs((100-e.data[1])/100));
            // draw_svg(e.note.name, e.note.octave, e.rawVelocity);
        }
    );

  }

});