import React from "react";
import styles from './ProductsByTypeCard.module.css'
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
			<h1 className={styles.title}>{selectedProduct.title}</h1>
			{selectedProduct.kinds &&
				selectedProduct.kinds.map(kind => (
					<Kind key={kind.id} kind={kind} />
				))}
		</div>
	);
}
