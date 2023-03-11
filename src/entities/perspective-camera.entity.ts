import * as THREE from 'three';
import GameOptions from "../config/options.config";

export default class PerspectiveCameraEntity extends THREE.PerspectiveCamera {
    constructor() {
        const camConfig = GameOptions.GameCameraConfig;
        super(
            camConfig.fov, camConfig.aspect, camConfig.near, camConfig.far
        );

        this.position.set(camConfig.position.x, camConfig.position.y, camConfig.position.z);
        //this.setRotationFromAxisAngle(camConfig.rotation, 0)
        //this.rotation.set(camConfig.rotation.x, camConfig.rotation.y, camConfig.rotation.z);
    }

    initializePosition() {
        
    }
}