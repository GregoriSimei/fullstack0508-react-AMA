import { useParams } from "react-router-dom";
import { Message } from "./message";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRoomMessages, Message as MessageDTO } from "../http/get-room-messages";
import { useEffect } from "react";

type TypesOfEvent = "message_created" | "message_reaction" | "message_answered"

interface WsRoomEvent {
    kind: TypesOfEvent
    value: any
}

export function Messages() {
    const queryClient = useQueryClient()
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Messages components must be used within room page")
    }

    const { data } = useSuspenseQuery({
        queryKey: ['messages', roomId],
        queryFn: () => getRoomMessages({ roomId }),
    })

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

        ws.onopen = () => {
            console.log('WebSocket connected!')
        }

        ws.onclose = () => {
            console.log('WebSocket connection closed!')
        }

        ws.onmessage = (event: MessageEvent) => {
            const { kind, value }: WsRoomEvent  = JSON.parse(event.data)
            console.log(kind, value)

            switch(kind) {
                case 'message_created':
                    queryClient.setQueryData<MessageDTO[]>(['messages', roomId], state => {
                        return [
                            ...(state ?? []),
                            {
                                id: value.id as string,
                                message: value.message as string,
                                reactionCount: 0,
                                answered: false,
                                roomId
                            }
                        ]
                    })
                    break
            }
        }

        return () => {
            ws.close()
        }
    }, [roomId])

    return (
        <ol className="list-decimal list-outside px-3 space-y-8">
            {
                data.map(dtMessage => {
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