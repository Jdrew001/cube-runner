import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import GUI from "lil-gui";
import GameOptions from "../config/options.config";
import PlayerEntity from "../entities/player.entity";
import AmbientLightEntity from "../entities/ambient-light.entity";


export default class MainScene extends THREE.Scene {

    gui = new GUI();
    private readonly keyDown = new Set<string>()

    private readonly mtlLoader = new MTLLoader()
	private readonly objLoader = new OBJLoader()

    private _camera: THREE.PerspectiveCamera;
    get camera() { return this._camera; }

    private directionVector = new THREE.Vector3()

    _renderer: any;
    get renderer() { return this._renderer; }

    private _player: PlayerEntity = new PlayerEntity();
    get player() { return this._player;}
    set player(player: PlayerEntity) { this._player = player; }

    CAM_CONFIG = GameOptions.GameCameraConfig;

    //private scale = new THREE.Vector3(1,1,1);
    
    constructor(
        camera: THREE.PerspectiveCamera,
        renderer: any) {
            super();
            this._camera = camera;
            this._renderer = renderer;
    }

    async initialize() {
        this.initGui();
        await this.player.initialize();
        this.add(this.player.group);

        this.camera.position.set(this.CAM_CONFIG.position.x, this.CAM_CONFIG.position.y, this.CAM_CONFIG.position.z)
        //this.player.group.add(this.camera);
        this.player.group.add(new AmbientLightEntity())

        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp)
    }

    update() {
        this.handleInput();
    }

    private initGui() {
        this.gui.add(GameOptions.PlayerConfig, "scale").onChange(() => {
            this.player.group.scale.set(GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale)
        });
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase());
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyDown.delete(event.key.toLowerCase());
	}

    private handleInput() {
        const speed = 0.1
        const dir = this.directionVector
		this.camera.getWorldDirection(dir)
        const strafeDir = dir.clone()
        const upVector = new THREE.Vector3(0, 1, 0)
        if (this.keyDown.has('a') || this.keyDown.has('arrowleft')) {
            this.player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(speed)
            )
            return;
        }

        if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
        {
            this.player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
						.multiplyScalar(speed)
            )
            return
        }
    }
}