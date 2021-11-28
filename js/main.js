const urlParams = new URLSearchParams(window.location.search);
var save_state = JSON.parse(urlParams.get('data'));
if (save_state == null) {
  save_state = {
    names:[], 
    selected:[],
  };
}
var name_list = document.getElementById('name-list');
var selected_list = document.getElementById('selected-list');

function add_name() {
  save_state.names.push(document.getElementsByName("name")[0].value);
  document.getElementsByName("name")[0].value = "";
  name_list.innerHTML = "";
  
  for (i = 0; i < save_state.names.length; i++) {
    var item = document.createElement('li');
    item.innerHTML = save_state.names[i];
    name_list.appendChild(item);
  }
  
  update_save_state();
}

function update_save_state() {
  if (window.history.replaceState) {
    //prevents browser from storing history with each change:
    window.history.replaceState(null, "", "?data="+encodeURIComponent(JSON.stringify(save_state)));
  }
}