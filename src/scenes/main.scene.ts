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

/**
 * TODOS:
 * 
 * Cube Manager
 * Camera Manager, and camera class
 * Event manager and collision manager
 * Refine player and camera movements
 * add a debug camera
 * Debug Gui manager
 * Move the input logic in the player and camera manager
 * 
 * Add the plane
 * add the skybox gradient
 * 
 */


export default class MainScene extends THREE.Scene {

    private readonly cameraManager = Container.get(CameraManager);

    gui = new GUI();
    private readonly keyDown = new Set<string>()

    private readonly mtlLoader = new MTLLoader()
	private readonly objLoader = new OBJLoader()

    get mainCamera() { return this.cameraManager.mainCamera; }

    private directionVector = new THREE.Vector3()

    _renderer: any;
    get renderer() { return this._renderer; }

    private _player: PlayerEntity = new PlayerEntity();
    get player() { return this._player;}
    set player(player: PlayerEntity) { this._player = player; }

    private _cubes: Array<CubeEntity> = new Array<CubeEntity>();
    get cubes() { return this._cubes; }
    set cubes(value) { this._cubes = value; }

    private _planeEntity: PlaneEntity = new PlaneEntity();
    get planeEntity() { return this._planeEntity; }
    set planeEntity(value) { this._planeEntity = value; }

    CAM_CONFIG = GameOptions.GameCameraConfig;

    //private scale = new THREE.Vector3(1,1,1);
    
    constructor(
        renderer: any) {
            super();
            this._renderer = renderer;
    }

    async initialize() {
        this.initGui();
        await this.player.initialize();
        await this.planeEntity.initialize();
        this.add(this.player.group);
        this.add(this.planeEntity.group);

        //MMOVE THIS TO CAM MANAGER
        this.mainCamera.position.set(this.CAM_CONFIG.position.x, this.CAM_CONFIG.position.y, this.CAM_CONFIG.position.z)
        this.mainCamera.rotation.set(this.CAM_CONFIG.rotation.x, this.CAM_CONFIG.rotation.y, this.CAM_CONFIG.rotation.z)
        //this.player.group.add(this.camera);

        this.add(new AmbientLightEntity());

        await this.initCube();

        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
    }

    update() {
        this.handleInput();
    }

    async initCube() {
        for (let i = 0; i < 1; i++) {
            const cube = new CubeEntity();
            await cube.initialize();
            this.add(cube.group);
            this.cubes.push(cube);
        }
    }


    // need to figure out best place to put this
    // Manager?
    private initGui() {
        this.gui.add(GameOptions.PlayerConfig, "scale").onChange(() => {
            this.player.group.scale.set(GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale)
        });

        this.gui.add(GameOptions.PlayerConfig, "speed").onChange(() => {
            //this.player.group.scale.set(GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale)
        });

        this.gui.add(GameOptions.GameCameraConfig, "positionX").onChange(() => {
            this.mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });

        this.gui.add(GameOptions.GameCameraConfig, "positionY").onChange(() => {
            this.mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });

        this.gui.add(GameOptions.GameCameraConfig, "positionZ").onChange(() => {
            this.mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase());
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyDown.delete(event.key.toLowerCase());
	}


    // move to player manager
    private handleInput() {
        const dir = this.directionVector
		this.mainCamera.getWorldDirection(dir);

        const oldObjectPosition = new THREE.Vector3();
        this.player?.group?.getWorldPosition(oldObjectPosition);

        const strafeDir = dir.clone()
        const upVector = new THREE.Vector3(0, 1, 0);
        const camUpVector = new THREE.Vector3(1, 0, 0)
        this.player?.group?.rotateZ(0);
        if (this.keyDown.has('a') || this.keyDown.has('arrowleft')) {
            this.player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(GameOptions.PlayerConfig.speed)
            );

            if (THREE.MathUtils.radToDeg(this.player.group.rotation.z) < 8) {
                this.player.group.rotateZ(THREE.MathUtils.degToRad(8));

                if (THREE.MathUtils.radToDeg(this.mainCamera.rotation.z) < 4) {
                    this.mainCamera.rotateZ(THREE.MathUtils.degToRad(4))
                }
            }


            const newObjectPosition = new THREE.Vector3();
            this.player.group.getWorldPosition(newObjectPosition);

            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            this.mainCamera.position.add(delta)

            return;
        }

        if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
        {
            this.player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
						.multiplyScalar(GameOptions.PlayerConfig.speed)
            )

            
            if (THREE.MathUtils.radToDeg(this.player.group.rotation.z) > -8) {
                this.player.group.rotateZ(THREE.MathUtils.degToRad(-8));

                if (THREE.MathUtils.radToDeg(this.mainCamera.rotation.z) > -4) {
                    this.mainCamera.rotateZ(THREE.MathUtils.degToRad(-4))
                }
            }

            const newObjectPosition = new THREE.Vector3();
            this.player.group.getWorldPosition(newObjectPosition);

            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            this.mainCamera.position.add(delta)

            return
        }
    }
}