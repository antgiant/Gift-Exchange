const urlParams = new URLSearchParams(window.location.search);
var save_state = JSON.parse(urlParams.get('data'));
if (save_state == null) {
  save_state = {
    names:[],
  };
}
var name_list = document.getElementById('name-list');
var selected_list = document.getElementById('selected-list');

function update_name_list() {
  if (document.getElementsByName("name")[0].value != "") {
    save_state.names.push([document.getElementsByName("name")[0].value,0]);
    document.getElementsByName("name")[0].value = "";
  }
  name_list.innerHTML = "";
  
  for (i = 0; i < save_state.names.length; i++) {
    var item = document.createElement('li');
    item.innerHTML = "<a href='javascript:add_selected("+i+")'>"+save_state.names[i][0]+"</a>";
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
  if (selected >= 0 && selected < save_state.names.length) {
    save_state.names[selected][1] = state;
  }
  selected_list.innerHTML = "";

  for (i = 0; i < save_state.names.length; i++) {
    if (save_state.names[i][1] == 1) {
      var item = document.createElement('li');
      item.innerHTML = "<a href='javascript:remove_selected("+i+")'>"+save_state.names[i][0]+"</a>";
      selected_list.appendChild(item);
    }
  }

  update_save_state();
}

function update_save_state() {
  if (window.history.replaceState) {
    //prevents browser from storing history with each change:
    window.history.replaceState(null, "", "?data="+encodeURIComponent(JSON.stringify(save_state)));
  }
}