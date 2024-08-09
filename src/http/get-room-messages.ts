interface GetRoomMessages {
    roomId: string
}

interface MessageFromAPI {
    id: string
    room_id: string
    message: string
    reaction_count: number
    answered: boolean
}

export interface Message {
    id: string
    roomId: string
    message: string
    reactionCount: number
    answered: boolean
}

interface GetRoomMessagesAPIResponse {
    messages: MessageFromAPI[]
}

export async function getRoomMessages({ roomId }: GetRoomMessages): Promise<Message[]> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/rooms/${roomId}/messages`)

    const data: GetRoomMessagesAPIResponse = await response.json()

    return data.messages.map(
        item => { 
            return {
                id: item.id,
                roomId: item.room_id,
                message: item.message,
                reactionCount: item.reaction_count,
                answered: item.answered,
            }
        }
    )
}