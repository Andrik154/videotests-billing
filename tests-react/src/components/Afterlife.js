function Afterlife(){
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    return (
        <>
            <h4 className="mt-2">
                Спасибо за покупку! Ваш тест будет выполнен примерно через {t} секунд ({(t/60).toFixed(2)} минут).
            </h4>
            <h5 className="text-danger">Внимание!</h5>
            <p>
                Проверьте тест после примерного времени завершения. Если он незавершен, то завершите (если ответы введены).
            </p>
        </>
    )
}

export default Afterlife;