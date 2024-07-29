import React from "react";
import styles from "./TypesContainer.module.css";
import { useSelector } from "react-redux";
import TypeCard from "../TypeCard/TypeCard";

export default function TypesContainer() {
	const { types } = useSelector(state => state.types);

	return (
		<div className={styles.wrapper}>
			<div className='container'>
				<div className={styles.container_cards}>
					{types.map(el => (
						<TypeCard key={el.id} {...el} />
					))}
				</div>
			</div>
		</div>
	);
}
