import React from "react";
import "./Stats.css"

export default function Stats(props) {
	function formatSeconds(time) {
		return Math.floor(time / 1000);
	}

	function formatMilliseconds(time) {
		return (time / 10).toString().slice(-2, -1);
	}

	return (
		<div className="stats">
			<p>Rolls: {props.roll}</p>
			{/* <p>milliseconds: {(props.time / 10)}</p> */}
			<p>
				Time:
				{` ${formatSeconds(props.time)}.${formatMilliseconds(props.time)}`}
				s
			</p>
			<p>
				Best rolls: {props.record.roll === -1 ? "-" : props.record.roll}
			</p>
			<p>
				Best time:
				{props.record.time === -1
					? " -"
					: ` ${formatSeconds(props.record.time)}.${formatMilliseconds(props.record.time)}s`}
			</p>
		</div>
	);
}
