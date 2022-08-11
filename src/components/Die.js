import React from "react"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
    const dieDotsArray = ["1-dot, 2-dot, 3-dot, 4-dot, 5-dot, 6-dot"]
    const dieDots = dieDotsArray[props.value - 1]
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {true ? 
                <h2 className="die-num">{props.value}</h2> : 
                <h2 className={dieDots}>dots</h2>}
        </div>
    )
}