function onOpen() {
  var ui = SpreadsheetApp.getUi();
  menu = ui.createMenu('Menu')
  menu.addItem('Adicionar Registro', 'addNewEntry');
  menu.addToUi();
  getStudentsData();
}


function addNewEntry(){
  var html = HtmlService.createHtmlOutputFromFile('index.html');
  SpreadsheetApp.getUi().showModalDialog(html,'AddEntry')
}
function getStudentsData(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var classesSheet = spreadsheet.getSheetByName("Turmas");
  var values = classesSheet.getDataRange().getValues();
  var classes = {}
  values = transpose(values);

  values.forEach(column =>{
    classes[column[0]] = column.slice(1).flat().filter(String);
  });
  return classes;
}


function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}


function formulaUpdate() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = spreadsheet.getSheetByName("Data");

  var sheetnames = [];
  var regExp = /^[A-Z]{2} \d{2} M\d+$/;

  spreadsheet.getSheets().forEach(function (x) {
    if (regExp.test(x.getName())) {
      sheetnames.push(x.getName());
    }
  });

  var classes = [];
  var formula = '{{"Aluno","Data","Horário","Motivo","Descrição","Turma"}; SORT({';

  sheetnames.forEach(function (x) {
    var sheetFormula = `'${x}'!$A$2:$E, IF(LEN('${x}'!$A$2:$A), "${x}", "")`;
    formula += '{' + sheetFormula + '};';
    classes.push(x)
  });

  formula = formula.slice(0, -1);

  formula += '})}';

  // console.log(formula);
  dataSheet.getRange('A1').setFormula(formula);
  console.log(classes)
}

function doPost(formData) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var dataSheet = spreadsheet.getSheetByName("Data");

  var lastRow = dataSheet.getLastRow();
 
  var rowData = [
    formData.aluno, 
    formData.data,  
    formData.horario, 
    formData.motivo, 
    formData.observacao, 
    formData.turma 
  ];

  dataSheet.getRange(lastRow + 1, 1, 1, rowData.length).setValues([rowData]);
}
