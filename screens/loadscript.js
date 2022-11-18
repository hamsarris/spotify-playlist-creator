window.onload = function() {
    set();
    pageload();
    VIS();
    tier();
    document.getElementById('blank').style.opacity = 0;

    document.querySelector('#blank').addEventListener('transitionend', () => {
        document.getElementById('blank').style.display = 'none';
    });
};

/* ---------------- SITE LOAD JAVASCRIPT ---------------- */
ids = []

function set() {
    console.log('yo')
    for (let i = 0; i < document.getElementsByClassName("screen").length; i++) {
        ids.push(document.getElementsByClassName("screen")[i].id)

        function value() { if (i == 0) { return "visible" } else { return "hidden" } }
        document.getElementById(ids[i]).style.visibility = value()
        active = 0
    }
    console.log(ids);
}

function next() {
    for (let i = 0; i < ids.length; i++) { document.getElementById(ids[i]).style.visibility = "hidden" }

    active++
    if (active >= ids.length) { active = 0 }
    document.getElementById(ids[active]).style.visibility = "visible"
}

document.onkeypress = function(eventKeyName) {
    eventKeyName = eventKeyName || window.event;
    if (eventKeyName.keyCode == 13) { next() }
};

/* ---------------- SPOTIFY API JAVASCRIPT ---------------- */
var link

function pageload() {
    base = 'https://accounts.spotify.com/authorize?';
    clientid = 'b64e0ee8a7f94570a2472c7e0e634d35';
    scope = 'user-read-currently-playing';
    redirect = 'http://127.0.0.1:5500/index.html';

    link = base + 'client_id=' + clientid + '&scope=' + scope + '&redirect_uri=' + redirect + '&response_type=token&show_dialog=true';

    document.getElementById('authorise').href = link;
}

function getURLQuery(u) {
    var q = window.location.hash.substring(1)
    var v = q.split('&')
    for (var i = 0; i < v.length; i++) {
        var pair = v[i].split("=")
        if (pair[0] == u) {
            return pair[1]
        }
    }
    return false
}

/* ---------------- TIER LIST JAVASCRIPT ---------------- */
function tier() {
    /* draggable element */
    const item = document.getElementsByClassName("item");

    for (let i = 0; i < item.length; i++) {
        item[i].addEventListener('dragstart', dragStart);
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        setTimeout(() => {
            e.target.classList.add('hide');
        }, 0);
    }


    /* drop targets */
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.addEventListener('dragenter', dragEnter)
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
    });


    function dragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragOver(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    function dragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    function drop(e) {
        e.target.classList.remove('drag-over');

        // get the draggable element
        const id = e.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);

        // add it to the drop target
        e.target.appendChild(draggable);

        // display the draggable element
        draggable.classList.remove('hide');
    }
}

/* ---------------- MUSIC VIS JAVASCRIPT ---------------- */
function VIS() {

    var file = document.getElementById("thefile");
    var audio = document.getElementById("audio");

    file.onchange = function() {
        var files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        var context = new AudioContext();
        var src = context.createMediaElementSource(audio);
        var analyser = context.createAnalyser();

        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        var ctx = canvas.getContext("2d");

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 256;

        var bufferLength = analyser.frequencyBinCount / 4;
        console.log(bufferLength);

        var dataArray = new Uint8Array(bufferLength);

        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var barWidth = (WIDTH / bufferLength) * 2.5;
        var barHeight;
        var x = 0;

        function renderFrame() {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            requestAnimationFrame(renderFrame);

            x = 0;

            analyser.getByteFrequencyData(dataArray);

            ctx.fillStyle = 'rgba(0, 0, 0, 0)';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

                ctx.fillStyle = "rgba(200,200,200,0.2)";
                ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

                x += barWidth + 10;
            }
        }

        audio.play();
        renderFrame();
    };
};