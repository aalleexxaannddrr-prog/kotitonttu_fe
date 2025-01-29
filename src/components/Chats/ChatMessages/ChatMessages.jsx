import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '../../../store/slices/messagesSlice';
import styles from './ChatMessages.module.css';
import { LuSend } from 'react-icons/lu';
import {fetchDialogues} from "../../../store/slices/dialoguesSlice";

export default function ChatMessages({dialogueState, newMessage, setNewMessage, selectedDialogue }) {
	let dialogue = dialogueState.find(dialogue => dialogue?.interlocutor?.email === selectedDialogue?.email) || selectedDialogue;
	const [messages, setMessages] = useState(dialogue.messages || []);
	const [messagesLength, setMessagesLength] = useState(dialogue.messages.length || 0);
	const [scrollState, setScrollState] = useState(false)
	const dispatch = useDispatch();
	const { userId } = useSelector(state => state.auth);
	const { bearerToken } = useSelector(state => state.auth);
	const textareaRef = useRef(null);
	const endMessagesRef = useRef(null);

	// Обновляем сообщения при выборе нового диалога
	useEffect(() => {
		if (dialogue && dialogue.messages) {
			// Преобразование сообщений в нужный формат
			setMessages(dialogue.messages.map((msg) => ({
				senderId: msg.direction === 'incoming' ? dialogue.interlocutor.email : userId,
				content: msg.messageContent,
				createdAt: msg.createdAt,
			})))
		}
		setScrollState(true) // Скроллим к последнему сообщению
	}, [selectedDialogue]);

	// Скролл к последнему сообщению при изменении диалога, получении нового сообщения или отправке сообщения
	useEffect(() => {
		if (endMessagesRef.current && scrollState) {
			console.log("Меня вызвали")
			setScrollState(false)
			endMessagesRef.current.scrollIntoView({ behavior: 'instant', block: 'nearest' });
		}
	}, [scrollState]);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			// Обновляем локальный список сообщений
			const newMsg = {
				senderId: userId,
				content: newMessage,
			};
			console.log("New message:" + newMessage);
			setMessages(prevMessages => [...prevMessages, newMsg]);
			setScrollState(true)
			dispatch(
				sendMessage({
					senderId: userId,
					receiverId: selectedDialogue.id, // ID получателя
					messageContent: newMessage,
					bearerToken,
				})
			)
				.unwrap()
				.then(() => {
					console.log('Message sent successfully');
					//fetchDialogues({userId: userId, bearerToken: bearerToken})
				})
				.catch(error => {
					console.error('Error sending message:', error);
					setMessages(prevMessages => prevMessages.slice(0,-1))
				});

			console.log("New message:" + newMessage);
			// Очищаем поле ввода
			setNewMessage('');
		}
	};

	// Отправка сообщения при нажатии Enter без Shift
	const handleKeyDown = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// Эффект для обновления списка сообщений (вызывается каждые 5 секунд)
	useEffect(() => {
		const intervalId = setInterval(() => {
			dispatch(fetchDialogues({ userId: userId, bearerToken: bearerToken })
			)
				.unwrap()
				.catch(error => {
					console.error('Error fetching dialogues:', error);
				});
		}, 5000);
		setMessages(dialogue.messages.map((msg) => ({
			senderId: msg.direction === 'incoming' ? dialogue.interlocutor.email : userId,
			content: msg.messageContent,
			createdAt: msg.createdAt,
		})));

		if (messages.length > messagesLength){
			setMessagesLength(messages.length)
			setScrollState(true)
		}
		return () => clearInterval(intervalId);
	}, [dispatch, userId, bearerToken, selectedDialogue.id, dialogueState]);

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

	// Получение даты без времени в виде строки
	const getDateString = (date) => {
		const d = new Date(date);
		return d.toISOString().split('T')[0];
	};

	let lastDate = null;
	return (
		<div className={styles.messages_container}>
			<div className={styles.messages_list}>
				{messages.map((message, index) => {
					const isSentByUser = message.senderId === userId; // Отправлено ли сообщение текущим пользователем
					const date = message.createdAt? new Date(message.createdAt + "Z"): new Date();
					const messageDateString = message.createdAt ? getDateString(message.createdAt) : null;
					const showDate = messageDateString && (messageDateString !== lastDate);
					if (showDate) {
						lastDate = messageDateString;
					}
					return(
					<React.Fragment key={index}>
						{showDate && (
							<div className={styles.date_separator}>
								{new Date(lastDate).toLocaleDateString('ru-Ru', { day: 'numeric', month: 'long', year: 'numeric' })}
							</div>
						)}
						<div
							className={
								isSentByUser
									? styles.message_received
									: styles.message_sent
							}
						>
							<div className={styles.message_content}>
								<p className={styles.message_text}>
									{message.content?.split('\n').map((line, lineIndex) => (
										<span key={lineIndex}>
											{line}
											{lineIndex < message.content.split('\n').length - 1 && <br />}
										</span>
									))}
								</p>

								<span className={styles.message_time}>
									{(() => {
										return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
									})()}
								</span>

							</div>
						</div>
					</React.Fragment>
				)})}
				<div ref={endMessagesRef}></div>
			</div>
			<div className={styles.message_container}>
				<textarea
					className={styles.textarea}
					ref={textareaRef}
					type='text'
					value={newMessage}
					onChange={e => {
						if(e.target.value.length < 256) setNewMessage(e.target.value);
					}}
					onKeyDown={handleKeyDown}
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
