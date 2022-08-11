import React from "react"
import Dots from "./Dots"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {props.diceView === "number" ? 
                <h2 className="die-num">{props.value}</h2> : 
                <Dots value={props.value} />}
        </div>
    )
}