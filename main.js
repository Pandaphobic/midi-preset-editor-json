// Find a <table> element with id="myTable":
var tbodyRef = document.querySelector("tbody");
const newRowBtn = document.querySelector("[name=add-row]");
const saveFileBtn = document.querySelector("[name=save-file]");
const loadFileBtn = document.querySelector("[name=load-file]");

class Preset {
  constructor(name) {
    this[`${name ? name : "button_1"}`] = {
      type: "PC",
      value: 0,
      channel: 0,
      velocity: 0,
    };
  }

  Size() {
    var size = 0,
      key;
    for (key in this) {
      if (this.hasOwnProperty(key)) size++;
    }
    return size;
  }

  CreateNewRow() {
    let button_name = "";
    button_name = `button_${this.Size() + 1}`;
    console.log(button_name);

    this[`${button_name}`] = {
      type: "PC",
      value: 0,
      channel: 0,
      velocity: 0,
    };

    return `${button_name} has been created`;
  }

  UpdateRow(row_name, update_type, update_value) {
    if (this[`${row_name}`]) {
      this[`${row_name}`][`${update_type}`] = update_value;
    } else {
      console.log("Row name not found - nothing changed");
    }
    console.log(this);
  }

  RemoveRow(row_name) {
    if (this[`${row_name}`]) {
      delete this[`${row_name}`];
    } else {
      console.log("Row name not found - nothing removed");
    }
  }
}

// Instatiates a default preset for use at startup
// should be entirely replaced by loading a json preset
var CurrentPreset = new Preset();
UpdateTable(CurrentPreset);

function UpdateValue(item) {
  let i = item.id;
  let val = item.value;
  if (i.includes("ch")) {
    i = "channel";
    val = parseInt(item.value);
  } else if (i.includes("val")) {
    i = "value";
    val = parseInt(item.value);
  } else if (i.includes("vel")) {
    i = "velocity";
    val = parseInt(item.value);
  } else if (i.includes("type")) {
    i = "type";
    switch (item.value) {
      case "1":
        val = "PC";
        break;
      case "2":
        val = "CC";
        break;
      case "3":
        val = "Cust";
        break;

      default:
        break;
    }
  }

  CurrentPreset.UpdateRow(`button_${item.name}`, i, val);
  console.log(`button_${item.name}`);
  console.log(item.id);
  console.log(item.value);
}

newRowBtn.addEventListener("click", () => {
  CurrentPreset.CreateNewRow();
  UpdateTable(CurrentPreset);
});

// **** OPEN FILE ON LOCAL MACHINE ****
var element = document.createElement("div");
element.innerHTML = '<input type="file">';
var fileInput = element.firstChild;

fileInput.addEventListener("change", function () {
  var file = fileInput.files[0];

  if (file.name.match(/\.(json)$/)) {
    var reader = new FileReader();

    reader.onload = function () {
      CurrentPreset = Object.assign(CurrentPreset, JSON.parse(reader.result));
      // trigger draw preset on screen
      UpdateTable(CurrentPreset);
    };

    reader.readAsText(file);
  } else {
    alert("File not supported, json files only");
  }
});

function UpdateTable(preset_object) {
  let index = 0;
  let CC = false;
  let PC = false;
  let Custom = false;

  // Clear Table
  tbodyRef.innerHTML = ``;

  for (const [key, value] of Object.entries(preset_object)) {
    index++;
    CC = false;
    PC = false;
    Custom = false;

    console.log(key);

    switch (preset_object[`${key}`].type) {
      case "PC" || "pc":
        PC = true;
        break;
      case "CC" || "cc":
        CC = true;
        break;
      case "Custom" || "custom" || "custom":
        Custom = true;
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
      
      id="${key}"
      value="${key}"
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
      preset_object[`${key}`].channel
    }" />
    </td>
    <td>
      <input onChange="UpdateValue(this, 'databox')" class="data-box form-control" type="text" name="${index}" id="vel${index}" value="${
      preset_object[`${key}`].velocity ? preset_object[`${key}`].velocity : 0
    }" />
    </td>
    <td>
      <input onChange="UpdateValue(this, 'databox')" class="data-box form-control" type="text" name="${index}" id="val${index}" value="${
      preset_object[`${key}`].value
    }" />
    </td>`;
    console.log(newRow);
    tbodyRef.appendChild(newRow);
  }
}

function SaveCurrentPresetAsJSONFile() {
  let output = JSON.stringify(CurrentPreset);
  SaveAsFile(output, "preset.json", "text/plain;charset=utf-8");
}

function SaveAsFile(t, f, m) {
  try {
    var b = new Blob([t], { type: m });
    saveAs(b, f);
  } catch (e) {
    window.open("data:" + m + "," + encodeURIComponent(t), "_blank", "");
  }
}

loadFileBtn.addEventListener("click", () => {
  fileInput.click();
});

saveFileBtn.addEventListener("click", SaveCurrentPresetAsJSONFile);
