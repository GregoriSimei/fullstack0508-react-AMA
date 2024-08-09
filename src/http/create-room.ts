interface CreateRoom {
    theme: string
}

interface CreateRoomAPIResponse {
    id: string
}

interface CreateRoomResponse {
    roomId: string
}

export async function createRoom({ theme }: CreateRoom): Promise<CreateRoomResponse> {
    const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/api/rooms`,
        {
            method: 'POST',
            body: JSON.stringify({
                theme,
            })
        }
    )

    const data: CreateRoomAPIResponse = await response.json()

    return {
        roomId: data.id
    }
}