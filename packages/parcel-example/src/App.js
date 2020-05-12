import { h } from 'preact';
import { useState } from 'preact/hooks';

export function App() {
	const [v] = useState(Math.random());
	const [w] = useState(Math.random());

	return (
		<div>
			Test <br />
			{v} <br /> {w}
		</div>
	);
}
