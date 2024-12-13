import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../store/slices/messagesSlice';
import styles from './ChatMessages.module.css';

export default function ChatMessages({ dialogue, newMessage, setNewMessage }) {
	const [messages, setMessages] = useState(dialogue.messages || []);
	const dispatch = useDispatch();
	const { userId } = useSelector(state => state.auth);
	const { bearerToken } = useSelector(state => state.auth);

	// Обновляем сообщения при выборе нового диалога
	useEffect(() => {
		setMessages(dialogue.messages || []);
	}, [dialogue]);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// Обновляем локальный список сообщений
			const newMsg = {
				senderId: userId,
				content: newMessage,
			};
			setMessages(prevMessages => [...prevMessages, newMsg]);

			// Отправляем сообщение на сервер
			dispatch(
				sendMessage({
					senderId: userId,
					receiverId: dialogue.id, // ID получателя
					messageContent: newMessage,
					bearerToken,
				})
			)
				.unwrap()
				.catch(error => {
					console.error('Error sending message:', error);
				});

			// Очищаем поле ввода
			setNewMessage('');
		}
	};

	return (
		<div className={styles.messages_container}>
			<div className={styles.messages_list}>
				{messages.map((message, index) => (
					<div
						key={index}
						className={
							message.senderId === userId
								? styles.message_sent
								: styles.message_received
						}
					>
						<p>{message.content}</p>
					</div>
				))}
			</div>
			<div className={styles.message_input_container}>
				<input
					type='text'
					value={newMessage}
					onChange={e => setNewMessage(e.target.value)}
					placeholder='Введите сообщение...'
				/>
				<button onClick={handleSendMessage}>Отправить</button>
			</div>
		</div>
	);
}
