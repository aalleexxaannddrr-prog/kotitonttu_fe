import React from 'react';
import styles from './ChatDialogues.module.css';

export default function ChatDialogues({
	dialogues,
	onSelect,
	selectedDialogue,
	status,
}) {
	if (status === 'loading') {
		return <div className={styles.loading}>Загрузка диалогов...</div>;
	}

	if (status === 'failed') {
		return <div className={styles.error}>Ошибка загрузки диалогов</div>;
	}

	return (
		<div className={styles.dialogues_list}>
			{dialogues.map(dialogue => (
				<div
					key={dialogue.id}
					className={`${styles.dialogue_item} ${
						selectedDialogue?.id === dialogue.id ? styles.selected : ''
					}`}
					onClick={() => onSelect(dialogue)}
				>
					<h4>{dialogue.name}</h4>
					<p>{dialogue.lastMessage}</p>
				</div>
			))}
		</div>
	);
}
