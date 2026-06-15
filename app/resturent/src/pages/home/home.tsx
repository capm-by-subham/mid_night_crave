import { useEffect } from "react";

export default function Home() {
    useEffect(()=>{
        console.log("Hello React")
    })

    return (
        <div>
           <h1>Home Page</h1>
        </div>
    )
}
