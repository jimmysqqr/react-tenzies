import { nanoid } from "nanoid";
import React from "react";

export default function Dots(props) {

	function Dot() {
		return <div className="dot"></div>;
	}

	const dotsArray = [...Array(props.value)].map(() => <Dot key={nanoid()} />);

	return <div>{dotsArray}</div>;
}
