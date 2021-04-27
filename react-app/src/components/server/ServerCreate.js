import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createServer } from '../../store/server'

function ServerCreate({ toggleCreate }) {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [valid, toggleValid] = useState(true)
    const [errs, setErrs] = useState([])

    function nameChange(newName) {
        setName(newName);
    }

    function descChange(newDesc) {
        setDesc(newDesc);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("I'M HERE!!!!!!!!!!!!!!!!!!!!!!!")
        await dispatch(createServer(name, desc))
        console.log("I'M AFTER!!!!!!!!!!!!!!!!!!!!!!!")
        setName('')
        setDesc('')
        setErrs([])
        toggleValid(true)
        toggleCreate(false)
    }

    useEffect(() => {
        let errors = []
        if (name.length > 50 || !name.length) {
            errors.push('Invalid Name Length.')
        }
        if (desc.length > 255) errors.push('Description cannot be longer than 255 characters.')
        if (errors.length) {
            toggleValid(true)
        }
        else toggleValid(false)
        setErrs(errors)
    }, [name, desc])

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name: </label>
                <input
                    value={name}
                    onChange={e => nameChange(e.target.value)}
                    type='text'
                    maxLength='50'
                />
            </div>
            <div>
                <label>Description: </label>
                <input
                    value={desc}
                    onChange={e => descChange(e.target.value)}
                    type='text'
                    maxLength='255'
                />
            </div>
            <div>
                <button
                    type='submit'
                    // onClick={e => createServer(e)}
                    disabled={valid}
                >Create Server</button>
            </div>
        </form>
    )
}

export default ServerCreate