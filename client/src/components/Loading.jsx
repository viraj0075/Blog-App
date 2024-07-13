import React from 'react'
import loadingGIF from "../assets/loading.gif";
const Loading = () => {
    return (
        <div className="items-center content-center">
            <img src={loadingGIF} alt="This is loading" />
        </div>
    )
}

export default Loading;