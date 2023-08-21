import { Message } from "../Message/Message";
import { useCallback, useEffect, useRef, useState } from 'react';
import { TUser } from "../../App";
import { HubConnection } from "@microsoft/signalr";
import "./Chat.scss"

export interface IChatProps {
    connection?: HubConnection,
    selectedUser: TUser,
}

export enum MessageStatus {
    SendSuccess,
    Sending,
    SendError,
}

export interface IMessage {
    id: string,
    status: MessageStatus
}

export interface IMessageInput extends IMessage {
    from: string,
    text: string,
}

export interface IMessageOutput extends IMessage {
    to: string,
    text: string,
}

export type TMessage = IMessageInput | IMessageOutput;

export interface IInputPlace {
    onSubmit?: (text: string) => void
}

export function InputPlace({
    onSubmit,
}: IInputPlace) {

    const inputRef= useRef<HTMLInputElement>(null);
    const handleSubmitClick = useCallback(() => {
        if (onSubmit) {
            onSubmit(inputRef.current?.value ?? '');
            if (inputRef.current) {
               inputRef.current.value = ''
            }
            
        }
    }, []);

    return (
        <div className="chat__input">
            <input
                ref={inputRef}
                // className={classNames('input')}
                type="text"
                placeholder="Введите сообщение"
            />
            <button
                type="submit"
                onClick={handleSubmitClick}
            >
                Отправить
            </button>
        </div>
    );
}

export function Chat({
    connection,
    selectedUser,
}: IChatProps) {

    const [messages, setMessages] = useState<TMessage[]>([]);

    useEffect(() => {

        if (connection) {

            const hanlder = (data: IMessageInput) => {

                if(selectedUser.id === data.from) {

                    setMessages(messages => {
                        const newMessages = [...messages];
                       
                        let currentMessage: IMessageInput = {
                            id: crypto.randomUUID(),
                            from: data.from,
                            text: data.text,
                            status: MessageStatus.SendSuccess,
                        }
                        newMessages.push(currentMessage);
                        return newMessages;
                    });
                }
            }

            connection.on('MessageReceived', hanlder);
            return () => {
                connection?.off('MessageReceived', hanlder);
            }
        }

    }, [connection, selectedUser]);

    useEffect(() => {
        setMessages([]);
    }, [selectedUser]);

    const handleSubmit = useCallback(async (text: string) => {
        if(!text) return
           
        const message: IMessageOutput = {
            id: crypto.randomUUID(),
            to: selectedUser.id,
            status: MessageStatus.Sending,
            text,
        };

        setMessages(messages => {
            const newMessages = [...messages];
            newMessages.push(message);
            return newMessages;
        });

        let result = await connection?.invoke('SendMessage', message);
        setMessages(messages => {
            const newMessages = [...messages];
            const messageRef = newMessages.find(x => x.id === message.id);
            if(messageRef) {
                messageRef.status = result.ok
                ? MessageStatus.SendSuccess
                : MessageStatus.SendError
            }
            return newMessages;
        });
    }, []);

    return (
        <div className="chat__wrap">
            { 
                selectedUser ? ( <h1 className="center">Чат c {selectedUser.name}</h1>)
                : (<h1 className="center">Чат</h1>)
            }
            <ul className="chat__messages">
                {messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                    />
                ))}
            </ul>
            <InputPlace onSubmit={handleSubmit} />
        </div>
    );
}
