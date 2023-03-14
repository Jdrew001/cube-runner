import * as THREE from "three";
import Container, { Service } from "typedi";
import GameOptions from "../config/options.config";
import PlaneManager from "./plane.manager";

@Service()
export default class InputManager {

    clock = new THREE.Clock();
    get scene() { return this._scene; }
    private _scene: THREE.Scene;

    private directionVector = new THREE.Vector3();
    private readonly keyDown = new Set<string>();
    private readonly planeManager = Container.get(PlaneManager);

    private animateTime = 1/18;

    initialize(scene: THREE.Scene) {
        this._scene = scene;
        document.addEventListener('keydown', this.handleKeyDown)
		document.addEventListener('keyup', this.handleKeyUp);
        this.clock.start();
    }

    handleInput(player, mainCamera, planeBuffer) {
        const dir = this.directionVector
		mainCamera.getWorldDirection(dir);

        const oldObjectPosition = new THREE.Vector3();
        player?.group?.getWorldPosition(oldObjectPosition);

        const strafeDir = dir.clone()
        const upVector = new THREE.Vector3(0, 1, 0);
        const camUpVector = new THREE.Vector3(1, 0, 0)
        player?.group?.rotateZ(0);

        //moving left
        if (this.keyDown.has('a') || this.keyDown.has('arrowleft')) {
            player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * 0.5)
						.multiplyScalar(GameOptions.PlayerConfig.speed)
            );

            if (THREE.MathUtils.radToDeg(player.group.rotation.z) < 8) {
                player.group.rotateZ(THREE.MathUtils.degToRad(8));

                if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) < 1) {
                    mainCamera.rotateZ(THREE.MathUtils.degToRad(1))
                }
            }


            const newObjectPosition = new THREE.Vector3();
            player.group.getWorldPosition(newObjectPosition);

            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            mainCamera.position.add(delta)
            planeBuffer?.position.add(delta);

            this.planeManager.resetPlaneXPositionLeft(player.group.position.x);

            return;
        }

        //moving right
        if (this.keyDown.has('d') || this.keyDown.has('arrowright'))
        {
            player.group.position.add(
                strafeDir.applyAxisAngle(upVector, Math.PI * -0.5)
						.multiplyScalar(GameOptions.PlayerConfig.speed)
            )

            
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) > -8) {
                player.group.rotateZ(THREE.MathUtils.degToRad(-8));

                if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) > -1) {
                    mainCamera.rotateZ(THREE.MathUtils.degToRad(-1))
                }
            }

            const newObjectPosition = new THREE.Vector3();
            player.group.getWorldPosition(newObjectPosition);

            const delta = newObjectPosition.clone().sub(oldObjectPosition);
            mainCamera.position.add(delta)
            planeBuffer?.position.add(delta);

            this.planeManager.resetPlaneXPositionRight(player.group.position.x);

            return
        }

        if (this.clock.getElapsedTime() > this.animateTime) {
            console.log(THREE.MathUtils.radToDeg(player.group.rotation.z))
            if (THREE.MathUtils.radToDeg(player.group.rotation.z) < 0) {
                player.group.rotateZ(THREE.MathUtils.degToRad(8));
            }

            if (THREE.MathUtils.radToDeg(player.group.rotation.z) > 0) {
                player.group.rotateZ(THREE.MathUtils.degToRad(-8));
            }

            //camera reset
            if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) < 0) {
                mainCamera.rotateZ(THREE.MathUtils.degToRad(1/2))
            }

            if (THREE.MathUtils.radToDeg(mainCamera.rotation.z) > 0) {
                mainCamera.rotateZ(THREE.MathUtils.degToRad(-1/2))
            }

            this.clock.start();
        }
    }

    private handleKeyDown = (event: KeyboardEvent) => {
		this.keyDown.add(event.key.toLowerCase());
	}

	private handleKeyUp = (event: KeyboardEvent) => {
		this.keyDown.delete(event.key.toLowerCase());
	}
}