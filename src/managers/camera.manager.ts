import * as THREE from 'three';
import { Service } from "typedi";
import GameOptions from "../config/options.config";

@Service()
export class CameraManager {

    private MAIN_CAMERA_CONFIG = GameOptions.GameCameraConfig

    private _mainCamera: THREE.PerspectiveCamera;
    get mainCamera() { return this._mainCamera; }
    private set mainCamera(value) { this._mainCamera = value; }

    constructor() {}

    initialize() {
        this.createMainCamera();
    }

    getFieldOfView() {
        return this.mainCamera.fov;
    }

    getHeightOfView(dist) {
        let vFOV = THREE.MathUtils.degToRad( this.getFieldOfView() );
        return 2 * Math.tan(vFOV / 2) * dist;
    }

    getWidthOfView(dist) {
        return this.getHeightOfView(dist) * this.mainCamera.aspect;
    }

    private createMainCamera() {
        const width = window.innerWidth
        const height = window.innerHeight
        this.mainCamera = new THREE.PerspectiveCamera(
            this.MAIN_CAMERA_CONFIG.fov, 
            width / height, 
            this.MAIN_CAMERA_CONFIG.near, 
            this.MAIN_CAMERA_CONFIG.far)
        
        this.mainCamera.position.set(this.MAIN_CAMERA_CONFIG.position.x, this.MAIN_CAMERA_CONFIG.position.y, this.MAIN_CAMERA_CONFIG.position.z);
    }
}