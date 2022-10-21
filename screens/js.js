ids = []

function set(){
    for(let i=0; i < document.getElementsByClassName("screen").length; i++){
        ids.push(document.getElementsByClassName("screen")[i].id)
        function value(){if(i==0){return "block"}else{return "none"}}
        document.getElementById(ids[i]).style.display= value()
        active = 0
    }
    console.log(ids);
}

function next(){
    for(let i=0; i < ids.length; i++){document.getElementById(ids[i]).style.display="none"}

    active ++
    if(active>=ids.length){active=0}
    document.getElementById(ids[active]).style.display="block"
}

document.onkeypress = function (eventKeyName) {
    eventKeyName = eventKeyName || window.event;
    if(eventKeyName.keyCode==13){next()}
};