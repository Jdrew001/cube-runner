import * as THREE from 'three';
import Container from "typedi";
import AssetConfig from "../config/asset.config";
import {MtlObjLoadersService} from "../utils/loaders.util";
import BaseEntity from "./base.entity";

export default class PlayerEntity extends BaseEntity {

    private config = this.GAMEOPTIONS.PlayerConfig;
    group: THREE.Group;

    constructor() {
        super();
    }

    async initialize() {
        this.group = await this.createPlayer();
        this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.group.scale.set(this.config.scale, this.config.scale, this.config.scale)
        console.log('player group pos', this.group.position)
    }

    update() {
        // create the move logic
    }

    destroy() {

    }

    private createPlayer() {
        const configs = AssetConfig.PLAYER_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }
}