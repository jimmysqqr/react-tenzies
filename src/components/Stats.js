import React from "react"

export default function Stats(props) {
    return (
        <div className="stats">
            <p>Rolls: {props.roll}</p>
            <p>Time: {props.time}s</p>
            <p>
                Best rolls: {props.record.roll === -1 ?
                            "-" : props.record.roll}
            </p>
            <p>
                Best time: {props.record.duration === -1 ? 
                            "-" : props.record.duration + "s"}
            </p>
        </div>
    )
}
