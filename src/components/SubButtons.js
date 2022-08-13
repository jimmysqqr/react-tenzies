import React from "react";
import "./SubButtons.css"

export default function SubButtons(props) {
	return (
		<div className="sub-buttons-container">
			<button
				className="toggle-dice-view"
				onClick={props.toggleDiceView}
			>
				Toggle Dice View
			</button>
			<button
				className="clear-record"
				onClick={props.clearRecord}
			>
				Clear Record
			</button>
		</div>
	);
}
