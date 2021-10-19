import React, { Component } from "react";
import * as THREE from "three";
import { MTLLoader, OBJLoader } from "three-obj-mtl-loader";
import OrbitControls from "three-orbitcontrols";

class Chat extends Component {
  constructor(imagen) {
    super();
    this.img = imagen;
  }

  componentDidMount() {
    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;
    this.scene = new THREE.Scene();

    //Add Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#ffffff");
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);

    //add Camera
    this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000);
    this.camera.position.z = 20;
    this.camera.position.y = 5;

    //Camera Controls
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Simple Box with WireFrame

    this.addModels(this.img);

    this.renderScene();
    //start animation
    this.start();
  }

  addModels(img) {
    // -----Step 1--------
    var geometry = new THREE.SphereGeometry(5, 10, 10);
    //const geometry = new THREE.BoxGeometry(9, 9, 9);

    //var geometry = new THREE.CircleGeometry(5, 32);
    // const geometry = new THREE.BoxGeometry(7, 7, 7);
    const material = new THREE.MeshBasicMaterial({});

    this.cube = new THREE.Mesh(geometry, material);
    this.scene.add(this.cube);

    new THREE.TextureLoader().setCrossOrigin("anonymous").load(
      img.imagen,
      (texture1) => {
        this.cube.material.map = texture1;
        this.cube.material.needsUpdate = true;
      },
      (xhr) => {
        //Download Progress
        //console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        //Error CallBack
        console.log("An error happened" + error);
      }
    );
  }

  componentWillUnmount() {
    this.stop();
    this.mount.removeChild(this.renderer.domElement);
  }
  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  animate = () => {
    // -----Step 3--------
    //Rotate Models
    if (this.cube) this.cube.rotation.y += 0.008;
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  };
  renderScene = () => {
    if (this.renderer) this.renderer.render(this.scene, this.camera);
  };

  render() {
    return (
      <div
        style={{ width: "80px", height: "80px" }}
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
export default Chat;
