import React, {useState, useEffect} from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';



import styles from './styles';
import Toolbar from './toolbar.component';
import Gallery from './gallery.component';

export default function CameraPage () {
    camera = null;
    const [captures, setCaptures] = useState([])
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off)
    const [capturing, setCapturing] = useState(null)
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
    const [hasCameraPermission, setHasCameraPermission] = useState(null)

    handleCaptureIn = () => {setCapturing(true)};

    handleCaptureOut = () => {
        if (capturing)
            camera.stopRecording();
    };

    handleShortCapture = async () => {
        const photoData = await camera.takePictureAsync();
        setCapturing(false);
        setCaptures([photoData, ...captures])
    };

    handleLongCapture = async () => {
        const videoData = await camera.recordAsync();
        setCapturing(false);
        setCaptures([videoData, ...captures])
    };

    useEffect(() => {
        const componentDidMount = async () => {
            const cam = await Permissions.askAsync(Permissions.CAMERA);
            const aud = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
            const hasCameraPermission = (cam.status === 'granted' && aud.status === 'granted');
            setHasCameraPermission(hasCameraPermission)
        };

        componentDidMount();
      }, []);

    if (hasCameraPermission === null) {return <View />;}
    else if (hasCameraPermission === false) {return <Text>Access to camera has been denied.</Text>;}

    return (
        <React.Fragment>
            <View>
                <Camera
                    style={styles.preview}
                    type={cameraType}
                    flashMode={flashMode}
                    ref={c => camera = c} />
            </View>
            {captures.length > 0 && <Gallery captures={captures}/>}
            <Toolbar 
                capturing={capturing}
                flashMode={flashMode}
                cameraType={cameraType}
                setFlashMode={setFlashMode}
                setCameraType={setCameraType}
                onCaptureIn={handleCaptureIn}
                onCaptureOut={handleCaptureOut}
                onLongCapture={handleLongCapture}
                onShortCapture={handleShortCapture} />
        </React.Fragment>
    );
};
