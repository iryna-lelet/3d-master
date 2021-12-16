import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import * as Exporter from '@doodle3d/threejs-export-obj';


class Preview {
  constructor(canvas, {path, width, height, sceneColor, animation, scene} = {}) {
    // renderer
    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    this.renderer.setClearColor(sceneColor);
    this.renderer.setSize(width, height);
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.physicallyCorrectLights = true

    // camera
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.5, 3000);
    this.camera.position.set(5, 5, 0)

    // add controls
    this.controls = new OrbitControls(this.camera, canvas.parentElement)
    this.controls.update();
    this.controls.enableDamping = true;
    this.controls.minDistance = 4;
    this.controls.minDistance = 5;
    this.controls.maxPolarAngle = 1;
    this.controls.maxAzimuthAngle = Math.PI;

    // set aspect ratio to match the new browser window aspect ratio
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    if (scene) {
      this.scene = scene;
    } else {
      this.scene = new THREE.Scene();

      // light
      this.mainLight = new THREE.DirectionalLight(0xffffff, 4.0)
      this.mainLight.position.set(10, 10, 10);
      this.ambidentLight = new THREE.AmbientLight(0xffffff, .5);
      this.scene.add(this.mainLight, this.ambidentLight);

      // model
      const loader = new GLTFLoader();
      this.model = {}
      loader.load(path, gltf => {
          this.model = gltf.scene
          this.model.traverse((o) => {
            if (o.isMesh) {
              if (o.name === "outside") {
                this.defaultTexture = o.material.map;
              }
            }
          });
          this.scene.add(this.model)
        },
        undefined,
        undefined);
      this.render()
    }
    this.animation = animation;
  }

  mirror(canvas, {width, height}) {
    return new Preview(canvas, {
      width,
      height,
      animation: this.animation,
      sceneColor: this.renderer.getClearColor(),
      scene: this.scene
    });
  }

  set picture(path) {
    this.front = new THREE.TextureLoader().load(path);
  }

  set base64(src) {
    const image = new Image();
    image.src = src;
    const texture = new THREE.Texture();
    texture.image = image;
    image.onload = () => {
      texture.needsUpdate = true;
    };
    this.front = texture;
  }

  set front(texture) {
    texture.flipY = false;
    this.model.traverse((o) => {
      if (o.isMesh) {
        if (o.name === "outside") {
          o.material.map = texture;
          o.material.transparent = true
        }
      }
    });
  }

  clear() {
    this.model.traverse((o) => {
      if (o.isMesh) {
        if (o.name === "outside") {
          o.material.map = this.defaultTexture;
        }
      }
    });
  }

  resize(width, height) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    this.model.rotation.y += Math.PI / 190;
  }

  render() {
    if (this.animation) {
      if (this.model !== undefined) this.animate();
    }
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  }

  async export() {
    return Exporter.fromMesh(this.mesh);
  }
}

export default Preview;
