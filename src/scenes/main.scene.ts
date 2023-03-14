import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import GUI from "lil-gui";
import GameOptions from "../config/options.config";
import PlayerEntity from "../entities/player.entity";
import AmbientLightEntity from "../entities/ambient-light.entity";
import CubeEntity from "../entities/cube.entity";
import Container from "typedi";
import { CameraManager } from "../managers/camera.manager";
import PlaneEntity from "../entities/plane.entity";
import PlaneManager from "../managers/plane.manager";
import DebugManager from "../managers/debug.manager";
import InputManager from "../managers/input.manager";
import.meta.env.DEV

/**
 * TODOS:
 * 
 * Cube Manager
 * Camera Manager, and camera class
 * Event manager and collision manager
 * Refine player and camera movements
 * add a debug camera
 * 
 * add the skybox gradient
 * 
 */

export default class MainScene extends THREE.Scene {

    private readonly cameraManager = Container.get(CameraManager);
    private readonly planeManager = Container.get(PlaneManager);
    private readonly debugManager = Container.get(DebugManager);
    private readonly inputManager = Container.get(InputManager);

    get mainCamera() { return this.cameraManager.mainCamera; }

    _renderer: any;
    get renderer() { return this._renderer; }

    private _player: PlayerEntity = new PlayerEntity();
    get player() { return this._player;}
    set player(player: PlayerEntity) { this._player = player; }

    constructor(
        renderer: any) {
            super();
            this._renderer = renderer;
    }

    async initialize() {
        await this.player.initialize();
        await this.planeManager.initialize(this);
        this.inputManager.initialize(this);

        this.add(this.player.group);
        this.add(new AmbientLightEntity());

        if (import.meta.env.DEV) {
            this.initializeDebugManager();
        }
    }

    update() {
        this.inputManager.handleInput(this.player, this.mainCamera, this.planeManager.planeBuffer);
        this.planeManager.update();
    }

    private initializeDebugManager() {
        this.debugManager.initialize();
        this.debugManager.playerDebugOptions(this.player);
        this.debugManager.gameCameraOptions(this.mainCamera)
        this.debugManager.LightOptions();
    }
}