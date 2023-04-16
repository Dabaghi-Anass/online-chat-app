import React , {useEffect, useState} from 'react'

const Menu = ({ opened ,...rest}) => {
    const [name, setName] = useState("grid");
    useEffect(() => {
        let n_clone = opened ? "grid-outline" : "grid";
        setName(n_clone)
    })
    return (
        <ion-icon {...rest} name={name}></ion-icon>
    )
};

export default Menu