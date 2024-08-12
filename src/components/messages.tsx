import { useParams } from "react-router-dom";
import { Message } from "./message";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRoomMessages } from "../http/get-room-messages";
import { useMessagesWebsockets } from "../hooks/use-messages-websockets";

export function Messages() {
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Messages components must be used within room page")
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomId],
        queryFn: () => getRoomMessages({ roomId }),
    })

    useMessagesWebsockets({ roomId })

    const sortedMessages = data.sort((a, b) => {
        return b.reactionCount - a.reactionCount
      })

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {
                sortedMessages.map(dtMessage => {
                    const { answered, message, reactionCount, id } = dtMessage
                    return (
                        <Message
                            key={id}
                            id={id}
                            answered={answered}
                            text={message}
                            amountOfReactions={reactionCount}
                        />
                    )
                })
            }
        </ol>
    )
}