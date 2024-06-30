import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductsByTypeCard from "../ProductsByTypeCard/ProductsByTypeCard";

export default function ProductsByTypeContainer() {
	const { id } = useParams();
	const { data } = useSelector(state => state.data);
	// console.log("Redux state data:", data);
	const selectedProduct = data.find(product => product.id === Number(id));

	if (!selectedProduct) {
		return <div>Продукт не найден</div>;
	}

	return (
		<div className='container'>
			<ProductsByTypeCard {...selectedProduct} />
		</div>
	);
}
