import React from "react"
import Dots from "./Dots"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    const dieDotsArray = ["dot-1, dot-2, dot-3, dot-4, dot-5, dot-6"]
    const dieDots = dieDotsArray[props.value - 1]



    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {false ? 
                <h2 className="die-num">{props.value}</h2> : 
                <Dots value={props.value} />}
        </div>
    )
}