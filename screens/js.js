ids = []
active = 0

function set(){
    for(let i=0; i < document.getElementsByClassName("screen").length; i++){
        ids.push(document.getElementsByClassName("screen")[i].id)
    }
    console.log(ids);
}