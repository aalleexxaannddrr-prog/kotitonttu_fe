import React from "react";
import styles from "./TitleH2.module.css";

export default function TitleH2({ text }) {
	return <h2 className={styles.title}>{text}</h2>;
}
