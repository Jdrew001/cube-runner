import { initialize } from "@ionic/core";
import * as THREE from "three";
import { Plane } from "three";
import Container, { Service } from "typedi";
import GameOptions from "../config/options.config";
import PlaneEntity from "../entities/plane.entity";
import { CameraManager } from "./camera.manager";

@Service()
export default class PlaneManager {

    private _scene: THREE.Scene;
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }

    private _planes: Array<PlaneEntity[]> = []; 
    get planes() { return this._planes; }
    set planes(value) { this._planes = value; }

    private columns = 5;
    private rows = 10;
    private widthNum = 32.2;
    private heightNum = 32.2;
    private zStart = -80;
    private speed = 0.1;

    private cameraManager = Container.get(CameraManager);
    private config = GameOptions.PlaneConfig;

    constructor() {}

    async initialize(scene: THREE.Scene) {
        this.scene = scene;
        await this.createPlaneRows();
       
    }

    update() {
        this.animatePlanes();
    }

    destroy() {

    }

    animatePlanes() {
        this.planes.forEach(planeGroup => {
            planeGroup.forEach(plane => {
                plane.group.position.add(new THREE.Vector3(0,0, this.speed));
            });
        })
    }

    private async createPlaneRows() {
        for (let i = 0; i < this.rows; i++) {
            let positionFactor = (i * 32) * -1;
            await this.createPlanes(positionFactor);
        }
    }

    private async createPlanes(zPosition) {
        let tempArr: Array<PlaneEntity> = [];
        for (let i = 0; i < this.columns; i++) {
            let midIndex = this.median();
            let positionFactor = (i - midIndex) * this.widthNum;
            const plane = new PlaneEntity();
            await plane.initialize(positionFactor, zPosition);

            tempArr.push(plane);
            this.scene.add(plane.group);
        }

        this.planes.push(tempArr);
    }

    private median() {
        const numbers = [0,1,2,3,4];
        const sorted = Array.from(numbers).sort((a: number, b: number) => a - b);
        const middle = Math.floor(sorted.length / 2);
    
        if (sorted.length % 2 === 0) {
            return ((sorted[middle - 1]as number) + (sorted[middle] as number)) / 2;
        }
    
        return sorted[middle];
    }
}