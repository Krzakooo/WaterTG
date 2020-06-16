var objTile
class mapTile {
    constructor() {
        this.init();
    }
    init() {
        divTile = document.createElement("div")
        divTile.width = 50;
        divTile.height = 50;
        divTile.currentFacing = 5
        divTile.type = "wall"
        var heximg = document.createElement("img");
        divTile.setAttribute("class", "divTile")
        heximg.setAttribute("src", "hex.png");
        heximg.setAttribute("height", "50");
        heximg.setAttribute("width", "50");
        divTile.appendChild(heximg);
        divTile.addEventListener("click", this.onclick);
        divTile.addEventListener("contextmenu", this.oncontextmenu);

    }
    onclick() {
        this.type = currentType
        if (oldID != this.id) {
            ifrev = false
        }
        if (oldID != this.id && oldID != 2137) {
            notfirst = true
        }
        oldID = this.id
        objTile = {}
        objTile.x = this.x
        objTile.y = this.y
        objTile.id = parseInt(this.id)
        objTile.type = this.type
        objTile.out = this.currentFacing
        if (ifrev == false) {
            if (rev == 3 || rev == 4 || rev == 5) {
                constin = rev - 3
                ifrev = true
            } else if (rev == 2 || rev == 1 || rev == 0) {
                constin = rev + 3
                ifrev = true
            }
            console.log(rev)
        }
        rev = this.currentFacing
        if (notfirst == false) {
            if (rev == 3 || rev == 4 || rev == 5) {
                objTile.in = rev - 3
            } else if (rev == 2 || rev == 1 || rev == 0) {
                objTile.in = rev + 3
            }
        } else {
            objTile.in = constin
        }
        var params = document.getElementById("params")
        params.innerText = JSON.stringify(objTile, null, "\t")
        console.log(objTile)
        let quant = this.id
        obj[quant] = objTile
        console.log(obj)

        var facing = document.createElement("div")
        facing.innerText = this.currentFacing
        if (this.currentFacing < 5) {
            this.currentFacing++
        } else {
            this.currentFacing = 0
        }

        this.innerText = ""
        var heximg = document.createElement("img");
        heximg.setAttribute("src", "hex.png");
        heximg.setAttribute("height", "50");
        heximg.setAttribute("width", "50");
        this.appendChild(heximg)
        facing.style.position = "absolute"
        facing.style.left = "20px"
        facing.style.top = "14px"
        this.appendChild(facing)

        var arrow = document.createElement("img");
        arrow.setAttribute("src", "arrow.png");
        arrow.setAttribute("height", "50");
        arrow.setAttribute("width", "50");
        arrow.style.position = "absolute"
        arrow.style.left = "0px"
        arrow.style.top = "0px"
        arrow.style.transform = "rotate(" + this.angle + "deg)";
        this.angle += 60
        this.appendChild(arrow)


    }

}