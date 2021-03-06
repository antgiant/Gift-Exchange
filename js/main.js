var name_list = document.getElementById('name-list');
var selected_list = document.getElementById('selected-list');
var suggested_pairings = document.getElementById('suggested-pairing');
var current_list_id = 0;

const urlParams = new URLSearchParams(window.location.search);
var save_state = JSON.parse(urlParams.get('data'));
if (save_state == null) {
  save_state = {
    names:[],
    locked:[],
    exchange: [{
      title:"",
      selected:[],
      individual_exclusions:[],
      groupings:[],
      grouping_exclusions:[],
    }]
  };
} else {
  current_list_id = save_state.exchange.length - 1;
  update_name_list();
  update_selected_name_list();
}
function update_name_list(remove) {
  if (save_state.locked[remove] == null || save_state.locked[remove] < 1) {
    if (remove >= 0 && remove < save_state.names.length) {
      for(i = 0; i < save_state.names.length; i++) {
        save_state.exchange[current_list_id].individual_exclusions[i].splice(remove, 1);
      }
      save_state.names.splice(remove, 1);
      save_state.locked.splice(remove, 1);
      save_state.exchange[current_list_id].selected.splice(remove, 1);
      save_state.exchange[current_list_id].individual_exclusions.splice(remove, 1);
    } else if (document.getElementsByName("name")[0].value != "") {
      save_state.names.push(document.getElementsByName("name")[0].value);
      save_state.locked.push(0);
      save_state.exchange[current_list_id].selected.push(0);
      document.getElementsByName("name")[0].value = "";
    }
  }
  name_list.innerHTML = "";
  
  for (i = 0; i < save_state.names.length; i++) {
    var item = document.createElement('li');
    var exclusion_list = document.createElement('ul');
    if (typeof save_state.exchange[current_list_id].individual_exclusions[i] === "undefined") {
      save_state.exchange[current_list_id].individual_exclusions[i] = [];
    }
    for (j = 0; j < save_state.names.length; j++) {
      if (i != j) {
        if (typeof save_state.exchange[current_list_id].individual_exclusions[i][j] === "undefined") {
          save_state.exchange[current_list_id].individual_exclusions[i][j] = false;
        }
        var exclusion_item = document.createElement('li');
        exclusion_item.innerHTML = "<a href='javascript:toggle_exclusions_item("+i+","+j+")'>"+save_state.names[j]+"</a>";
        if (save_state.exchange[current_list_id].individual_exclusions[i][j] === true) {
          exclusion_item.innerHTML = "<strike>"+exclusion_item.innerHTML+"</strike>"
        }
        exclusion_list.appendChild(exclusion_item);
      } else {
        save_state.exchange[current_list_id].individual_exclusions[i][j] = true;
      }
      
    }
    item.innerHTML = "<a href='javascript:add_selected("+i+")'>"+save_state.names[i]+"</a>";
    if (save_state.locked[i] < 1) {
      item.innerHTML += " (<a href='javascript:update_name_list("+i+")'>X</a>)";
    }
    item.innerHTML += "\n<ul>" + exclusion_list.innerHTML + "</ul>";
    name_list.appendChild(item);
  }
  update_save_state();
}

function add_selected(selected) {
  update_selected_name_list(selected, 1);
}

function remove_selected(selected) {
  update_selected_name_list(selected, 0);
}

function update_selected_name_list(selected, state) {
  if (selected >= 0 && selected < save_state.exchange[current_list_id].selected.length) {
    if (save_state.exchange[current_list_id].selected[selected] != state) {
      if (state === 1) {
        save_state.locked[selected]++;
      } else {
        save_state.locked[selected]--;
      }
    }
    save_state.exchange[current_list_id].selected[selected] = state;
  }
  selected_list.innerHTML = "";
  var selected_count = 0;
  for (i = 0; i < save_state.exchange[current_list_id].selected.length; i++) {
    if (save_state.exchange[current_list_id].selected[i] == 1) {
      var item = document.createElement('li');
      item.innerHTML = "<a href='javascript:remove_selected("+i+")'>"+save_state.names[i]+"</a>";
      selected_list.appendChild(item);
      selected_count++;
    }
  }
  update_name_list();
  update_suggested(selected_count);
  update_save_state();
}

function toggle_exclusions_item(name,exclusion) {
  save_state.exchange[current_list_id].individual_exclusions[name][exclusion] = !save_state.exchange[current_list_id].individual_exclusions[name][exclusion];
  update_name_list();
}

function update_suggested(count) {
  if (count > 1) {
    document.getElementById("suggested").style.display = 'block';
  } else {
    document.getElementById("suggested").style.display = 'none';
  }
  suggested_pairings.innerHTML = "";

  var temp_pairings = [];

  var item = document.createElement('li');
  item.innerHTML = "No Pairings Yet";
  suggested_pairings.appendChild(item);
}

function update_save_state() {
  if (window.history.replaceState) {
    //prevents browser from storing history with each change:
    window.history.replaceState(null, "", "?data="+encodeURIComponent(JSON.stringify(save_state)));
  }
}

//Enable Enter Key on Add Name form field
var input = document.getElementsByName("name")[0];
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("add").click();
  }
});