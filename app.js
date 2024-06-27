export function init() {
    let scene, camera, renderer, uniforms;

    scene = new THREE.Scene();
    camera = new THREE.Camera();
    camera.position.z = 1;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    uniforms = {
        iTime: { value: 0.0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
    };

    const vertexShader = `
        void main() {
            gl_Position = vec4(position, 1.0);
        }
    `;

    const fragmentShader = `
        uniform float iTime;
        uniform vec2 iResolution;

        void mainImage(out vec4 fragColor, in vec2 fragCoord) {
            vec2 uv = fragCoord / iResolution.xy;
            vec2 p = uv - 0.5;
            p.x *= iResolution.x / iResolution.y;
            float a = atan(p.y, p.x);
            float r = length(p);
            float f = abs(sin(10.0 * a + 5.0 * r - iTime * 0.5));
            f = pow(f, 3.0);
            fragColor = vec4(vec3(f), 1.0);
        }

        void main() {
            mainImage(gl_FragColor, gl_FragCoord.xy);
        }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(plane, material);
    scene.add(quad);

    function animate() {
        uniforms.iTime.value += 0.05;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
}

export function animate() {
    uniforms.iTime.value += 0.05;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
