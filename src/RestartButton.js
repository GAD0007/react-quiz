function RestartButton({ dispatch,questions,index,answer }) {
    if (index === 0 && answer === null) return null; return (
        
            <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart", payload:questions })}>Restart</button>
       
    )
}

export default RestartButton
