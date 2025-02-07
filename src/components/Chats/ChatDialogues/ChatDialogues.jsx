import React from 'react';
import styles from './ChatDialogues.module.css';
import {useSelector} from "react-redux";

export default function ChatDialogues({
	dialogueState, users,
	onSelect,
	selectedDialogue,
	status,
	loadMore,
	totalPages,
	currentPage
}) {
	const LAST_MESSAGE_MAX_LENGTH = 35
	if (status === 'loading') {
		return <div className={styles.loading}>Загрузка диалогов...</div>;
	}

	if (status === 'failed') {
		return <div className={styles.error}>Ошибка загрузки диалогов</div>;
	}

	const sortedUsers = [...users].sort((a, b) => {
		const aDialogue = dialogueState.find(dialogue => dialogue?.interlocutor?.email === a.email)?.messages;
		const bDialogue = dialogueState.find(dialogue => dialogue?.interlocutor?.email === b.email)?.messages;

		const aLastMessageDate = aDialogue && aDialogue.length > 0
			? new Date(aDialogue[aDialogue.length - 1].createdAt + 'Z')
			: null;

		const bLastMessageDate = bDialogue && bDialogue.length > 0
			? new Date(bDialogue[bDialogue.length - 1].createdAt + 'Z')
			: null;

		// Сортировка по дате последнего сообщения
		if (aLastMessageDate && bLastMessageDate) {
			return bLastMessageDate - aLastMessageDate; // От большего к меньшему
		}
		if (aLastMessageDate) {
			return -1; // a выше
		}
		if (bLastMessageDate) {
			return 1; // b выше
		}
		return 0; // Оба без сообщений
	});


	return (
		<div className={styles.dialogues_list}>
			{
			sortedUsers.map(user => {
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
			{currentPage !== totalPages - 1 &&
				<button className={styles.loadMoreButton} onClick={loadMore}>
					Загрузить еще
				</button>
			}
		</div>
	);
}
