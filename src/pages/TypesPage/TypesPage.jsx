import React, { useEffect } from "react";
import TypesContainer from "../../components/TypesBrand/TypesContainer/TypesContainer";
import { useDispatch } from "react-redux";
import { fetchAllTypes } from "../../store/slices/typesSlice";
import { fetchProductsByTypes } from "../../store/slices/dataSlice";

export default function TypesPage() {
const dispatch = useDispatch()

useEffect(() => {
dispatch(fetchAllTypes());
dispatch(fetchProductsByTypes());
}, [dispatch])
	return (
		<div>
			<TypesContainer />
		</div>
	);
}
