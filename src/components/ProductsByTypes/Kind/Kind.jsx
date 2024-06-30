import React from "react";
import Series from "../Series/Series";

export default function Kind({ kind }) {
	return (
		<div>
			<h2>{kind.title}</h2>
			<p>{kind.description}</p>
			{kind.series &&
				kind.series.map(series => <Series key={series.id} series={series} />)}
		</div>
	);
}
