interface CreateRoomMessage {
    roomId: string
    message: string
}

interface CreateRoomMessageAPIResponse {
    id: string
}

interface CreateRoomMessageResponse {
    messageId: string
}

export async function createRoomMessage({ roomId, message }: CreateRoomMessage): Promise<CreateRoomMessageResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/rooms/${roomId}/messages`, 
        {
            method: 'POST',
            body: JSON.stringify({
                message
            })
        }
    )

    const data: CreateRoomMessageAPIResponse = await response.json()

    return {
        messageId: data.id
    }
}