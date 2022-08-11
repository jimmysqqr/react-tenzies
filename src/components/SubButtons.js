import React from "react";

export default function SubButtons(props) {
	return (
		<div>
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
