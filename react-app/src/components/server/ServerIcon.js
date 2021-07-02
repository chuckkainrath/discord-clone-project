import React from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux'
import { socket } from '../../services/socket';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styles from './ServerIcon.module.css'

function shortenServer(name) {
    const splitName = name.split(/[\s]+/g);
    let initals = '';
    splitName.forEach(word => {
        if (word[0]) {
            initals += word[0].toUpperCase();
        }
    });
    return initals.substring(0, 2);
}

function ServerIcon({ server }) {
    const history = useHistory();
    const userId = useSelector(state => state.session.user.id)

    const changeServer = (serverId) => {
        history.push(`/servers/${serverId}`);
    }

    const leaveServer = () => {
        // emit leave server
        if (server.owner_id !== userId) {
            socket.emit('leave_server', {
                serverId: server.id,
                userId
            });
        } else {
            // Alert user somehow
        }
    }

    const serverTooltip = props => <Tooltip id='server-name-tooltip' {...props}>{server.name}</Tooltip>

    return (
        <OverlayTrigger
            placement='right'
            delay={{ show: 250, hide: 250}}
            overlay={serverTooltip}
        >
            <div className={styles.server_icon}>
                <ContextMenuTrigger id={server.id.toString()}>
                    <div onClick={() => changeServer(server.id)}>
                        {server.server_img_url &&
                            <img className={styles.server_icon_img} src={server.server_img_url} />
                        }
                        {!server.server_img_url && shortenServer(server.name)}
                    </div>
                </ContextMenuTrigger>
                <ContextMenu id={server.id.toString()}>
                    <MenuItem
                        data={{ action: 'leave' }}
                        onClick={leaveServer}
                    >
                        Leave Server
                    </MenuItem>
                </ContextMenu>
            </div>
        </OverlayTrigger>
    )
}

export default ServerIcon;
