import { useParams, Navigate } from "react-router-dom"

export function Room() {

    const params = useParams()

    if (!params.id) {
        return <Navigate to="/" />
    }

    return (
        <div>
            <h1>Room details {JSON.stringify(params)}</h1>
        </div>
    )
}