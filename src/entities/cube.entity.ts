import AssetConfig from "../config/asset.config";
import BaseEntity from "./base.entity";

export default class CubeEntity extends BaseEntity {

    private config = this.GAMEOPTIONS.CubeConfig;

    constructor() {
        super();
    }

    async initialize() {
        this.group = await this.createSqure();
        this.group.position.set(this.config.position.x, this.config.position.y, this.config.position.z);
        this.group.scale.set(this.config.scale, this.config.scale, this.config.scale)
    }

    update() {
        
    }

    destroy() {
        
    }

    private createSqure() {
        const configs = AssetConfig.SQUARE_ENTITY_PATHS;
        return this.mtlObjLoadersService.loadEntity(configs.MTL, configs.OBJ);
    }
}