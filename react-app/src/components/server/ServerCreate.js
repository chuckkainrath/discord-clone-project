import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createServer } from '../../store/server'
import styles from './ServerCreate.module.css'

function ServerCreate({ toggleCreate }) {
    const dispatch = useDispatch();
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
        let trimmedStr = name.trim();
        if (trimmedStr.length === 0) {
            toggleValid(true);
        } else {
            await dispatch(createServer(trimmedStr, desc));
            setName('')
            setDesc('')
            setErrs([])
            toggleValid(true)
            toggleCreate(false)
        }

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
        <div className={styles.server_create_container__invis}>
            <div className={styles.server_create_container}>
                <form onSubmit={handleSubmit} className={styles.server_create_form}>
                    <div className={styles.server_name}>
                        <label>Name: </label>
                        <input
                            value={name}
                            onChange={e => nameChange(e.target.value)}
                            type='text'
                            maxLength='50'
                        />
                    </div>
                    <div className={styles.server_desc}>
                        <label>Description: </label>
                        <textarea
                            value={desc}
                            onChange={e => descChange(e.target.value)}
                            type='text'
                            maxLength='255'
                        />
                    </div>
                    <div>
                        <button
                            className={styles.server_submit}
                            type='submit'
                            // onClick={e => createServer(e)}
                            disabled={valid}
                        >Create Server</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ServerCreate
