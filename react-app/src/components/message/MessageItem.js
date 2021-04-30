import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {useServer} from '../../context/ServerContext'
import { socket }from '../server/ServerBar'
import { useChannel } from '../../context/ChannelContext';
import { createMessageAction } from '../../store/messages';

function MessageItem({message}) {

    return (
        <div>
            <p>{message.username}: {message.body}</p>
        </div>
    );
}

export default MessageItem;
