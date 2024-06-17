import React from "react";
import styles from "./TypeCard.module.css";
import TitleH2 from "../../Text/TitleH2/TitleH2";

export default function TypeCard({ id, title, description, path }) {
	// const imageUrl = `http://31.129.102.70:8080/${path}`;
	// console.log("Image URL:", imageUrl); // Логирование URL изображения
	return (
		<div className={styles.wrapper}>
			<div className={styles.card_container}>
				<img
					src={`http://31.129.102.70:8080/api/fileSystemTypes/${path}`}
					alt={title}
					className={styles.card_img}
				/>
				<div className={styles.card_descr}>
					<TitleH2 text={title} />
					<p>{description}</p>
				</div>
			</div>
		</div>
	);
}
