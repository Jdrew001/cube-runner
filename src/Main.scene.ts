import THREE from "three";

export default class MainScene extends THREE.Scene {

    private _camera: THREE.PerspectiveCamera;
    get camera() { return this._camera; }
    
    constructor(camera: THREE.PerspectiveCamera) {
        super();
        this._camera = camera;
    }

    initialize() {}
    update() {}
}