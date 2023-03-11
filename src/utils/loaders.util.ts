import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Service } from "typedi";

@Service()
export class MtlObjLoadersService {
    private readonly _mtlLoader = new MTLLoader();
    private readonly _objLoader = new OBJLoader();

    get mtlLoader() { return this._mtlLoader; }
    get objLoader() { return this._objLoader; }

    /**
     * Load the entity by providing the asset url
     * @param pathToEntityMtl - Ex: 'assets/{entity}.mtl
     * @param pathToEntityMtl - Ex: 'assets/{entity}.obj
     */
    async loadEntity(pathToEntityMtl: string, pathToEntityObj: string) {
        this.setMaterialsToMTL(await this.loadEntityMtl(pathToEntityMtl));
        return await this.objLoader.loadAsync(pathToEntityObj);
    }

    private async loadEntityMtl(pathToMTL: string): Promise<MTLLoader.MaterialCreator> {
        const mtl = await this.mtlLoader.loadAsync(pathToMTL);
        mtl.preload();
        return mtl;
    }

    private setMaterialsToMTL(entityMTL: MTLLoader.MaterialCreator) {
        this.objLoader.setMaterials(entityMTL);
    }
}