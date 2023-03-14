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

    private _planeBuffer: THREE.Mesh;
    get planeBuffer() { return this._planeBuffer; }
    private set planeBuffer(value) { this._planeBuffer = value;}

    private columns = 5;
    private rows = 10;
    private columnIndexes = [];
    private widthNum = 32.2;
    private heightNum = 32.2;
    private zStart = -80;
    private speed = 0.2;
    private resetThreshold = 20;

    private cameraManager = Container.get(CameraManager);
    private config = GameOptions.PlaneConfig;

    constructor() {}

    async initialize(scene: THREE.Scene) {
        this.scene = scene;
        this.generateColumnIndexes();
        this.generatePlaneBuffer();
        await this.createPlaneRows();       
    }

    update() {
        this.animatePlanes();
    }

    destroy() {

    }

    generatePlaneBuffer() {
        const mapLoader = new THREE.TextureLoader();
        const checkerboard = mapLoader.load('assets/grid.png');
        this.planeBuffer = new THREE.Mesh(
            new THREE.PlaneGeometry(120, 25, 10, 10),
            new THREE.MeshStandardMaterial({map: checkerboard}));
        this.planeBuffer.castShadow = false;
        this.planeBuffer.receiveShadow = true;
        this.planeBuffer.rotation.x = -Math.PI / 2;
        this.planeBuffer.position.add(new THREE.Vector3(0,0.1,-60));
        this.scene.add(this.planeBuffer);
    }

    generateColumnIndexes() {
        for (let i = 0; i < this.columns; i++) {
            this.columnIndexes.push(i);
        }
    }

    animatePlanes() {
        for (let i = 0; i < this.planes.length; i++) {
            this.resetGroupZPosition(this.planes[i], i);

            for (let z = 0; z < this.planes[i].length; z++) {
                this.planes[i][z].group.position.add(new THREE.Vector3(0,0, this.speed));
            }
        }
    }

    resetPlaneXPositionRight(playerXPosition: number) {
        this.planes.forEach(planeGroup => {
            let index = this.columns - 1;
            let furthestRightPlane = planeGroup[index].group;
            let furthestLeftPlane = planeGroup[0].group;
            let threshold = furthestRightPlane.position.x - ((this.widthNum / 2) * 2); //(this.widthNum / 2)

            if (playerXPosition > threshold) {
                // update the position to be to the right of the last element of the array
                let lastPlaneXPosition = planeGroup[index].group.position.x;
                furthestLeftPlane.position.set(lastPlaneXPosition + this.widthNum, furthestLeftPlane.position.y, furthestLeftPlane.position.z);

                // shift the array to the left [0,1,2] -> [1,2,0]
                planeGroup.unshift(...planeGroup.splice(1));
            }
        })
    }

    resetPlaneXPositionLeft(playerXPosition: number) {
        this.planes.forEach(planeGroup => {
            let index = this.columns - 1;
            let furthestRightPlane = planeGroup[index].group;
            let furthestLeftPlane = planeGroup[0].group;
            let threshold = furthestLeftPlane.position.x + ((this.widthNum / 2) * 2);

            if (playerXPosition < threshold) {
                // update the position to be to the left of the first element of the array
                let firstPlaneXPosition = planeGroup[0].group.position.x;
                furthestRightPlane.position.set(firstPlaneXPosition - this.widthNum, furthestRightPlane.position.y, furthestRightPlane.position.z);

                // shift the array to the right [0,1,2] -> [2,1,0]
                planeGroup.unshift(...planeGroup.splice(-1));
            }
        })
    }

    private resetGroupZPosition(planeGroup: Array<PlaneEntity>, groupIndex: number) {
        if ((planeGroup[0] as PlaneEntity).group.position.z > this.resetThreshold) {
            planeGroup.forEach(element => {
                let resetIndex = groupIndex == 0 ? this.rows - 1: groupIndex - 1; 
                let resetZPos = this.planes[resetIndex][0].group.position.z - this.heightNum;
                let newPosition = new THREE.Vector3(element.group.position.x, element.group.position.y, resetZPos);
                element.resetToPosition(newPosition);
            });
        }
    }

    private async createPlaneRows() {
        for (let i = 0; i < this.rows; i++) {
            let positionFactor = (i * 31.2) * -1;
            console.log('testing!', positionFactor);
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
        const sorted = Array.from(this.columnIndexes).sort((a: number, b: number) => a - b);
        const middle = Math.floor(sorted.length / 2);
    
        if (sorted.length % 2 === 0) {
            return ((sorted[middle - 1]as number) + (sorted[middle] as number)) / 2;
        }
    
        return sorted[middle];
    }
}