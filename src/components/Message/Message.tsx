import { MessageStatus, TMessage } from "../Chat/Chat";
import "./Message.scss"

export interface MessageProps {
    message: TMessage
}

export function getMessageStatusText(message: TMessage) {
    switch(message.status) {
        case MessageStatus.Sending: return 'Sending';
        case MessageStatus.SendSuccess: return 'Send';
        case MessageStatus.SendError: return 'Fail send';
    }
    return 'Unknown';
}

export function Message({
    message
}: MessageProps) {
    return (
        <li className="message__wrap">
            <span>{message.text}</span>
            <div className="message__status">{getMessageStatusText(message)}</div>
        </li>  
    );
}