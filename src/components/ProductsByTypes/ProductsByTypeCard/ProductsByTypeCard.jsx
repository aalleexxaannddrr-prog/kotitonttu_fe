import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Kind from "../Kind/Kind";

export default function ProductsByTypeCard() {
	const { id } = useParams();
	const { data } = useSelector(state => state.data);
	const selectedProduct = data.find(product => product.id === Number(id));

	if (!selectedProduct) {
		return <div>Продукт не найден</div>;
	}

	return (
		<div>
			<h1>{selectedProduct.title}</h1>
			<p>{selectedProduct.description}</p>
			{selectedProduct.kinds &&
				selectedProduct.kinds.map(kind => (
					<Kind key={kind.id} kind={kind} />
				))}
		</div>
	);
}
