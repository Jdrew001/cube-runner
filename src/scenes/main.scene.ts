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

    

    private planeManager = Container.get(PlaneManager);

    constructor(
        renderer: any) {
            super();
            this._renderer = renderer;
    }

    async initialize() {
        this.initGui();
        await this.player.initialize();
        await this.planeManager.initialize(this);
        

        const mapLoader = new THREE.TextureLoader();
        const checkerboard = mapLoader.load('assets/grid.png');
        const planeBG = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 20, 10, 10),
            new THREE.MeshStandardMaterial({map: checkerboard}));
            planeBG.castShadow = false;
            planeBG.receiveShadow = true;
            planeBG.rotation.x = -Math.PI / 2;
            planeBG.position.add(new THREE.Vector3(0,0.1,-60));
        this.add(this.player.group);
        this.add(planeBG)
        this.add(new AmbientLightEntity());

        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
    }

    update() {
        this.handleInput();
        this.planeManager.update();
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

                // if (THREE.MathUtils.radToDeg(this.mainCamera.rotation.z) < 4) {
                //     this.mainCamera.rotateZ(THREE.MathUtils.degToRad(4))
                // }
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

                // if (THREE.MathUtils.radToDeg(this.mainCamera.rotation.z) > -4) {
                //     this.mainCamera.rotateZ(THREE.MathUtils.degToRad(-4))
                // }
            }

            const newObjectPosition = new THREE.Vector3();
            this.player.group.getWorldPosition(newObjectPosition);

            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            this.mainCamera.position.add(delta)

            return
        }
    }
}