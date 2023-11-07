const imgElement = document.getElementById("image");
const fileInput = document.getElementById("file");
const downloadButton = document.getElementById("download");
const previewButton = document.getElementById("preview");
const container = document.querySelector(".container");
const outputCanvas = document.getElementById("output-canvas");
const postUploadContainer = document.getElementById("post-upload-container");

let cvReady = false,
  fileName = "";
function openCvReady() {
  cv["onRuntimeInitialized"] = () => {
    cvReady = true;
  };
}
fileInput.onchange = () => {
  let reader = new FileReader();
  reader.readAsDataURL(fileInput.files[0]);
  reader.onload = () => {
    imgElement.setAttribute("src", reader.result);
    container.classList.add("hide");
    postUploadContainer.classList.remove("hide");
  };
  fileName = fileInput.files[0].name.split(".")[0];
};

const imageApply = () => {
  const mat = cv.imread(imgElement);
  const newImage = new cv.Mat();
  cv.cvtColor(mat, newImage, cv.COLOR_BGR2GRAY, 0);
  const edges = new cv.Mat();
  cv.adaptiveThreshold(
    newImage,
    edges,
    255,
    cv.ADAPTIVE_THRESH_MEAN_C,
    cv.THRESH_BINARY,
    9,
    9
  );
  const color = new cv.Mat();
  cv.bilateralFilter(newImage, color, 9, 250, 250, cv.BORDER_DEFAULT);
  cv.cvtColor(mat, color, cv.COLOR_RGBA2RGB, 0);

  const cartoon = new cv.Mat();
  cv.bitwise_and(color, color, cartoon, edges);
  cv.imshow("output-canvas", cartoon);
  mat.delete();
  newImage.delete();
  edges.delete();
  cartoon.delete();
};

previewButton.addEventListener("click", () => {
  if (cvReady) {
    imageApply();
    downloadButton.classList.remove("hide");
    let imagedata = outputCanvas.toDataURL("image/png");
    downloadButton.href = imagedata;
    downloadButton.download = `${fileName}.png`;
  } else {
    alert("Something went wrong.Please try again!");
  }
});
