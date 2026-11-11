export default {
    bind(el) {
        let oDiv = el
        let oDivChild = el.childNodes[0]

        document.onselectstart = function() {
            return false
        }
        oDivChild.onmousedown = function(e) {

            let disX = e.clientX - oDiv.offsetLeft
            let disY = e.clientY - oDiv.offsetTop
            document.onmousemove = function(e) {

                let l = e.clientX - disX
                let t = e.clientY - disY

                oDiv.style.left = l + 'px'
                oDiv.style.top = t + 'px'
            }
            document.onmouseup = function(e) {
                document.onmousemove = null
                document.onmouseup = null
            }
            return false
        }
    }
}
