function getCssColorValue(className) {
  const tempElement = document.createElement('div');
  tempElement.className = className;
  document.body.appendChild(tempElement);
  const colorValue = getComputedStyle(tempElement).color;
  document.body.removeChild(tempElement);
  return colorValue;
}

const data = {
  nodes: [
    { id: "Note1" },
    { id: "Note2" },
    { id: "Note3" },
    { id: "Note4" },
    { id: "Note5" },
    { id: "Note6" },
    { id: "Note7" },
    { id: "Note8" },
    { id: "Note9" },
    { id: "Note10" },
    { id: "Note11" },
    { id: "Note12" },
    { id: "Note13" },
    { id: "Note14" },
    { id: "Note15" },
    { id: "Note16" },
    { id: "Note17" },
    { id: "Note18" },
    { id: "Note19" },
    { id: "Note20" },
    { id: "Note21" },
    { id: "Note22" },
    { id: "Note23" },
    { id: "Note24" },
    { id: "Note25" },
    { id: "Note26" },
    { id: "Note27" },
    { id: "Note28" },
    { id: "Note29" },
    { id: "Note30" },

    { id: "Note31" },
    { id: "Note32" },
    { id: "Note33" },
    { id: "Note34" },
    { id: "Note35" },
    { id: "Note36" },
  ],
  links: [
    { source: "Note1", target: "Note2" },
    { source: "Note1", target: "Note3" },
    { source: "Note1", target: "Note4" },
    { source: "Note2", target: "Note5" },
    { source: "Note2", target: "Note6" },
    { source: "Note3", target: "Note7" },
    { source: "Note3", target: "Note8" },
    { source: "Note4", target: "Note9" },
    { source: "Note4", target: "Note10" },
    { source: "Note5", target: "Note11" },
    { source: "Note5", target: "Note12" },
    { source: "Note6", target: "Note13" },
    { source: "Note6", target: "Note14" },
    { source: "Note7", target: "Note15" },
    { source: "Note7", target: "Note16" },
    { source: "Note8", target: "Note17" },
    { source: "Note8", target: "Note18" },
    { source: "Note9", target: "Note19" },
    { source: "Note9", target: "Note20" },
    { source: "Note10", target: "Note21" },
    { source: "Note10", target: "Note22" },
    { source: "Note11", target: "Note23" },
    { source: "Note11", target: "Note24" },
    { source: "Note12", target: "Note25" },
    { source: "Note12", target: "Note26" },
    { source: "Note13", target: "Note27" },
    { source: "Note13", target: "Note28" },
    { source: "Note14", target: "Note29" },
    { source: "Note14", target: "Note30" },

    { source: "Note31", target: "Note32" },
    { source: "Note32", target: "Note33" },
    { source: "Note33", target: "Note34" },
    { source: "Note34", target: "Note35" },
    { source: "Note35", target: "Note36" },
    { source: "Note36", target: "Note31" },
  ],
};

let highlightNodes = new Set();
let highlightLinks = new Set();

const regularNodeColor = getCssColorValue('node-color');
const highlightedNodeColor = getCssColorValue('hl-node-color');
const regularLinkColor = getCssColorValue('node-line-color');
const highlightedLinkColor = getCssColorValue('hl-node-line-color');
const textColor = getCssColorValue('node-text-color');

const Graph = ForceGraph3D()(document.getElementById("3d-graph"))
  .graphData(data)
  .nodeLabel("id")
  .nodeAutoColorBy("id")
  .nodeThreeObject((node) => {
    const sphereGeometry = new THREE.SphereGeometry(8, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: highlightNodes.has(node) ? highlightedNodeColor : regularNodeColor,
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(generateLabelCanvas(node.id)),
        depthWrite: false,
      })
    );
    sprite.scale.set(40, 20, 1);
    sprite.position.set(0, 20, 0);

    sphere.add(sprite);
    return sphere;
  })
  .linkWidth((link) => (highlightLinks.has(link) ? 4 : 1.5))
  .linkColor((link) => (highlightLinks.has(link) ? highlightedLinkColor : regularLinkColor))
  .onNodeHover((node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node) {
      highlightNodes.add(node);
      data.links.forEach((link) => {
        if (link.source.id === node.id || link.target.id === node.id) {
          highlightLinks.add(link);
          highlightNodes.add(
            link.source.id === node.id ? link.target : link.source
          );
        }
      });
    }
    Graph.refresh(); // Refresh the graph to update the highlights
  })
  .onNodeClick((node) => alert(node.id))
  .linkDirectionalParticles(0);

function generateLabelCanvas(text) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "80px Arial";
  context.fillStyle = textColor;
  context.fillText(text, 0, 80);
  return canvas;
}

Graph.cameraPosition({ z: 800 });