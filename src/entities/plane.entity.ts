import * as THREE from 'three';
import Container from 'typedi';
import AssetConfig from "../config/asset.config";
import { CameraManager } from '../managers/camera.manager';
import BaseEntity from "./base.entity";

export default class PlaneEntity extends BaseEntity {

    private config = this.GAMEOPTIONS.PlaneConfig;

    private _box: THREE.Box3;
    set box(value) { this._box = value; }
    get box() { return this._box; }

    private readonly cameraManager = Container.get(CameraManager)

    constructor() {
        super();
    }

    async initialize(addToPosition?: number, zPos?) {
        this.group = await this.createPlane();
        this.group.position.set(this.config.position.x + addToPosition, this.config.position.y, zPos);
        this.box = new THREE.Box3().setFromObject(this.group);
        //this.group.scale.set(1,1,1);

        let camPosZ = Math.abs(this.cameraManager.mainCamera.position.z - this.config.position.z)
    }
    update() {
        
    }
    destroy() {
        
    }

    resetToPosition(position: THREE.Vector3) {
        this.group.position.set(position.x, position.y, position.z);
    }

    createPlane() {
        const configs = AssetConfig.PLANE_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }

    getDiminsions() {
        return {
            width: this.box.max.x - this.box.min.x,
            height: this.box.max.z - this.box.min.z,
            depth: this.box.max.y - this.box.min.y
        }
    }

}