function Success(){
    const params = new URLSearchParams(window.location.search);
    const sum = params.get("amount");
    return (
        <>
            <h4 className="mt-2">
                Ваш счет был пополнен на {sum} рублей
            </h4>
            <h5 className="text-danger">Внимание!</h5>
            <p>
                Если в ближайшее время сумма не появится на счету - свяжитесь с администрацией
            </p>
        </>
    )
}

export default Success;