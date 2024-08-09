import { useParams } from "react-router-dom"
import amaLogo from '../assets/ama-logo.svg'
import { ArrowRight, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Messages } from "../components/messages"
import { Suspense, useState } from "react"
import { createRoomMessage } from "../http/create-room-messages"

interface FormData {
    message: string
}

export function Room() {
    const [formData, setFormData] = useState<FormData>({ message: '' })
    const { roomId } = useParams()

    function handleShareRoom() {
        const url = window.location.href.toString()

        if(navigator.share !== undefined && navigator.canShare()) {
            navigator.share({ url })
        } else {
            navigator.clipboard.writeText(url)

            toast.info('The room URL was copied to your clipboard!')
        }
    }

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
        <div className="mx-auto max-w-[640px] flex flex-col gap-6 py-10 px-4">
            <div className="flex items-center gap-3 px-3 text-sm">
                <img className="h-5" src={amaLogo} alt='AMA'/>
                
                <span className="flex flex-row text-zinc-500 truncate">
                    Código da sala: <span className="text-zinc-300">{roomId}</span>
                </span>

                <button
                    type="button"
                    onClick={handleShareRoom}
                    className="ml-auto bg-zinc-800 text-zinc-300 px-3 py-1.5 gap-1.5 flex items-center rounded-lg font-medium text-sm transition-colors hover:bg-zinc-700"
                >
                    Compartilhar
                    <Share2></Share2>
                </button>
            </div>

            <div className="w-full h-px bg-zinc-900"></div>

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

            <Suspense fallback={<p>Carregando ...</p>}>
                <Messages />
            </Suspense>
        </div>
    )
}