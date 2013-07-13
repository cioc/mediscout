var resultTemplateStr = "<% _.each(rows, function(row){%><div class='searchDropDown'><div class='searchText'><a href='/<%= row.result_type %>/<%= row.id %>'><%= row.name %></a></div><div class='searchTextDescription'><a><%= row.extra %></a></div></div><% }); %>";

var resultTemplate = _.template(resultTemplateStr);

function search() {
  var v = $('#search').val();
  v = v.replace(' ', '-');
  if (v.length > 0) {
    $.get('/api/search/'+v, function(data){
      console.log(data);
      _.each(data, function(r){
        if (r.result_type == 'procedure') {
          r.extra = translateOption(r.extra);
        }
      });
      $('.searchDropDown').remove();
      $('.inputContainer').append(resultTemplate({rows: data}));
    }, 'json');
  }
  else {
    $('.searchDropDown').remove();
  }
}

function translateOption(op) {
  var pieces = op.split(' ');
  var out = '';
  _.each(pieces, function(p){
    if (p == 'W'){
      out += "With ";
    }
    if (p == 'W/O') {
      out += "Without ";
    }
    if (p == 'CC') {
      out += "Complications / Comorbidities "; 
    }
    if (p == 'MCC') {
      out += "Major Complications / Comorbidites ";
    }
    if (p == 'CC/MCC') {
       out += "(Major) Complications / Comorbidites ";
    }
  }); 
  return out;
}

var myTimeout = null;

$(document).ready(function(){
  $('#search').keydown(function(){
    if (myTimeout != null) {
      clearTimeout(myTimeout);
    }
    myTimeout = setTimeout(search, 100);
  }); 
});
