import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'


class Preview {
  constructor(canvas, {path, width, height, sceneColor, animation, scene} = {}) {
    // renderer
    this.renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    this.renderer.setClearColor(sceneColor);
    this.renderer.setSize(width, height);
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.renderer.physicallyCorrectLights = true

    // camera
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.5, 3000);
    this.camera.position.set(5, 7, 10)

    // add controls
    this.controls = new OrbitControls(this.camera, canvas.parentElement)
    this.controls.update();
    this.controls.target.set(0, 1, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 6;
    this.controls.maxPolarAngle = 1;
    this.controls.maxAzimuthAngle = Math.PI;
    this.controls.enablePan = false;

    // set aspect ratio to match the new browser window aspect ratio
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()


    if (scene) {
      this.scene = scene;
    } else {
      this.scene = new THREE.Scene();
      this.holder = new THREE.Group();

      // light
      this.light = new THREE.HemisphereLight( 0xffffff, 0xaaaaaa, 1.5 );
      this.holder.add(this.light);

      if (path.includes("plate")) {
        this.controls.target.set(0, 0.5, 0);
        this.mainLight = new THREE.DirectionalLight(0xdedede, 1.5)
        this.mainLight.position.set(10, 7, 10);
        this.holder.add(this.mainLight)
        this.ambidentLight = new THREE.AmbientLight(0xffffff, .3);
        this.holder.add(this.ambidentLight);
      } else if(path.includes("cup")) {
        // this.light = new THREE.HemisphereLight( 0xffffff, 0xcccccc, 2.3 );
        // this.scene.add(this.light);
        this.ambidentLight = new THREE.AmbientLight(0xffffff, 1.3);
        this.holder.add(this.ambidentLight);
      }

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
          this.holder.add(this.model)
        },
        undefined,
        undefined);
      this.scene.add(this.holder)
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

}

export default Preview;
