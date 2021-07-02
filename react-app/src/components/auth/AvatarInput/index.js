import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import styles from './AvatarInput.module.css';
import { Modal, Button } from 'react-bootstrap';

function AvatarInput({setPicture, setChoosingPicture, choosingPicture}) {
    const [imageUrl, setImageUrl] = useState();
    const [width, setWidth] = useState();
    const [height, setHeight] = useState();
    const [scale, setScale] = useState(1.2);
    const [editor, setEditor] = useState();
    const [imgWidth, setImgWidth] = useState(400);
    const onDrop = useCallback(acceptedFile => {
        const imageFile = acceptedFile[0];
        const imageUrl = URL.createObjectURL(imageFile)
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
            setImgWidth(img.width);
            const width = Math.min(400, img.width);
            setWidth(width)
            setHeight(width)
            setImageUrl(URL.createObjectURL(imageFile));
        }
    }, []);

    // useEffect(() => {
    //     const width = Math.min(400, imgWidth, dimensions.width - 100);
    //     setWidth(width);
    //     setHeight(width);
    // }, [dimensions])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop});

    const saveImage = () => {
        if (editor) {
            // Get image and convert to format for upload
            const blob = editor.getImageScaledToCanvas().toBlob(blob => {
                setPicture(blob);
                setChoosingPicture(false);
                setImageUrl();
            });
        }
    }

    const cancelImage = () => {
        setImageUrl('');
        setChoosingPicture(false);
    }

    return (
        <Modal
            className={styles.modal__profile_img}
            show={choosingPicture}
            onHide={cancelImage}
            centered
        >
            <Modal.Header className={styles.header__block}>
                <label>Profile Picture (Optional)</label>
                <Button className={styles.cancel__picture} onClick={cancelImage}>Cancel</Button>
            </Modal.Header>
            {!imageUrl &&
                <div className={styles.picture__input} {...getRootProps()}>
                    <input className={styles.input__field} {...getInputProps()} />
                    { isDragActive ?
                        <p className={styles.input__text}>Drop the file here...</p> :
                        <p className={styles.input__text}>Drag 'n' drop a file here, or click to select files</p>
                    }
                </div>
            }
            {imageUrl &&
                <div className={styles.picture__container}>
                    {width &&
                        <AvatarEditor
                            image={imageUrl}
                            width={width}
                            height={height}
                            border={[10,10]}
                            borderRadius={width}
                            color={[255,255,255,0.6]}
                            scale={scale}
                            rotate={0}
                            ref={(e) => setEditor(e)}
                        />
                    }
                    <div className={styles.scale__slider}>
                        <label>Scale Image:</label>
                        <input
                            type='range'
                            step='0.1'
                            min='1'
                            max='3'
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                        />
                    </div>
                    <Button className={styles.submit__btn} onClick={saveImage}>Save Profile Picture</Button>
                </div>
            }
        </Modal>
    )
}

export default AvatarInput;
