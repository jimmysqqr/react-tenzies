import React from "react";
import OneDot from "./OneDot";
import TwoDots from "./TwoDots";
import ThreeDots from "./ThreeDots";
import FourDots from "./FourDots";
import FiveDots from "./FiveDots";
import SixDots from "./SixDots";
import "./dots.css";

export default function Die(props) {
	const styles = {
		backgroundColor: props.isHeld ? "#59E391" : "white",
	};

	const dotsComponentArray = [
		<OneDot />,
		<TwoDots />,
		<ThreeDots />,
		<FourDots />,
		<FiveDots />,
		<SixDots />,
	];
	const dotsComponent = dotsComponentArray[props.value - 1];

	return (
		<div
			className={`die-face ${
				props.diceView === "number" && "number-view-container"
			}`}
			style={styles}
			onClick={props.holdDice}
		>
			{props.diceView === "number" ? (
				<h2 className="die-num">{props.value}</h2>
			) : (
				<div>{dotsComponent}</div>
			)}
		</div>
	);
}
