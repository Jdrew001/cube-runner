import * as THREE from 'three';

export default class GameOptions {

    // public static width = window.innerWidth
    // public static height = window.innerHeight

    public static gameOptions = {
        cameraRotationX: 0,
    }

    public static PlayerConfig = {
        position: new THREE.Vector3(0, 1, -2),
        scale: 0.2,
        speed: 0.2
    }

    public static GameCameraConfig = {
        position: new THREE.Vector3(0, 4, 9.5),
        positionX: 0,
        positionY: 4,
        positionZ: 9.5,
        rotation: new THREE.Vector3(0, 0.00, 0),
        fov: 40,
        aspect:1, 
        near: 0.1, 
        far: 60
    }

    public static LightConfig = {
        color: 0xFFFFFF,
        intensity: 1
    }

    public static CubeConfig = {
        scale: 0.2,
        position: new THREE.Vector3(0, 1, -6)
    }

    public static PlaneConfig = {
        position: new THREE.Vector3(-120, 0, -50) //-120
    }

}