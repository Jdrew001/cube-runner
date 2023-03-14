import GUI from "lil-gui";
import { Service } from "typedi";
import GameOptions from "../config/options.config";

@Service()
export default class DebugManager {
    
    private _gui;
    get gui(): GUI { return this._gui; }
    private set gui(value) { this._gui = value; }

    initialize() {
        this.gui = new GUI();
        this.gui.close();
        this.gui.title('Cube Runner Debug')
    }

    playerDebugOptions(player) {
        const playerFolder = this.gui.addFolder('Player Options');
        playerFolder.add(GameOptions.PlayerConfig, "scale").onChange(() => {
            player.group.scale.set(GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale, GameOptions.PlayerConfig.scale)
        });
        playerFolder.add(GameOptions.PlayerConfig, "speed");
    }

    gameCameraOptions(mainCamera) {
        const camFolder = this.gui.addFolder('Main Camera Options');
        camFolder.add(GameOptions.GameCameraConfig, "positionX").onChange(() => {
            mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });

        camFolder.add(GameOptions.GameCameraConfig, "positionY").onChange(() => {
            mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });

        camFolder.add(GameOptions.GameCameraConfig, "positionZ").onChange(() => {
            mainCamera.position.set(GameOptions.GameCameraConfig.positionX, GameOptions.GameCameraConfig.positionY, GameOptions.GameCameraConfig.positionZ)
        });
    }

    LightOptions() {
        const lightFolder = this.gui.addFolder('Light Options');
        lightFolder.addColor(GameOptions.LightConfig, 'color', 255)
    }

    CubeOptions() {

    }

    planeDebugOptions() {

    }
}