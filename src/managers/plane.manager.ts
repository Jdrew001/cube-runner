import { initialize } from "@ionic/core";
import * as THREE from "three";
import Container, { Service } from "typedi";
import GameOptions from "../config/options.config";
import PlaneEntity from "../entities/plane.entity";
import { CameraManager } from "./camera.manager";

@Service()
export default class PlaneManager {

    private _scene: THREE.Scene;
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }

    private _planes: Array<PlaneEntity> = []; 
    get planes() { return this._planes; }
    set planes(value) { this._planes = value; }

    private horizontalCount = 8;
    private speed = 0.1;

    private cameraManager = Container.get(CameraManager);
    private config = GameOptions.PlaneConfig;

    constructor() {}

    async initialize(scene: THREE.Scene) {
        this.scene = scene;
        let zPos = this.config.position.z;
        await this.createPlanes(zPos);
        await this.createPlanes(zPos + 32);
    }

    update() {
        this.animatePlanes();
    }

    destroy() {

    }

    animatePlanes() {
        this.planes.forEach(plane => {
            plane.group.position.add(new THREE.Vector3(0,0, this.speed));
        })
    }

    private async createPlanes(zPos) {
        for (let i = 0; i < this.horizontalCount; i++) {
            let addFactor = 32 * i;
            const plane = new PlaneEntity();
            await plane.initialize(addFactor, zPos);
            
            this.planes.push(plane);
            this.scene.add(plane.group);
        }
    }
}