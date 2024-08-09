import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

interface MessageProps {
    text: string
    amountOfReactions: number
    answered?: boolean
}

export function Message({ amountOfReactions, text, answered = false }: MessageProps) {
    const [hasReacted, setHasReacted] = useState(false)
    const { roomId } = useParams()

    if(!roomId) {
        throw new Error("Message components must be used within room page")
    }

    function handleReactToMessage() {
        setHasReacted(true)
    }

    return (
        <li data-answered={answered} className="ml-4 leading-relaxed text-zinc-100 data-[answered=true]:opacity-50 data-[answered=true]:text-zinc-300 data-[answered=true]:pointer-events-none">
            {text}
            
            {
                hasReacted ? (
                    <button type="button" className="mt-3 flex items-center gap-2 text-orange-400 text-sm font-medium transition-colors hover:text-orange-500">
                        <ArrowUp></ArrowUp>
                        Curtir pergunta ({amountOfReactions})
                    </button>
                ) : (
                    <button onClick={handleReactToMessage} type="button" className="mt-3 flex items-center gap-2 text-zinc-400 text-sm font-medium transition-colors hover:text-zinc-500">
                        <ArrowUp></ArrowUp>
                        Curtir pergunta ({amountOfReactions})
                    </button>
                )
            }

            
        </li> 
    )
}