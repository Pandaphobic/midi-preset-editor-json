// var declared on app open
var buttonIndexCount = 1;
let fileLoaded = false;
// Find a <table> element with id="myTable":
var tbodyRef = document.querySelector("tbody");
const newRowBtn = document.querySelector("[name=add-row]");
const saveFileBtn = document.querySelector("[name=save-file]");
const loadFileBtn = document.querySelector("[name=load-file]");

newRowBtn.addEventListener("click", CreateNewRow);
loadFileBtn.addEventListener("click", LoadFile);

saveFileBtn.addEventListener("click", () => {
  SaveAsJSONFile(Preset);
});

// ****** EXAMPLE OBJECT ****** //
let Preset = {
  button_1: { type: "PC", value: 1, channel: 1 },
  button_2: { type: "PC", value: 2, channel: 1 },
  button_3: { type: "PC", value: 3, channel: 1 },
  button_4: { type: "PC", value: 4, channel: 1 },
  button_5: { type: "CC", value: 5, channel: 1, velocity: 0 },
  button_6: { type: "CC", value: 6, channel: 1, velocity: 0 },
  button_7: { type: "CC", value: 7, channel: 1, velocity: 0 },
  button_8: { type: "CC", value: 8, channel: 1, velocity: 0 },
};

function UpdateValue(cought_value, cought_type) {
  let index = parseInt(cought_value.name);
  // index += 1;
  let valueOrigin = cought_value.id;
  let valueToUpdateUI = cought_value.value;

  if (cought_type == "databox") {
    valueToUpdateUI = parseInt(valueToUpdateUI);

    if (valueOrigin.includes("ch")) {
      Preset[`button_${index}`].channel = valueToUpdateUI;
      console.log(`channel: ${valueToUpdateUI}`);
    }

    if (valueOrigin.includes("vel")) {
      Preset[`button_${index}`].velocity = valueToUpdateUI;
      console.log(`velocity: ${valueToUpdateUI}`);
    }

    if (valueOrigin.includes("val")) {
      Preset[`button_${index}`].value = valueToUpdateUI;
      console.log(`value: ${valueToUpdateUI}`);
    }
  }

  if (cought_type == "select") {
    console.log(index);
    if (document.getElementById(cought_value.id).value == 1) {
      Preset[`button_${index}`].type = "PC";
      console.log(Preset[`button_${index}`].type);
    }
    if (document.getElementById(cought_value.id).value == 2) {
      Preset[`button_${index}`].type = "CC";
      console.log(Preset[`button_${index}`].type);
    }
  }
}

// ******  FILE HANDLING  ****** //

function SaveAsJSONFile(preset_object) {
  let outputJSON = JSON.stringify(preset_object);
  SaveAsFile(outputJSON, "preset.json", "text/plain;charset=utf-8");
}

function LoadFile() {
  fileLoaded = true;
  if (fileLoaded) {
    document.querySelector("#choose-file-text").innerHTML = " Load File";
    document.querySelector("#load-file").classList.remove("btn-secondary");
    document.querySelector("#load-file").classList.add("btn-success");
  }

  let file = document.querySelector("#file-input").files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function (e) {
    let text = e.target.result;
    console.log(text);
    let preset_object = JSON.parse(text);
    Preset = preset_object;
    PopulateTable(preset_object);
  });
  reader.readAsText(file);
}

function SaveAsFile(t, f, m) {
  try {
    var b = new Blob([t], { type: m });
    saveAs(b, f);
  } catch (e) {
    window.open("data:" + m + "," + encodeURIComponent(t), "_blank", "");
  }
}

// ******  Table Managemenmt ****** //

const RowsToCreate = function (preset_object) {
  let arrayOfRows = [];
  arrayOfRows = [];
  for (const [key, value] of Object.entries(preset_object)) {
    // console.log(`${key}: ${value}`);
    arrayOfRows.push(value);
  }
  // turns RowsToCreate into an array of the rows to create
  return arrayOfRows;
};

// This feels gross
// RowsToCreate(Preset).forEach(CreateNewRow);

function CreateNewRow(item, index) {
  buttonIndexCount++;
  console.log(item);
  // 0 index looks weird to users so begin with 1
  index++;
  let PresetName = `button_${index}`;
  let PC = 0;
  let CC = 0;
  let Custom = 0;

  // Decide which type should display selected
  switch (item.type) {
    case "CC":
      CC = 1;
      break;
    case "PC":
      PC = 1;
      break;
    case "Custom":
      Custom = 1;
      break;

    default:
      break;
  }

  var newRow = document.createElement("tr");
  newRow.innerHTML += `
  <td>
  <input
    class="form-control"
    type="text"
    disabled
    name="preset-name"
    
    id="${PresetName}"
    value="${PresetName}"
  />
</td>
<td>
  <select name="${index}" id="type${index}" class="custom-select" onchange="UpdateValue(this, 'select')" >
    <option ${PC ? 'selected=""' : ""}value="1">PC</option>
    <option ${CC ? 'selected=""' : ""}value="2">CC</option>
    <option ${Custom ? 'selected=""' : ""}value="3">Cust.</option>
  </select>
</td>
<td>
  <input onChange="UpdateValue(this, 'databox')" class="data-box form-control" type="text" name="${index}" id="ch${index}" value="${
    item.channel
  }" />
</td>
<td>
  <input onChange="UpdateValue(this, 'databox')" class="data-box form-control" type="text" name="${index}" id="vel${index}" value="${
    item.velocity ? item.velocity : 0
  }" />
</td>
<td>
  <input onChange="UpdateValue(this, 'databox')" class="data-box form-control" type="text" name="${index}" id="val${index}" value="${
    item.value
  }" />
</td>
`;

  tbodyRef.appendChild(newRow);
}

function PopulateTable(preset_object) {
  RowsToCreate(preset_object).forEach(CreateNewRow);
}
