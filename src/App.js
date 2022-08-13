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
 * 5. fix time duration /
 * 6. write what challenges i face and the solutions
 *      - (localStorage->useEffect, dots css->prerender, time->timing events)
 *      - learnt css (grid, draw circle, animation)
 * 7. modify the first game start - disable dice (no need), and change button to new game button / , only then start time /
 *      - remove all dice before game start (no) OR set all isHeld = false
 *
 * 8. restart game button /
 * 9. add the original game (more like hide the added features) /
 * 10. add some effect to stats record if got new record - blinking text color? /
 */

export default function App() {
	const [dice, setDice] = React.useState(allNewDice()); // array of objects
	const [isTenzies, setIsTenzies] = React.useState(false);
	const [roll, setRoll] = React.useState(0);
	const [time, setTime] = React.useState(0);

	const [record, setRecord] = React.useState(
		() =>
			JSON.parse(localStorage.getItem("record")) || {
				roll: -1,
				time: -1,
			}
	); // a single object

	const [diceView, setDiceView] = React.useState("number"); // "number", "dots"
	const [gameView, setGameView] = React.useState("new"); // "new", "old"
	const [isFirstStart, setIsFirstStart] = React.useState(true);
	const [isNewRecord, setIsNewRecord] = React.useState({
		roll: false,
		time: false,
	});

	// useEffect to render elapsed time
	React.useEffect(() => {
		let intervalID = null;

		if (!isFirstStart && !isTenzies) {
			intervalID = window.setInterval(
				() => setTime((prevTime) => prevTime + 10),
				10
			);
		} else {
			window.clearInterval(intervalID);
		}

		return () => window.clearInterval(intervalID);
	}, [isTenzies, isFirstStart]);

	// useEffect to sync states to trigger endgame
	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld);
		const firstValue = dice[0].value;
		const allSameValue = dice.every((die) => die.value === firstValue);

		if (allHeld && allSameValue) {
			// logic to update record if new record
			if (roll < record.roll || record.roll === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, roll: roll };
				});
				setIsNewRecord((prevIsNewRecord) => {
					return { ...prevIsNewRecord, roll: true };
				});
			}
			if (time < record.time || record.time === -1) {
				setRecord((prevRecord) => {
					return { ...prevRecord, time: time };
				});
				setIsNewRecord((prevIsNewRecord) => {
					return { ...prevIsNewRecord, time: true };
				});
			}
			setIsTenzies(true);
		}
	}, [dice]);

	// useEffect to detect change (improvement) in record
	React.useEffect(() => {
		localStorage.setItem("record", JSON.stringify(record));
	}, [record]);

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
		if (!isTenzies) {
			setRoll((prevRoll) => prevRoll + 1);
			if (isFirstStart) {
				// on first game start or game reset, re-roll all dice
				setIsFirstStart(false);
				setDice(allNewDice());
			} else {
				// in a game, only re-roll dice that are not held
				setDice((oldDice) =>
					oldDice.map((die) => {
						return die.isHeld ? die : generateNewDie();
					})
				);
			}
		} else {
			setIsTenzies(false);
			setDice(allNewDice());
			setRoll(0);
			setTime(0);
			setIsNewRecord({
				roll: false,
				time: false,
			});
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

	function toggleGameView() {
		setGameView((prevGameView) => {
			return prevGameView === "new" ? "old" : "new";
		});
	}

	function restartGame() {
		setIsFirstStart(true);
		setIsTenzies(false);
		setDice(allNewDice());
		setRoll(0);
		setTime(0);
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
			{isTenzies && <Confetti />}
			<h1 className="title">Tenzies</h1>
			<p className="instructions">
				Roll until all dice are the same. Click each die to freeze it at
				its current value between rolls.
			</p>
			<div className="dice-container" disabled={true}>
				{diceElements}
			</div>
			<button
				className={`roll-dice ${
					isFirstStart || isTenzies ? "new-game-color" : "roll-color"
				}`}
				onClick={rollDice}
			>
				{isFirstStart || isTenzies ? "New Game" : "Roll"}
			</button>
			{gameView === "new" && (
				<>
					<Stats
						roll={roll}
						time={time}
						record={record}
						isNewRecord={isNewRecord}
					/>
					<SubButtons
						toggleDiceView={toggleDiceView}
						restartGame={restartGame}
						clearRecord={clearRecord}
					/>
				</>
			)}
			<button className="toggle-game-view" onClick={toggleGameView}>
				Toggle Game View
			</button>
		</main>
	);
}
