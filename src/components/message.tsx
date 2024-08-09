import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { reactRoomMessage } from "../http/react-room-message";
import { toast } from "sonner";
import { unreactRoomMessage } from "../http/unreact-room-message";

interface MessageProps {
    text: string
    amountOfReactions: number
    answered?: boolean
    id: string
}

export function Message({ amountOfReactions, text, answered = false, id }: MessageProps) {
    const [hasReacted, setHasReacted] = useState(false)
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Message components must be used within room page")
    }

    async function handleReactMessage() {
        try {
            await reactRoomMessage({ messageId: id, roomId: roomId || '' })
            setHasReacted(true)
        } catch {
            toast.error('Falha ao reagir a pergunta')
        }
    }

    async function handleUnreactMessage() {
        try {
            await unreactRoomMessage({ messageId: id, roomId: roomId || '' })
            setHasReacted(false)
        } catch {
            toast.error('Falha ao remover a reção da pergunta')
        }
    }

    return (
        <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:text-zinc-300 data-[answered=true]:pointer-events-none">
            {text}
            
            {
                hasReacted ? (
                    <button onClick={handleUnreactMessage} type="button" className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium transition-colors hover:text-orange-500">
                        <ArrowUp></ArrowUp>
                        Curtir pergunta ({amountOfReactions})
                    </button>
                ) : (
                    <button onClick={handleReactMessage} type="button" className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium transition-colors hover:text-zinc-500">
                        <ArrowUp></ArrowUp>
                        Curtir pergunta ({amountOfReactions})
                    </button>
                )
            }

            
        </li> 
    )
}