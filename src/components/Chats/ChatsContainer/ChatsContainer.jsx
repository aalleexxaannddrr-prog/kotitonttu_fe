import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatDialogues from '../ChatDialogues/ChatDialogues';
import ChatMessages from '../ChatMessages/ChatMessages';
import styles from './ChatsContainer.module.css';
import { fetchUsers } from '../../../store/slices/usersSlice';
import {fetchDialogues} from "../../../store/slices/dialoguesSlice";

export default function ChatsContainer({ userId }) {
	const dispatch = useDispatch();
	const users = useSelector(state => state.users.users); // Получаем список пользователей
	const usersStatus = useSelector(state => state.users.status);
	const currentUser = useSelector(state => state.auth.user); // Получаем текущего пользователя
	const dialoguesMessagesStatus = useSelector(state => state.dialogues.data);

	const [selectedDialogue, setSelectedDialogue] = useState(null);
	const [newMessage, setNewMessage] = useState('');

	// Загружаем пользователей при монтировании
	useEffect(() => {
		if (usersStatus === 'idle') {
			dispatch(fetchUsers());
		}
		if (dialoguesMessagesStatus === 'idle'){
			dispatch(fetchDialogues({id: currentUser?.id, bearerToken: currentUser?.bearerToken}))
		}
	}, [dispatch, usersStatus]);

	// Обработчик события нажатия клавиш
	useEffect(() => {
		const handleKeyDown = event => {
			if (event.key === 'Escape') {
				setSelectedDialogue(null); // Закрыть текущий диалог
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	const handleSendMessage = () => {
		if (newMessage.trim() && selectedDialogue) {
			const updatedMessages = [
				...selectedDialogue.messages,
				{ senderId: userId, content: newMessage },
			];
			setSelectedDialogue({ ...selectedDialogue, messages: updatedMessages });
			setNewMessage('');
		}
	};

	// Создаем массив диалогов, исключая авторизованного пользователя
	const dialogues = users
		.filter(user => user.email !== currentUser?.email) // Исключаем текущего пользователя
		.map(user => ({
			id: user.id,
			name: `${user.firstname} ${user.lastname}`,
			lastMessage: 'Начните переписку', // Последнее сообщение, если нет истории
			userId: userId,
			messages: [], // Пустой массив сообщений, т.к. это тестовые данные
		}));

	return (
		<div className='container'>
			<div className={styles.chat_container}>
				<div className={styles.dialogues_column}>
					<ChatDialogues
						dialogues={dialogues}
						onSelect={setSelectedDialogue}
						selectedDialogue={selectedDialogue}
						status={usersStatus}
					/>
				</div>
				{selectedDialogue ? (
					<ChatMessages
						dialogue={selectedDialogue}
						onSendMessage={handleSendMessage}
						newMessage={newMessage}
						setNewMessage={setNewMessage}
					/>
				) : (
					<div className={styles.no_dialogue}>
						Выберите диалог для начала общения
					</div>
				)}
			</div>
		</div>
	);
}
