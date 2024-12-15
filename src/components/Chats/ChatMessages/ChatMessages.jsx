import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../store/slices/messagesSlice';
import styles from './ChatMessages.module.css';
import { LuSend } from 'react-icons/lu';

export default function ChatMessages({ dialogue, newMessage, setNewMessage }) {
	const [messages, setMessages] = useState(dialogue.messages || []);
	const dispatch = useDispatch();
	const { userId } = useSelector(state => state.auth);
	const { bearerToken } = useSelector(state => state.auth);
	const textareaRef = useRef(null);

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

	// Эффект для динамического изменения высоты textarea
	useEffect(() => {
		if (textareaRef.current) {
			// Сброс высоты перед перерасчетом
			textareaRef.current.style.height = 'auto';

			// Устанавливаем высоту textarea, ограничиваем максимумом 1/3 окна
			const maxHeight = window.innerHeight / 5;
			const newHeight = Math.min(textareaRef.current.scrollHeight, maxHeight);
			textareaRef.current.style.height = `${newHeight}px`;
		}
	}, [newMessage]); // Отслеживаем изменения в newMessage

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
			<div className={styles.message_container}>
				<textarea
					className={styles.textarea}
					ref={textareaRef}
					type='text'
					value={newMessage}
					onChange={e => setNewMessage(e.target.value)}
					rows={1}
					placeholder='Введите сообщение...'
				/>
				<button onClick={handleSendMessage}>
					<LuSend className={styles.send_icon} size={22}/>
				</button>
			</div>
		</div>
	);
}
