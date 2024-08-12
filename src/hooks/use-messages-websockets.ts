import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Message } from "../http/get-room-messages";

interface useMessagesWebSocketsParams {
    roomId: string
}

type WebhookMessage =
  | { kind: "message_created"; value: { id: string, message: string } }
  | { kind: "message_answered"; value: { id: string } }
  | { kind: "message_reaction"; value: { id: string; reaction_count: number } }

export function useMessagesWebsockets({ roomId }: useMessagesWebSocketsParams) {
    const queryClient = useQueryClient()

    useEffect(() => {
        const ws = new WebSocket(`ws://localhost:8080/subscribe/${roomId}`)

        ws.onopen = () => {
            console.log('WebSocket connected!')
        }

        ws.onclose = () => {
            console.log('WebSocket connection closed!')
        }

        ws.onmessage = (event: MessageEvent) => {
            const { kind, value }: WebhookMessage = JSON.parse(event.data)

            console.log(kind, value)

            switch(kind) {
                case 'message_created':
                    queryClient.setQueryData<Message[]>(['messages', roomId], state => {
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
                case 'message_reaction':
                    queryClient.setQueryData<Message[]>(['messages', roomId], state => {
                        if (!state) {
                            return undefined
                        }

                        return state.map(item => {
                            if (item.id == value.id) {
                                return { ...item, reactionCount: value.reaction_count }
                            }
                            return item
                        })
                    })
                    break
            }
        }

        return () => {
            ws.close()
        }
    }, [roomId, queryClient])
}