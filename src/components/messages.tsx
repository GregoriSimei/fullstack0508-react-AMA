import { useParams } from "react-router-dom";
import { Message } from "./message";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRoomMessages } from "../http/get-room-messages";

export function Messages() {
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Messages components must be used within room page")
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomId],
        queryFn: () => getRoomMessages({ roomId }),
    })

    console.log(data)

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {
                data.map(dtMessage => {
                    const { answered, message, reactionCount, id } = dtMessage
                    return (
                        <Message
                            key={id}
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