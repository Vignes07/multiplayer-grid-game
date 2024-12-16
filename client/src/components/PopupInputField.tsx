import "./PopupInputField.css"

type inputProps = {
    isModalOpen: boolean,
    setIsModalOpen: Function,
    inputValue: string,
    setInputValue: Function,
    handleSubmit: Function,
}

function PopupInputField({ isModalOpen, setIsModalOpen, inputValue, setInputValue, handleSubmit }: inputProps ) {

    return (
        <>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Enter a Unicode Character</h3>
                        <div className="input-field">
                            <input
                                type="text"
                                maxLength={1} // Restrict input to 1 character
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button onClick={() => handleSubmit()}>Submit</button>
                        </div>

                        <div className="close">
                            <button onClick={() => setIsModalOpen(false)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#343C54"
                                     xmlns="http://www.w3.org/2000/svg"
                                     transform="rotate(0 0 0)">
                                    <path
                                        d="M6.21967 7.28033C5.92678 6.98744 5.92678 6.51256 6.21967 6.21967C6.51256 5.92678 6.98744 5.92678 7.28033 6.21967L11.999 10.9384L16.7176 6.2198C17.0105 5.92691 17.4854 5.92691 17.7782 6.2198C18.0711 6.51269 18.0711 6.98757 17.7782 7.28046L13.0597 11.999L17.7782 16.7176C18.0711 17.0105 18.0711 17.4854 17.7782 17.7782C17.4854 18.0711 17.0105 18.0711 16.7176 17.7782L11.999 13.0597L7.28033 17.7784C6.98744 18.0713 6.51256 18.0713 6.21967 17.7784C5.92678 17.4855 5.92678 17.0106 6.21967 16.7177L10.9384 11.999L6.21967 7.28033Z"
                                        fill="#343C54"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PopupInputField;