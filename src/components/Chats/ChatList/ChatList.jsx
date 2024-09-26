import React from 'react';
import styles from './ChatList.module.css';

export default function ChatList({ chats, onSelectChat }) {
	return (
		<div className={styles.chat_list}>
			{chats.map(chat => (
				<div
					key={chat.id}
					className={styles.chat_item}
					onClick={() => onSelectChat(chat)}
				>
					<div className={styles.chat_from}>{chat.from}</div>
					<div className={styles.chat_subject}>{chat.subject}</div>
					<div className={styles.chat_date}>{chat.date}</div>
				</div>
			))}
		</div>
	);
}
