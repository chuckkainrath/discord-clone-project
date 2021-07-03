import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import { createServer } from '../../store/server'
import { useChannel } from '../../context/ChannelContext';
import { socket } from '../../services/socket';
import AvatarInput from '../auth/AvatarInput';
import styles from './ServerCreate.module.css'

function ServerCreate({ createRef, toggleCreate }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const [name, setName] = useState('')
    const [desc, setDesc] = useState('')
    const [valid, toggleValid] = useState(true)
    const [picture, setPicture] = useState(null);
    const [choosingPicture, setChoosingPicture] = useState(false);
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
            const serverId = await dispatch(createServer(trimmedStr, desc, picture));
            if (serverId) socket.emit("join", { serverIds: [serverId.toString()] })
            setName('')
            setDesc('')
            setErrs([])
            toggleValid(true)
            toggleCreate(false)
            if (serverId) history.push(`/servers/${serverId}`);
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

    const cancelServer = () => {
        toggleCreate(false);
    }

    const selectPhoto = e => {
        e.preventDefault();
        setChoosingPicture(true);
      }

    return (
        <div ref={createRef} className={styles.server_create_container__invis}>
            <div className={styles.server_create_container}>
                <form onSubmit={handleSubmit} className={styles.server_create_form}>
                    <h1>Create a Server</h1>
                    <div className={styles.server_name}>
                        <label>Name: </label>
                        <input
                            value={name}
                            onChange={e => nameChange(e.target.value)}
                            type='text'
                            maxLength='50'
                        />
                    </div>
                    {!picture &&
                        <div className={styles.no_photo}>
                            <label>Server Icon (Optional)</label>
                            <button onClick={selectPhoto}>Choose a Photo</button>
                        </div>
                    }
                    {picture &&
                        <div className={styles.photo}>
                            <div>Server Icon (Optional)</div>
                            <div className={styles.photo_cont}>
                                <img
                                    className={styles.profile_image}
                                    src={URL.createObjectURL(picture)}
                                />
                                <button onClick={() => setPicture()}>Delete Photo</button>
                            </div>
                        </div>
                    }
                    <div className={styles.server_desc}>
                        <label>Description: </label>
                        <textarea
                            value={desc}
                            onChange={e => descChange(e.target.value)}
                            type='text'
                            maxLength='255'
                        />
                    </div>
                    <div className={styles.server_submit}>
                        <button
                            type='submit'
                            disabled={valid}
                        >Create</button>
                        <button onClick={cancelServer}>Cancel</button>
                    </div>
                </form>
            </div>
            <AvatarInput
                picTitle='Server Icon (Optional)'
                setPicture={setPicture}
                setChoosingPicture={setChoosingPicture}
                choosingPicture={choosingPicture}
            />
        </div>
    )
}

export default ServerCreate
