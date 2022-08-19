# React Tenzies WebApp

This is a short and simple **Reactjs** project that I finished in a week to practice the React concepts I've learnt from [Scrimba - Learn React for Free](https://scrimba.com/learn/learnreact), an amazing introductory course taught by **Bob Ziroll**. In **11 hours** I've learnt concepts like _ReactDOM_, _components_, _state & props_, and basic _hooks_ to create **8 simple projects**.

This is a modified version of one of the guided projects in the course. I added suggested features along with my own ideas to the project. The webapp is deployed on **Vercel**.

Click this link to play the **modified** Tenzies game.

> [Scrimba React Tenzies (react-tenzies-hnajbo6bu-jimmysqqr.vercel.app)](https://react-tenzies-hnajbo6bu-jimmysqqr.vercel.app/)

Click this link to see the **original** Tenzies game from the guided project.

> [Tenzies: Extra Credit Ideas (scrimba.com)](https://scrimba.com/learn/learnreact/tenzies-extra-credit-ideas-co82b48eab99c792f6b884857)

# What is Tenzies?

Tenzies is a simple game where the goal is to roll 10 dice until they all have the same value. You can hold a die to keep its value between rolls.

# Features added

1. Number of rolls and time taken to win are tracked
2. Best record will be stored in your local browser
3. Dice view can be toggled to display either numbers or dots
4. Game can be quickly restarted to start a fresh new game
5. Record can be cleared from your local browser
6. Game view can be toggled to display either the modified or original project

# Learning Points

As the American philosopher John Dewey once said:

> ### “We do not learn from experience... we learn from reflecting on experience.”

<br>

A project is not complete without a proper reflection. Here are the 3 biggest challenges I faced in this project along with my thinking process and solutions.

<br>

---

## Challenge 1: Rendering elapsed time

**Problem**: I need to track the elapsed time as a state while playing the game, but how should I calculate or run a timer? How do I increment the timer by a second when a second has passed?

<br>

**Round 1**: We can store the `startTime` of a new game, and the elapsed time would be the calculated as the difference between `startTime` and when the game is finished.

```
const [startTime, setStartTime] = React.useState(new Date());
const [duration, setDuration] = React.useState(0);

const duration = Math.floor((new Date() - startTime) / 1000);
setDuration(duration);
```

This does work, but the time will only be updated when there are any changes to the state of the `<App>`. To make it more _realistic_ like a ticking time, we need to go beyond React.

<br>

**Round 2**: JavaScript Timing Events. We can use timing events to execute functions in time intervals, which is provided by the `window` object which represents an open window in a browser. In this case, we will use the `setInterval()` method to repeat a function at every specified time interval.

> window.setInterval(_function_, _milliseconds_);  
> _The window prefix can be ignored. The minimum milliseconds accepted is 10_

With this, we can increment the timer by 10ms, every 10ms. This will be executed in a `useEffect` function because the timer should only run when the game is still ongoing. Of course, we want the timer to stop when the game has ended, so we also return a cleanup function.

```
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
```

Since time is stored in **milliseconds**, we can format it with simple calculations. I figured that one-tenth of a second is enough precision for a game that does not require any accurate time-keeping. Now the timer runs in real-time, with a precision of 0.0s.

```
function formatSeconds(time) {
    return Math.floor(time / 1000);
}

function formatMilliseconds(time) {
    return (time / 10).toString().slice(-2, -1);
}
```
<br>

---

## Challenge 2: Storing new best record to browser's localStorage

**Problem**: Whenever there is a new best record, I need to update & store the record locally. We can use `localStorage` to store data, which is saved across browser sessions. 

<br>

**Round 1**: We first initialise a `record` state stored with the existing record from `localStorage`. If there is no existing record, we then pass a default object as seen below, which will be displayed as a blank record (dash: `-`).

```
const [record, setRecord] = React.useState(
    () => JSON.parse(localStorage.getItem("record"))
    || { roll: -1, time: -1 }
);
```

<br>

**Round 2**: We then write the logic for updating a record. The `record` state is updated when there is **either** a lower roll or a lower time record achieved, or both. We also keep track of another state called `isNewRecord` to allow for correct rendering in the `<Stats>` component.

```
if (roll < record.roll) {
    setRecord((prevRecord) => {
        return { ...prevRecord, roll: roll };
    });
    setIsNewRecord((prevIsNewRecord) => {
        return { ...prevIsNewRecord, roll: true };
    });
}
if (time < record.time) {
    setRecord((prevRecord) => {
        return { ...prevRecord, time: time };
    });
    setIsNewRecord((prevIsNewRecord) => {
        return { ...prevIsNewRecord, time: true };
    });
}
```

<br>

**Round 3**: Since a state update to `record` should only occur at the end of a game, it will be executed in a `useEffect` function used for checking the necessary endgame states.

The criteria to end a game are:
1. All dice are held
2. All dice have the same value

These criteria are checked every time an update to the `dice` array state is made *(i.e. when a die is held or when a die is rolled)*

```
React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);

    if (allHeld && allSameValue) {
        ...
        // logic to update record if there's a new record
        ...
        setIsTenzies(true);
    }
}, [dice]);
```

<br>

**Round 4**: Since an update to `localStorage` involves storage access beyond React's control, we use `useEffect` to check for any changes (improvements) compared to the previous `record` state, and then save to the `localStorage` if there is a new record. 

```
React.useEffect(() => {
    localStorage.setItem("record", JSON.stringify(record));
}, [record]);
```

<br>

---

## Challenge 3: Rendering dots on a dice with CSS

**Problem**: I need to render dots of the correct value and positions onto the 10 dice faces. How do I *create* a dot in the first place? How do I position each dot neatly and correctly? This challenge became a great opportunity for me to brush up my CSS skills.

<br>

**Round 1**: Rendering circles in CSS was surprisingly easy, it can be done using `<div>` with appropriate styles.

JS:
```
<div className="dot value-X-dot-X"></div>
```
CSS:
```
.dot {
    height: 0.6em;
    width: 0.6em;
    background-color: black;
    border-radius: 50%;
    margin: 0.1em;
}
```

<br>

**Round 2**: To position the dots neatly, we apply a 3x3 grid layout to the `dots-view-container`.

CSS:
```
.dots-view-container {
    display: grid;
    grid-template: repeat(3, 0.85em) / repeat(3, 1fr);
    margin: 0.35em;
}
```

Then, I *attempted* to **dynamically** render different number of `Dot` components for each die based on its value.

JS:
```
function Dot() {
    return <div className="dot"></div>;
}

const dotsArray = [...Array(props.value)].map((_, index) => <Dot key={index + 1} id={`dot-${index + 1}`} />);

return <div className={`dots-view-container dots-container-${props.value}`}>{dotsArray}</div>;
```

And as I try to position the dots in CSS, I eventually realised it was ***not feasible***.

**What's wrong?** In order to style / position each dot, I have to **uniquely** select each Dot with a unique id, and not just select the `<div>` tags. However, the problem arises from creating unique id's for each Dot across **two dice with the same value**. *(i.e. if all 10 dice have a six, it can become tedious to generate a unique id for every dot across every die.)*

<br>

**Round 3**: To overcome this, I could only **statically** render each type of value as a component. Thus I created components like OneDot, TwoDots, ThreeDots, etc.

JS:
```
///////////////////* OneDot.js */////////////////////
export default function OneDot() {
    return (
        <div className="dots-view-container" >
            <div className="dot value-1-dot-1"></div>
        </div>
    )
}

///////////////////* TwoDots.js */////////////////////
export default function TwoDots() {
    return (
        <div className="dots-view-container" >
            <div className="dot value-2-dot-1"></div>
            <div className="dot value-2-dot-2"></div>
        </div>
    )
}

// and so on...
```

These components also allow for easier CSS grid positioning of the individual dots specific to its value.

CSS:
```
.value-1-dot-1, .value-3-dot-2, .value-5-dot-5 {
    grid-column: 2;
    grid-row: 2;
}

.value-2-dot-1, .value-3-dot-1, .value-4-dot-3, .value-5-dot-3, .value-6-dot-5 {
    grid-column: 1;
    grid-row: 3;
}

.value-2-dot-2, .value-3-dot-3, .value-4-dot-2, .value-5-dot-2, .value-6-dot-2 {
    grid-column: 3;
    grid-row: 1;
}

// and so on...
```

All of which are integrated in the `<Die>` component by selecting the correct `<___Dots>` component based on the value provided.

JS:
```
const dotsComponentArray = [
    <OneDot />,
    <TwoDots />,
    <ThreeDots />,
    <FourDots />,
    <FiveDots />,
    <SixDots />,
];

const dotsComponent = dotsComponentArray[props.value - 1];
```


