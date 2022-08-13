import React from "react";
import "./SubButtons.css"

export default function SubButtons(props) {
	return (
		<div className="sub-buttons-container">
			<button
				className="sub-button toggle-dice-view"
				onClick={props.toggleDiceView}
			>
				Toggle Dice View
			</button>
            <button
				className="sub-button restart-game"
				onClick={props.restartGame}
			>
				Restart Game
			</button>
			<button
				className="sub-button clear-record"
				onClick={props.clearRecord}
			>
				Clear Record
			</button>
		</div>
	);
}
