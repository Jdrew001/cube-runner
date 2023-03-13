import { Service } from "typedi";
import CubeEntity from "../entities/cube.entity";

@Service()
export default class CubeManager {

    private _scene: THREE.Scene;
    get scene() { return this._scene; }
    set scene(value) { this._scene = value; }

    private _cubes: Array<CubeEntity> = new Array<CubeEntity>();
    get cubes() { return this._cubes; }
    set cubes(value) { this._cubes = value; }

    initialize() {

    }

    update() {

    }

    async createCubes() {
        for (let i = 0; i < 1; i++) {
            const cube = new CubeEntity();
            await cube.initialize();
            this.scene.add(cube.group);
            this.cubes.push(cube);
        }
    }
}