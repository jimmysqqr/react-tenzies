import React from "react";
import Die from "./components/dice/Die";
import Stats from "./components/Stats";
import SubButtons from "./components/SubButtons";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./App.css";

/**
 * TODO:
 * 1. add CSS dots /
 * 2. add function to toggle dice view /
 * 3. put as separate component /
 * 4. style dots /
 *      - cant render dynamically bcos cant have duplicate id's, so only solution now is to pre-render the 6 faces
 *      - create a subfolder for die dots
 *      - 1 component for each value (OneDot, TwoDots, ThreeDots ...)
 *      - have a separate css file to style the grid and placement of dots
 *      - or maybe concat the nanoid of the die to the dot id? no
 *      - or concat index of the die (from 0 to 9) "die-1-dot-1" (but die-1-dot-1 can be of the value 1 or 6, which is diff position) no
 * 5. fix time duration
 * 6. write what challenges i face and the solutions (localStorage->useEffect, dots css->prerender, time->timing events)
 */

export default function App() {
	const [dice, setDice] = React.useState(allNewDice());
	const [tenzies, setTenzies] = React.useState(false);
	const [roll, setRoll] = React.useState(0);
	// const [startTime, setStartTime] = React.useState(new Date());
	// const [duration, setDuration] = React.useState(0);

	const [record, setRecord] = React.useState(
		() =>
			JSON.parse(localStorage.getItem("record")) || {
				roll: -1,
				time: -1,
			}
	);

	const [diceView, setDiceView] = React.useState("number");
	const [time, setTime] = React.useState(0);

	// useEffect to render elapsed time
	React.useEffect(() => {
		let intervalID = null;

		if (!tenzies) {
			intervalID = window.setInterval(
				() => setTime((prevTime) => prevTime + 10),
				10
			);
		} else {
			window.clearInterval(intervalID);
		}
        
		return () => window.clearInterval(intervalID);
	}, [tenzies]);

	// useEffect to detect change in record
	React.useEffect(() => {
		localStorage.setItem("record", JSON.stringify(record));
	}, [record]);

	// useEffect to handle endgame states
	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);

		if (allHeld && allSameValue) {
			// logic to save to local storage if new record
			// console.log(roll, record.roll, time, record.time);
			if (roll < record.roll || record.roll === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, roll: roll };
				});
			}
			if (time < record.time || record.time === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, time: time };
				});
			}
			setTenzies(true);
		}
	}, [dice]);

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		};
	}

	function allNewDice() {
		const newDice = [];
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie());
		}
		return newDice;
	}

	function rollDice() {
		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie();
				})
			);
			setRoll((prevRoll) => prevRoll + 1);
			// const duration = Math.floor((new Date() - startTime) / 1000);
			// setDuration(duration);
		} else {
			setTenzies(false);
			setDice(allNewDice());
			setRoll(0);
			// setDuration(0);
			// setStartTime(new Date());
            setTime(0);
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
			})
		);
	}

	function toggleDiceView() {
		setDiceView((prevDiceView) => {
			return prevDiceView === "number" ? "dots" : "number";
		});
	}

	function clearRecord() {
		setRecord({
			roll: -1,
			time: -1,
		});
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
			diceView={diceView}
		/>
	));

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at
				its current value between rolls.
			</p>
			<div className="dice-container">{diceElements}</div>
			<button className="roll-dice" onClick={rollDice}>
				{tenzies ? "New Game" : "Roll"}
			</button>
			<Stats roll={roll} time={time} record={record} />
			<SubButtons
				toggleDiceView={toggleDiceView}
				clearRecord={clearRecord}
			/>
		</main>
	);
}
