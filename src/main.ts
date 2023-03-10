import * as THREE from 'three';
import MainScene from './scenes/main.scene';

const width = window.innerWidth
const height = window.innerHeight

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height)
document.body.appendChild( renderer.domElement )

const mainCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
const mainScene = new MainScene(mainCamera);
mainScene.initialize()

function tick()
{
	mainScene.update()
	renderer.render(mainScene, mainCamera)
	requestAnimationFrame(tick)
}

tick()
