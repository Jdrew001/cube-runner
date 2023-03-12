import AssetConfig from "../config/asset.config";
import BaseEntity from "./base.entity";

export default class PlaneEntity extends BaseEntity {

    private config = this.GAMEOPTIONS.PlaneConfig;

    constructor() {
        super();
    }

    async initialize() {
        this.group = await this.createPlane();
        this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
    }
    update() {
        
    }
    destroy() {
        
    }

    createPlane() {
        const configs = AssetConfig.PLANE_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }

}