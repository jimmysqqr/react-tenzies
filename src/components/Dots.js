import { nanoid } from "nanoid";
import React from "react";

export default function Dots(props) {

	function Dot() {
		return <div className="dot"></div>;
	}

	const dotsArray = [...Array(props.value)].map(() => <Dot key={nanoid()} />);

    const dotsStyleArray = ["dot-1, dot-2, dot-3, dot-4, dot-5, dot-6"]
    const dotsStyle = dotsStyleArray[props.value - 1]

	return <div className="dot-container">{dotsArray}</div>;
}
