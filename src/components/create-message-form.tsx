import { useState } from "react"
import { toast } from "sonner"
import { createRoomMessage } from "../http/create-room-messages"
import { useParams } from "react-router-dom"
import { ArrowRight } from "lucide-react"

interface FormData {
    message: string
}

export function CreateMessageForm() {
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Messages components must be used within room page")
    }

    const [formData, setFormData] = useState<FormData>({ message: '' })

    async function handleCreateMessage(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const { message } = formData

        if(!message || message == '') {
            toast.info('Você deve escrever uma pergunta.')
            return
        }

        try {
            await createRoomMessage({
                roomId: roomId || '',
                message
            })
        } catch {
            toast.error('Erro ao criar pergunta. Por favor, tente novamente.')
        }
    }

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setFormData({
            message: value
        })
    }

    return (
        <form
            onSubmit={handleCreateMessage}
            className='flex items-center gap-2 bg-zinc-900 p-2 rounded-xl border border-zinc-800 ring-orange-400 ring-offset-2 ring-offset-zinc-950 focus-within:ring-1'
        >
            <input
                type='text'
                name='theme'
                placeholder='Qual sua pergunta?'
                className='flex-1 text-sm bg-transparent mx-2 outline-none text-zinc-100 placeholder:text-zinc-500'
                onChange={handleChange}
            />

            <button
                type='submit'
                className='bg-orange-400 text-orange-950 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-orange-500'
            >
                Criar pergunta
                <ArrowRight className='size-4'/>
            </button>
        </form>
    )
}