import React from 'react';
import styles from './ChatDetails.module.css';

export default function ChatDetails({ selectedChat }) {
	return (
		<div className={styles.chat_details}>
			{selectedChat ? (
				<>
					<div className={styles.chat_header}>
						<h2>{selectedChat.subject}</h2>
						<p className={styles.chat_text}>
							<strong className={styles.chat_descr}>От кого:</strong>{' '}
							{selectedChat.from}
						</p>
						<p className={styles.chat_text}>
							<strong className={styles.chat_descr}>Дата:</strong>{' '}
							{selectedChat.date}
						</p>
					</div>
					<div className={styles.chat_content}>{selectedChat.content}</div>
				</>
			) : (
				<p>Выберите чат, чтобы просмотреть детали.</p>
			)}
		</div>
	);
}
