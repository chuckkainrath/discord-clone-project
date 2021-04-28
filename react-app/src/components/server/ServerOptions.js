import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { useServer } from '../../context/ServerContext';
import { deleteServer } from '../../store/server';

function ServerOptions() {
    const [options, toggleOptions] = useState(false)
    const dispatch = useDispatch();
    const { serverId } = useServer();
    console.log('ServerId', serverId);
    const deleteAServer = async () => {
        await dispatch(deleteServer(serverId))
    }
    return (
        <>
            {/* <div className={styles.server_name}>Server Name</div> */}
            <div
                onClick={() => toggleOptions(!options)}
            >
                Server Name
            </div>
            {options &&
                <div>
                    <div
                    // onClick={}
                    >
                        +Channel
                    </div>
                    <div>
                        +User
                    </div>
                    <div
                        onClick={deleteAServer}
                    >
                        -Server
                    </div>
                </div>}
        </>
    )
}

export default ServerOptions
