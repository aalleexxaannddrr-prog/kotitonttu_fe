import React from 'react';
import styles from './ChatDialogues.module.css';
import {useSelector} from "react-redux";

export default function ChatDialogues({
	dialogueState, users,
	onSelect,
	selectedDialogue,
	status,
}) {
	const LAST_MESSAGE_MAX_LENGTH = 35
	if (status === 'loading') {
		return <div className={styles.loading}>Загрузка диалогов...</div>;
	}

	if (status === 'failed') {
		return <div className={styles.error}>Ошибка загрузки диалогов</div>;
	}


	return (
		<div className={styles.dialogues_list}>
			{
			users.map(user => {
				const unsortedMessages = dialogueState.find(dialogue => dialogue?.interlocutor?.email === user.email)?.messages;
				let sortedMessages = null;
				if (unsortedMessages){
					sortedMessages = [...unsortedMessages].sort((a, b) => new Date(b.createdAt+'Z') - new Date(a.createdAt+'Z'));
				}
				if (sortedMessages){
					console.log("last message" +  JSON.stringify(sortedMessages[0].messageContent));
				}

				return(<div
					key={user.id}
					className={`${styles.dialogue_item} ${
						selectedDialogue?.id === user.id ? styles.selected : ''
					}`}
					onClick={() => onSelect(user)}
				>
					<h4>{user.name}</h4>
					<p>{sortedMessages ? (sortedMessages[0].messageContent.length > LAST_MESSAGE_MAX_LENGTH ? sortedMessages[0].messageContent.slice(0,LAST_MESSAGE_MAX_LENGTH)+"...": sortedMessages[0].messageContent): user.lastMessage}</p>
				</div>)
			})}
		</div>
	);
}
