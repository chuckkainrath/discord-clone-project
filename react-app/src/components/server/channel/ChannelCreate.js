import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom';
import { socket } from '../../../services/socket';
import styles from '../ServerOptions.module.css';

function ChannelCreate({ toggleOptions }) {
    const [validChannel, toggleValidChannel] = useState(true)
    const [channelName, setChannelName] = useState('')
    const { serverId } = useParams();

    useEffect(() => {
        if (channelName.length > 0 && channelName.length <= 50) {
            toggleValidChannel(false)
        }
        else {
            toggleValidChannel(true)
        }
    }, [channelName])

    const submitChannel = async (e) => {
        e.preventDefault()
        socket.emit("new_channel", {
            name: channelName,
            serverId: serverId
        });
        toggleOptions(false)
        toggleValidChannel(true)
        setChannelName('')
    }

    return (
        <form onSubmit={submitChannel}>
            <div className={styles.create_channel}>
                <label>Channel Name: </label>
                <input
                    type='text'
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                />
            </div>
            <div className={styles.create_channel__submit}>
                <button disabled={validChannel} type='submit'>Create Channel</button>
            </div>
        </form>
    )
}

export default ChannelCreate
