interface ReactRoomMessage {
    roomId: string
    messageId: string
}

interface MessageFromAPI {
    id: string
    room_id: string
    message: string
    reaction_count: number
    answered: boolean
}

interface Message {
    id: string
    roomId: string
    message: string
    reactionCount: number
    answered: boolean
}


export async function reactRoomMessage({ roomId, messageId }: ReactRoomMessage): Promise<Message> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/rooms/${roomId}/messages/${messageId}`,
        {
            method: 'PATCH'
        }
    )

    const data: MessageFromAPI = await response.json()

    return {
        id: data.id,
        roomId: data.room_id,
        message: data.message,
        reactionCount: data.reaction_count,
        answered: data.answered,
    }
}