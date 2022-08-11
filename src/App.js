import React from "react";
import Die from "./components/Die";
import Stats from "./components/Stats";
import SubButtons from "./components/SubButtons";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import "./style.css";

/**
 * TODO:
 * 1. add CSS buttons
 * 2. add function to toggle dice view
 * 3. put as separate component
 * 4. fix time duration
 */

export default function App() {
	const [dice, setDice] = React.useState(allNewDice());
	const [tenzies, setTenzies] = React.useState(false);
	const [roll, setRoll] = React.useState(0);
	const [startTime, setStartTime] = React.useState(new Date());
	const [duration, setDuration] = React.useState(0);

	const [record, setRecord] = React.useState(
		() =>
			JSON.parse(localStorage.getItem("record")) || {
				roll: -1,
				duration: -1,
			}
	);

	const [diceView, setDiceView] = React.useState("number");

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
			console.log(roll, record.roll, duration, record.duration);
			if (roll < record.roll || record.roll === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, roll: roll };
				});
			}
			if (duration < record.duration || record.duration === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, duration: duration };
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
			const duration = Math.floor((new Date() - startTime) / 1000);
			setDuration(duration);
		} else {
			setTenzies(false);
			setDice(allNewDice());
			setRoll(0);
			setDuration(0);
			setStartTime(new Date());
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
			duration: -1,
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
			<Stats roll={roll} time={duration} record={record} />
			<button className="roll-dice" onClick={rollDice}>
				{tenzies ? "New Game" : "Roll"}
			</button>
			<SubButtons toggleDiceView={toggleDiceView} clearRecord={clearRecord} />
		</main>
	);
}
